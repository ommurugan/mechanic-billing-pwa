import React from 'react';
import { Button } from "@/components/ui/button";
import { Share, Printer, X } from "lucide-react";
import InvoiceHeader from "./invoice/InvoiceHeader";
import InvoiceItemsTable from "./invoice/InvoiceItemsTable";

interface UnifiedInvoicePrintPreviewProps {
  invoice: any;
  customer: any;
  vehicle: any;
  invoiceItems?: any[];
  loading?: boolean;
  onClose: () => void;
}

const UnifiedInvoicePrintPreview = ({ 
  invoice, 
  customer, 
  vehicle, 
  invoiceItems = [], 
  loading = false,
  onClose 
}: UnifiedInvoicePrintPreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if ('share' in navigator && navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoice_number}`,
          text: `Invoice ${invoice.invoice_number} for ${customer?.name || 'Customer'}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - just show an alert with the invoice details
      alert(`Invoice ${invoice.invoice_number} for ${customer?.name || 'Customer'}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Screen controls - hidden when printing */}
      <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0">
        <h2 className="text-xl font-bold">Invoice Preview</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      {/* Invoice content - this will be printed */}
      <div className="print-content max-w-4xl mx-auto p-8 print:p-4 print:max-w-none print:mx-0">
        {/* Header */}
        <InvoiceHeader onPrint={handlePrint} />

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-bold mb-3">BILL TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold">{customer?.name || 'N/A'}</p>
              <p>{customer?.phone || 'N/A'}</p>
              {customer?.email && <p>{customer.email}</p>}
              {customer?.address && <p>{customer.address}</p>}
              {customer?.gst_number && (
                <p><strong>GST No:</strong> {customer.gst_number}</p>
              )}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="space-y-2">
              <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
              <p><strong>Date:</strong> {formatDate(invoice.created_at)}</p>
              {invoice.due_date && (
                <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
              )}
              <p><strong>Invoice Type:</strong> {invoice.invoice_type === 'gst' ? 'GST Invoice' : 'Non-GST Invoice'}</p>
              <p><strong>Status:</strong> <span className="capitalize">{invoice.status}</span></p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        {vehicle && (
          <div className="bg-gray-50 print:bg-gray-100 p-4 rounded mb-6">
            <h3 className="font-bold mb-2">VEHICLE DETAILS:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
                <p><strong>Registration:</strong> {vehicle.vehicle_number}</p>
              </div>
              <div>
                <p><strong>Type:</strong> {vehicle.vehicle_type}</p>
                {vehicle.year && <p><strong>Year:</strong> {vehicle.year}</p>}
                {invoice.kilometers && (
                  <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Items Table */}
        <InvoiceItemsTable 
          invoiceItems={invoiceItems}
          invoice={invoice}
          loading={loading}
        />

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{(invoice.subtotal || 0).toFixed(2)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{(invoice.discount_amount || 0).toFixed(2)}</span>
              </div>
            )}
            {invoice.invoice_type === 'gst' && invoice.total_gst_amount > 0 && (
              <>
                <div className="flex justify-between">
                  <span>CGST:</span>
                  <span>₹{(invoice.cgst_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST:</span>
                  <span>₹{(invoice.sgst_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total GST:</span>
                  <span>₹{(invoice.total_gst_amount || 0).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="border-t-2 border-black pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">NOTES:</h3>
            <p className="text-sm border p-3 rounded">{invoice.notes}</p>
          </div>
        )}

        {/* Terms and Signature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div>
            <h3 className="font-bold mb-2">TERMS & CONDITIONS:</h3>
            <div className="text-sm space-y-1">
              <p>• Payment is due within 30 days</p>
              <p>• All services carry warranty as per terms</p>
              <p>• Vehicle will be released only after payment</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-black mt-16 pt-2">
              <p className="font-bold">Authorized Signature</p>
              <p className="text-sm">OM MURUGAN AUTO WORKS</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .fixed {
            position: static !important;
          }
          
          .print-content {
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};

export default UnifiedInvoicePrintPreview;