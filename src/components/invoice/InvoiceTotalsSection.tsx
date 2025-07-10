
import React from 'react';

interface InvoiceTotalsSectionProps {
  invoice: any;
}

const InvoiceTotalsSection = ({ invoice }: InvoiceTotalsSectionProps) => {
  return (
    <div className="flex justify-end mb-6">
      <div className="w-64 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{invoice.subtotal.toFixed(2)}</span>
        </div>
        {invoice.invoice_type === 'gst' && (
          <>
            <div className="flex justify-between">
              <span>CGST:</span>
              <span>₹{(invoice.cgst_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST:</span>
              <span>₹{(invoice.sgst_amount || 0).toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="border-t border-black pt-1">
          <div className="flex justify-between font-bold">
            <span>Total Amount:</span>
            <span>₹{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotalsSection;
