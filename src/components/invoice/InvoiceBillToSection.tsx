
import React from 'react';

interface InvoiceBillToSectionProps {
  customer: any;
  invoice: any;
}

const InvoiceBillToSection = ({ customer, invoice }: InvoiceBillToSectionProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="grid grid-cols-2 gap-8 mb-4">
      <div>
        <h3 className="font-bold mb-2">BILL TO:</h3>
        <div className="space-y-1 text-sm">
          <p className="font-semibold">{customer.name}</p>
          <p>{customer.phone}</p>
          <p>{customer.email}</p>
          {customer.gst_number && <p><strong>GST No:</strong> {customer.gst_number}</p>}
        </div>
      </div>
      <div className="text-right">
        <div className="space-y-1 text-sm">
          <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
          <p><strong>Date:</strong> {formatDate(invoice.created_at)}</p>
          <p><strong>Due Date:</strong> {formatDate(invoice.due_date || invoice.created_at)}</p>
          <p><strong>Invoice Type:</strong> {invoice.invoice_type === 'gst' ? 'GST Invoice' : 'Non-GST Invoice'}</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceBillToSection;
