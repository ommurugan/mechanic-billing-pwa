
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
      <div className="print-content max-w-4xl mx-auto p-6 print:p-4 print:max-w-none print:mx-0 bg-white">
        {/* Company Header */}
        <div className="text-center mb-6 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-black">OM MURUGAN AUTO WORKS</h1>
          <p className="text-sm text-gray-600 mb-2">Complete Auto Care Solutions</p>
          <p className="text-xs text-gray-600 mb-1">
            Door No.8, 4th Main Road, Manikandapuram, Thirumullaivoyal,
          </p>
          <p className="text-xs text-gray-600 mb-1">Chennai-600 062</p>
          <div className="flex justify-center items-center gap-4 text-xs">
            <span><strong>GSTIN/UIN:</strong> 33AXNPGZ468F1ZR</span>
            <span><strong>State Name:</strong> Tamil Nadu, <strong>Code:</strong> 33</span>
          </div>
          <div className="flex justify-center items-center gap-4 text-xs mt-1">
            <span><strong>E-Mail:</strong> gopalakrishn.p8@gmail.com</span>
            <span><strong>Phone:</strong> + 91 9884551560</span>
          </div>
        </div>

        {/* Bill To and Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-sm font-bold mb-2">BILL TO:</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{customer?.name || 'N/A'}</p>
              <p>{customer?.phone || 'N/A'}</p>
              {customer?.email && <p>- {customer.email}</p>}
              {customer?.address && <p>{customer.address}</p>}
              {customer?.gst_number && (
                <p><strong>GST No:</strong> {customer.gst_number}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm space-y-1">
              <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
              <p><strong>Date:</strong> {formatDate(invoice.created_at)}</p>
              {invoice.due_date && (
                <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
              )}
              <p><strong>Invoice Type:</strong> {invoice.invoice_type === 'gst' ? 'GST Invoice' : 'Non-GST Invoice'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        {vehicle && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-2">VEHICLE DETAILS:</h3>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
                <p><strong>Registration:</strong> {vehicle.vehicle_number}</p>
              </div>
              <div>
                <p><strong>Type:</strong> {vehicle.vehicle_type}</p>
                {invoice.kilometers && (
                  <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-2 text-left font-semibold">Description</th>
                <th className="border-r border-black p-2 text-center font-semibold">HSN/SAC Code</th>
                <th className="border-r border-black p-2 text-center font-semibold">Qty</th>
                <th className="border-r border-black p-2 text-right font-semibold">Rate</th>
                <th className="border-r border-black p-2 text-right font-semibold">Discount</th>
                <th className="p-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center">Loading items...</td>
                </tr>
              ) : invoiceItems && invoiceItems.length > 0 ? (
                invoiceItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border-r border-black p-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-xs text-gray-600">({item.item_type})</div>
                      </div>
                    </td>
                    <td className="border-r border-black p-2 text-center">{item.sac_hsn_code}</td>
                    <td className="border-r border-black p-2 text-center">{item.quantity} {item.unit_type || 'nos'}</td>
                    <td className="border-r border-black p-2 text-right">₹{item.unit_price.toFixed(2)}</td>
                    <td className="border-r border-black p-2 text-right">₹{(item.discount_amount || 0).toFixed(2)}</td>
                    <td className="p-2 text-right">₹{item.total_amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Show labor charges if available */}
                  {invoice.labor_charges && invoice.labor_charges > 0 && (
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-black p-2">
                        <span className="font-medium">Labor Charges</span>
                        <div className="text-xs text-gray-600">(Service)</div>
                      </td>
                      <td className="border-r border-black p-2 text-center">9988</td>
                      <td className="border-r border-black p-2 text-center">1 nos</td>
                      <td className="border-r border-black p-2 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
                      <td className="border-r border-black p-2 text-right">₹0.00</td>
                      <td className="p-2 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
                    </tr>
                  )}
                  
                  {/* Show extra charges if available */}
                  {invoice.extra_charges && Array.isArray(invoice.extra_charges) && invoice.extra_charges.length > 0 && (
                    invoice.extra_charges.map((charge, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="border-r border-black p-2">
                          <span className="font-medium">{charge.description}</span>
                          <div className="text-xs text-gray-600">(Extra Charge)</div>
                        </td>
                        <td className="border-r border-black p-2 text-center">-</td>
                        <td className="border-r border-black p-2 text-center">1 nos</td>
                        <td className="border-r border-black p-2 text-right">₹{charge.amount.toFixed(2)}</td>
                        <td className="border-r border-black p-2 text-right">₹0.00</td>
                        <td className="p-2 text-right">₹{charge.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                  
                  {/* Show message if no items at all */}
                  {(!invoice.labor_charges || invoice.labor_charges === 0) && 
                   (!invoice.extra_charges || !Array.isArray(invoice.extra_charges) || invoice.extra_charges.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">No items found for this invoice</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-6">
          <div className="w-80 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{(invoice.subtotal || 0).toFixed(2)}</span>
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
            <div className="border-t-2 border-black pt-2">
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹{(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-8">
          <h3 className="text-sm font-bold mb-2">TERMS & CONDITIONS:</h3>
          <div className="text-xs space-y-1">
            <p>• Payment is due within 30 days</p>
            <p>• All services carry warranty as per terms</p>
            <p>• Vehicle will be released only after payment</p>
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
            padding: 15px !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          /* Ensure single page printing */
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Prevent page breaks within important sections */
          .print-content > div {
            page-break-inside: avoid;
          }
          
          /* Optimize space usage */
          .print-content {
            font-size: 12px;
            line-height: 1.4;
          }
          
          .print-content h1, .print-content h2, .print-content h3 {
            margin-top: 0;
            margin-bottom: 0.5em;
          }
          
          .print-content p {
            margin: 0.2em 0;
          }
          
          .print-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.5em 0;
          }
        }
      `}</style>
    </div>
  );
};

export default UnifiedInvoicePrintPreview;
