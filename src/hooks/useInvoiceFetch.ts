
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DatabaseInvoice, InvoiceStatus, InvoiceFilters } from "@/types/invoice";

export const useInvoiceFetch = (filters: InvoiceFilters) => {
  const [invoices, setInvoices] = useState<DatabaseInvoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchInvoices = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      let query = supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters.dateRange?.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange?.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }

      if (filters.selectedStatus && filters.selectedStatus !== 'all') {
        const validStatuses: InvoiceStatus[] = ["pending", "draft", "sent", "paid", "overdue", "cancelled"];
        if (validStatuses.includes(filters.selectedStatus as InvoiceStatus)) {
          query = query.eq('status', filters.selectedStatus as InvoiceStatus);
        }
      }

      const { data: invoicesData, error } = await query;

      if (error) throw error;

      if (invoicesData) {
        setInvoices(invoicesData);
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
    fetchInvoices();
  }, [filters.dateRange, filters.selectedStatus]);

  useEffect(() => {
    fetchCustomers();
    fetchVehicles();
  }, []);

  return {
    invoices,
    customers,
    vehicles,
    isLoading,
    isError,
    refetch: fetchInvoices,
    setInvoices,
  };
};
