
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DatabaseInvoice } from "@/types/invoice";

export const useInvoiceCrud = (
  invoices: DatabaseInvoice[],
  setInvoices: (invoices: DatabaseInvoice[]) => void
) => {
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
    handleDelete,
    handleMarkPaid,
  };
};
