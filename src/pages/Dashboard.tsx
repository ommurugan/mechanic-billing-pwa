import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Car, Receipt, DollarSign, TrendingUp, Calendar, Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import InvoiceViewModal from "@/components/InvoiceViewModal";
import { supabase } from "@/integrations/supabase/client";
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalVehicles: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [customersData, vehiclesData, invoicesData] = await Promise.all([supabase.from('customers').select('*'), supabase.from('vehicles').select('*'), supabase.from('invoices').select('*').order('created_at', {
        ascending: false
      })]);
      if (customersData.data) setCustomers(customersData.data);
      if (vehiclesData.data) setVehicles(vehiclesData.data);
      if (invoicesData.data) {
        const invoices = invoicesData.data;
        setRecentInvoices(invoices.slice(0, 5)); // Get last 5 invoices

        // Calculate stats
        const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0);
        setStats({
          totalCustomers: customersData.data?.length || 0,
          totalVehicles: vehiclesData.data?.length || 0,
          totalInvoices: invoices.length,
          totalRevenue,
          paidInvoices: invoices.filter(inv => inv.status === 'paid').length,
          pendingInvoices: invoices.filter(inv => inv.status === 'pending').length,
          overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
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
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };
  const handleInvoiceClick = (invoice: any) => {
    const customer = customers.find(c => c.id === invoice.customer_id);
    const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);
    if (customer && vehicle) {
      setSelectedInvoice(invoice);
      setSelectedCustomer(customer);
      setSelectedVehicle(vehicle);
      setShowInvoiceModal(true);
    }
  };
  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedInvoice(null);
    setSelectedCustomer(null);
    setSelectedVehicle(null);
  };
  const handlePrint = () => {
    window.print();
  };
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 pt-16 md:pt-4 my-0 py-[31px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm md:text-base text-gray-600">Welcome back! Here's your business overview.</p>
              </div>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                    <Users className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                    </div>
                    <Car className="h-6 md:h-8 w-6 md:w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
                    </div>
                    <Receipt className="h-6 md:h-8 w-6 md:w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-lg md:text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-6 md:h-8 w-6 md:w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                      <p className="text-xl font-bold text-green-600">{stats.paidInvoices}</p>
                    </div>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                      <p className="text-xl font-bold text-yellow-600">{stats.pendingInvoices}</p>
                    </div>
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                      <p className="text-xl font-bold text-red-600">{stats.overdueInvoices}</p>
                    </div>
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest invoices and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentInvoices.length === 0 ? <div className="text-center py-4">
                    <p className="text-gray-500">No recent activity</p>
                  </div> : <div className="space-y-4">
                    {recentInvoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleInvoiceClick(invoice)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getStatusIcon(invoice.status)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{invoice.invoice_number}</p>
                            <p className="text-xs text-gray-600">
                              {getCustomerName(invoice.customer_id)} • {getVehicleInfo(invoice.vehicle_id)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{(invoice.total || 0).toLocaleString()}</p>
                          <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <BottomNavigation />

      {/* Invoice View Modal */}
      {selectedInvoice && selectedCustomer && selectedVehicle && <InvoiceViewModal isOpen={showInvoiceModal} onClose={handleCloseInvoiceModal} invoice={selectedInvoice} customer={selectedCustomer} vehicle={selectedVehicle} onPrint={handlePrint} />}
    </div>;
};
export default Dashboard;