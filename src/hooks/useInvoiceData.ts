
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

const ITEMS_PER_PAGE = 10;

type InvoiceStatus = "pending" | "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface DatabaseInvoice {
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

export const useInvoiceData = () => {
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
        const validStatuses: InvoiceStatus[] = ["pending", "draft", "sent", "paid", "overdue", "cancelled"];
        if (validStatuses.includes(selectedStatus as InvoiceStatus)) {
          query = query.eq('status', selectedStatus);
        }
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

  return {
    invoices: paginatedInvoices,
    customers,
    vehicles,
    currentPage,
    totalPages,
    isLoading,
    isError,
    dateRange,
    searchTerm,
    selectedStatus,
    handlePageChange,
    handleDateChange,
    handleStatusChange,
    handleSearch,
    handleDelete,
    handleMarkPaid,
  };
};
