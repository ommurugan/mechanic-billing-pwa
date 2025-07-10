
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Printer, 
  Eye,
  Edit,
  Trash2,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import NonGSTInvoiceForm from "./NonGSTInvoiceForm";
import MobileInvoiceCard from "./MobileInvoiceCard";
import InvoiceViewModal from "./InvoiceViewModal";

const NonGSTInvoiceManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesData, customersData, vehiclesData] = await Promise.all([
        supabase
          .from('invoices')
          .select('*')
          .eq('invoice_type', 'non-gst')
          .order('created_at', { ascending: false }),
        supabase.from('customers').select('*'),
        supabase.from('vehicles').select('*')
      ]);

      if (invoicesData.data) setInvoices(invoicesData.data);
      if (customersData.data) setCustomers(customersData.data);
      if (vehiclesData.data) setVehicles(vehiclesData.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || "Unknown Customer";
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown Vehicle";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (error) throw error;

      toast.success("Invoice marked as paid!");
      fetchData();
    } catch (error) {
      console.error('Error updating invoice:', error);
      toast.error("Failed to update invoice status");
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(invoice.customer_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const invoiceDate = new Date(invoice.created_at);
      const now = new Date();
      switch (dateFilter) {
        case "today":
          matchesDate = invoiceDate.toDateString() === now.toDateString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = invoiceDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleSaveInvoice = (invoice: any) => {
    fetchData();
    setShowCreateForm(false);
    setSelectedInvoice(null);
  };

  const handleViewInvoice = (invoice: any) => {
    setViewInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowCreateForm(true);
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      toast.success("Invoice deleted successfully!");
      fetchData();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error("Failed to delete invoice");
    }
  };

  const handlePrintInvoice = (invoice: any) => {
    setViewInvoice(invoice);
    setShowViewModal(true);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const invoiceStats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0)
  };

  if (showCreateForm) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {selectedInvoice ? 'Edit Non-GST Invoice' : 'Create New Non-GST Invoice'}
          </h2>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false);
            setSelectedInvoice(null);
          }} className="w-full sm:w-auto">
            Back to Non-GST Invoices
          </Button>
        </div>
        
        <NonGSTInvoiceForm 
          onSave={handleSaveInvoice}
          onCancel={() => {
            setShowCreateForm(false);
            setSelectedInvoice(null);
          }}
          existingInvoice={selectedInvoice || undefined}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Non-GST Invoice Management</h1>
          <p className="text-sm md:text-base text-gray-600">Create and manage Non-GST invoices</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Non-GST Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-blue-600">{invoiceStats.total}</p>
              <p className="text-xs md:text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-green-600">{invoiceStats.paid}</p>
              <p className="text-xs md:text-sm text-gray-600">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-yellow-600">{invoiceStats.pending}</p>
              <p className="text-xs md:text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-red-600">{invoiceStats.overdue}</p>
              <p className="text-xs md:text-sm text-gray-600">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="pt-4 md:pt-6">
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-purple-600">₹{invoiceStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs md:text-sm text-gray-600">Revenue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search by invoice number or customer..." 
                  className="pl-10 h-12 md:h-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 md:h-10 md:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-12 md:h-10 md:w-40">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Invoices List */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Non-GST Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription>Manage and track all your Non-GST invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No Non-GST invoices found</p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Create First Non-GST Invoice
                </Button>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(invoice.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-600">
                        {getCustomerName(invoice.customer_id)} • {getVehicleInfo(invoice.vehicle_id)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(invoice.created_at).toLocaleDateString()}
                        {invoice.kilometers && (
                          <span className="ml-2">• KM: {invoice.kilometers.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(invoice.total || 0).toFixed(2)}</p>
                      <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleViewInvoice(invoice)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'pending' && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handlePrintInvoice(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Invoices List */}
      <div className="md:hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Non-GST Invoices ({filteredInvoices.length})</h3>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No Non-GST invoices found</p>
                <Button 
                  onClick={() => setShowCreateForm(true)} 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Create First Non-GST Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <MobileInvoiceCard
                key={invoice.id}
                invoice={invoice}
                customerName={getCustomerName(invoice.customer_id)}
                vehicleInfo={getVehicleInfo(invoice.vehicle_id)}
                onEdit={handleViewInvoice}
                onDelete={handleDeleteInvoice}
                onPrint={handlePrintInvoice}
                onMarkPaid={() => handleMarkAsPaid(invoice.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <InvoiceViewModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setViewInvoice(null);
          }}
          invoice={viewInvoice}
          customer={customers.find(c => c.id === viewInvoice.customer_id)}
          vehicle={vehicles.find(v => v.id === viewInvoice.vehicle_id)}
          onPrint={() => window.print()}
        />
      )}
    </div>
  );
};

export default NonGSTInvoiceManagement;
