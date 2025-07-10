
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import InvoiceHeader from "./invoice/InvoiceHeader";
import InvoiceBillToSection from "./invoice/InvoiceBillToSection";
import InvoiceVehicleDetails from "./invoice/InvoiceVehicleDetails";
import InvoiceItemsTable from "./invoice/InvoiceItemsTable";
import InvoiceTotalsSection from "./invoice/InvoiceTotalsSection";
import InvoiceFooter from "./invoice/InvoiceFooter";

interface InvoiceViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  customer: any;
  vehicle: any;
  onPrint: () => void;
}

const InvoiceViewModal = ({
  isOpen,
  onClose,
  invoice,
  customer,
  vehicle,
  onPrint
}: InvoiceViewModalProps) => {
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoice?.id && isOpen) {
      fetchInvoiceItems();
    }
  }, [invoice?.id, isOpen]);

  const fetchInvoiceItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id);

      if (error) {
        console.error('Error fetching invoice items:', error);
        return;
      }

      console.log('Fetched invoice items:', data);
      setInvoiceItems(data || []);
    } catch (error) {
      console.error('Error fetching invoice items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!invoice || !customer || !vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Invoice Preview</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={onPrint} size="sm" className="mx-[30px]">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Invoice Content - Styled to match the second image */}
        <div className="print-content bg-white p-6">
          <InvoiceHeader onPrint={onPrint} />
          <InvoiceBillToSection customer={customer} invoice={invoice} />
          <InvoiceVehicleDetails vehicle={vehicle} invoice={invoice} />
          <InvoiceItemsTable 
            invoiceItems={invoiceItems} 
            invoice={invoice} 
            loading={loading} 
          />
          <InvoiceTotalsSection invoice={invoice} />
          <InvoiceFooter invoice={invoice} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceViewModal;
