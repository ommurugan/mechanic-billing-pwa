
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, ArrowRight, Plus, Printer } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import MobileInvoiceCard from "./MobileInvoiceCard";

const ITEMS_PER_PAGE = 10;

type InvoiceStatus = "pending" | "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface DatabaseInvoice {
  id: string;
  invoice_number: string;
  invoice_type: string;
  customer_id: string;
  vehicle_id: string;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  cgst_amount: number;
  sgst_amount: number;
  total_gst_amount: number;
  labor_charges: number;
  extra_charges: any;
  total: number;
  status: InvoiceStatus;
  created_at: string;
  due_date: string;
  paid_at?: string;
  notes?: string;
  kilometers?: number;
}

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<DatabaseInvoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      let query = supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      if (selectedStatus && selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus as InvoiceStatus);
      }

      const { count, data: invoicesData, error } = await query;

      if (error) throw error;

      if (invoicesData) {
        setInvoices(invoicesData);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setIsError(true);
      toast.error("Failed to fetch invoices. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) throw error;

      if (data) setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast.error("Failed to fetch customers. Please try again.");
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;

      if (data) setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
    fetchCustomers();
    fetchVehicles();
  }, [dateRange, selectedStatus]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const customer = customers.find(c => c.id === invoice.customer_id);
    const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);

    const customerName = customer ? customer.name.toLowerCase() : '';
    const vehicleNumber = vehicle ? vehicle.vehicle_number.toLowerCase() : '';
    const invoiceNumber = invoice.invoice_number.toLowerCase();

    const searchTermLower = searchTerm.toLowerCase();

    return (
      customerName.includes(searchTermLower) ||
      vehicleNumber.includes(searchTermLower) ||
      invoiceNumber.includes(searchTermLower)
    );
  });

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDelete = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    }
  };

  const handleEdit = (invoice: DatabaseInvoice) => {
    console.log("Edit invoice:", invoice);
  };

  const handlePrint = (invoice: DatabaseInvoice) => {
    console.log("Print invoice:", invoice);
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('id', invoiceId);

      if (error) throw error;

      setInvoices(invoices.map(invoice =>
        invoice.id === invoiceId ? { ...invoice, status: 'paid' } : invoice
      ));
      toast.success("Invoice marked as paid!");
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      toast.error("Failed to mark invoice as paid. Please try again.");
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>
            Manage and view all your invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="md:w-64"
                  onChange={handleSearch}
                />

                {!isMobileView && (
                  <Select onValueChange={handleStatusChange} defaultValue={selectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          `${format(dateRange.from, "LLL dd, y")} - ${format(
                            dateRange.to,
                            "LLL dd, y"
                          )}`
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from ? dateRange.from : new Date()}
                      selected={dateRange}
                      onSelect={handleDateChange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Invoice
              </Button>
            </div>

            {isMobileView && (
              <div className="mb-4">
                <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>

                {showFilters && (
                  <div className="mt-4 space-y-2">
                    <Select onValueChange={handleStatusChange} defaultValue={selectedStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {isLoading ? (
              <p className="text-center py-8">Loading invoices...</p>
            ) : isError ? (
              <p className="text-center text-red-500 py-8">
                Failed to load invoices. Please try again.
              </p>
            ) : paginatedInvoices.length === 0 ? (
              <p className="text-center py-8">No invoices found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paginatedInvoices.map(invoice => {
                  const customer = customers.find(c => c.id === invoice.customer_id);
                  const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);

                  const customerName = customer ? customer.name : 'Unknown Customer';
                  const vehicleInfo = vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.vehicle_number}` : 'Unknown Vehicle';

                  return (
                    <MobileInvoiceCard
                      key={invoice.id}
                      invoice={invoice}
                      customerName={customerName}
                      vehicleInfo={vehicleInfo}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPrint={handlePrint}
                      onMarkPaid={handleMarkPaid}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Previous
                </Button>
                <span>{`Page ${currentPage} of ${totalPages}`}</span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
