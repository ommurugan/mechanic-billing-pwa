
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Customer = Tables<'customers'>;
export type Vehicle = Tables<'vehicles'>;
export type Service = Tables<'services'>;
export type Part = Tables<'parts'>;
export type Invoice = Tables<'invoices'>;
export type InvoiceItem = Tables<'invoice_items'>;
export type Payment = Tables<'payments'>;

export const useSupabaseData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setCustomers(data);
    }
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setServices(data);
    }
  };

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from('parts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setParts(data);
    }
  };

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setInvoices(data);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchCustomers(),
      fetchServices(),
      fetchParts(),
      fetchInvoices()
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    customers,
    services,
    parts,
    invoices,
    loading,
    refetch: fetchAllData,
    fetchCustomers,
    fetchServices,
    fetchParts,
    fetchInvoices
  };
};
