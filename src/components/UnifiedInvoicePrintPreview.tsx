
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share, Printer, X } from "lucide-react";

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

  const isGSTInvoice = invoice.invoice_type === 'gst';

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
      <div className="print-content max-w-4xl mx-auto p-4 print:p-1 print:max-w-none print:mx-0 bg-white">
        {/* Company Header with Logo */}
        <div className="text-center mb-2 border-b border-black pb-1">
          {/* Logo Section */}
          <div className="flex justify-center items-center mb-1">
            <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center mr-2">
              <div className="text-center">
                <div className="text-[8px] font-bold">OM MURUGAN</div>
                <div className="text-[6px]">AUTO WORKS</div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-black">OM MURUGAN AUTO WORKS</h1>
              <p className="text-xs text-gray-600">Complete Auto Care Solutions</p>
            </div>
          </div>
          
          <p className="text-[10px] text-gray-600 mb-1">
            Door No.8, 4th Main Road, Manikandapuram, Thirumullaivoyal,
          </p>
          <p className="text-[10px] text-gray-600 mb-1">Chennai-600 062</p>
          
          {/* Company details line - show GST details only for GST invoices */}
          {isGSTInvoice && (
            <div className="text-[10px] border-t border-black pt-1">
              <div className="flex justify-center items-center gap-4 mb-1">
                <span><strong>GSTIN/UIN:</strong> 33AXNPGZ468F1ZR</span>
                <span><strong>State Name:</strong> Tamil Nadu, <strong>Code:</strong> 33</span>
              </div>
              <div className="flex justify-center items-center gap-4">
                <span><strong>E-Mail:</strong> gopalakrishn.p8@gmail.com</span>
                <span><strong>Phone:</strong> + 91 9884551560</span>
              </div>
            </div>
          )}
          
          {/* For Non-GST invoices, show simpler contact details */}
          {!isGSTInvoice && (
            <div className="text-[10px] border-t border-black pt-1">
              <div className="flex justify-center items-center gap-4">
                <span><strong>E-Mail:</strong> gopalakrishn.p8@gmail.com</span>
                <span><strong>Phone:</strong> + 91 9884551560</span>
              </div>
            </div>
          )}
        </div>

        {/* Bill To and Invoice Details */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <h3 className="text-xs font-bold mb-1">BILL TO:</h3>
            <div className="text-[10px] space-y-0.5">
              <p className="font-semibold">{customer?.name || 'N/A'}</p>
              <p>{customer?.phone || 'N/A'}</p>
              {customer?.email && <p>- {customer.email}</p>}
              {customer?.address && <p>{customer.address}</p>}
              {isGSTInvoice && customer?.gst_number && (
                <p><strong>GST No:</strong> {customer.gst_number}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] space-y-0.5">
              <p><strong>Invoice No:</strong> {invoice.invoice_number}</p>
              <p><strong>Date:</strong> {formatDate(invoice.created_at)}</p>
              {invoice.due_date && (
                <p><strong>Due Date:</strong> {formatDate(invoice.due_date)}</p>
              )}
              <p><strong>Invoice Type:</strong> {isGSTInvoice ? 'GST Invoice' : 'Non-GST Invoice'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Details */}
        {vehicle && (
          <div className="mb-2">
            <h3 className="text-xs font-bold mb-1">VEHICLE DETAILS:</h3>
            <div className="grid grid-cols-2 gap-4 text-[10px]">
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
        <div className="mb-2">
          <table className="w-full border border-black text-[10px]">
            <thead>
              <tr className="border-b border-black">
                <th className="border-r border-black p-1 text-left font-semibold">Description</th>
                <th className="border-r border-black p-1 text-center font-semibold">HSN/SAC Code</th>
                <th className="border-r border-black p-1 text-center font-semibold">Qty</th>
                <th className="border-r border-black p-1 text-right font-semibold">Rate</th>
                <th className="border-r border-black p-1 text-right font-semibold">Discount</th>
                <th className="p-1 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-2 text-center">Loading items...</td>
                </tr>
              ) : invoiceItems && invoiceItems.length > 0 ? (
                invoiceItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="border-r border-black p-1">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-[8px] text-gray-600">({item.item_type})</div>
                      </div>
                    </td>
                    <td className="border-r border-black p-1 text-center">{item.sac_hsn_code}</td>
                    <td className="border-r border-black p-1 text-center">{item.quantity} {item.unit_type || 'nos'}</td>
                    <td className="border-r border-black p-1 text-right">₹{item.unit_price.toFixed(2)}</td>
                    <td className="border-r border-black p-1 text-right">₹{(item.discount_amount || 0).toFixed(2)}</td>
                    <td className="p-1 text-right">₹{item.total_amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <>
                  {/* Show labor charges if available */}
                  {invoice.labor_charges && invoice.labor_charges > 0 && (
                    <tr className="border-b border-gray-300">
                      <td className="border-r border-black p-1">
                        <span className="font-medium">Labor Charges</span>
                        <div className="text-[8px] text-gray-600">(Service)</div>
                      </td>
                      <td className="border-r border-black p-1 text-center">9988</td>
                      <td className="border-r border-black p-1 text-center">1 nos</td>
                      <td className="border-r border-black p-1 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
                      <td className="border-r border-black p-1 text-right">₹0.00</td>
                      <td className="p-1 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
                    </tr>
                  )}
                  
                  {/* Show extra charges if available */}
                  {invoice.extra_charges && Array.isArray(invoice.extra_charges) && invoice.extra_charges.length > 0 && (
                    invoice.extra_charges.map((charge, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="border-r border-black p-1">
                          <span className="font-medium">{charge.description}</span>
                          <div className="text-[8px] text-gray-600">(Extra Charge)</div>
                        </td>
                        <td className="border-r border-black p-1 text-center">-</td>
                        <td className="border-r border-black p-1 text-center">1 nos</td>
                        <td className="border-r border-black p-1 text-right">₹{charge.amount.toFixed(2)}</td>
                        <td className="border-r border-black p-1 text-right">₹0.00</td>
                        <td className="p-1 text-right">₹{charge.amount.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                  
                  {/* Show message if no items at all */}
                  {(!invoice.labor_charges || invoice.labor_charges === 0) && 
                   (!invoice.extra_charges || !Array.isArray(invoice.extra_charges) || invoice.extra_charges.length === 0) && (
                    <tr>
                      <td colSpan={6} className="p-2 text-center text-gray-500">No items found for this invoice</td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-2">
          <div className="w-64 space-y-1 text-[10px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{(invoice.subtotal || 0).toFixed(2)}</span>
            </div>
            {isGSTInvoice && (
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
            <div className="border-t-2 border-black pt-1">
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>₹{(invoice.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-1">
          <h3 className="text-xs font-bold mb-1">TERMS & CONDITIONS:</h3>
          <div className="text-[8px] space-y-0.5">
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
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .fixed {
            position: static !important;
          }
          
          .print-content {
            max-width: none !important;
            margin: 0 !important;
            padding: 0.2in !important;
            font-size: 9px !important;
            line-height: 1.1 !important;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-1 {
            padding: 0.2in !important;
          }
          
          @page {
            margin: 0.1in;
            size: A4;
          }
          
          /* Compact headers */
          .print-content h1 {
            font-size: 12px !important;
            margin-bottom: 0.05em !important;
          }
          
          .print-content h3 {
            font-size: 8px !important;
            margin-bottom: 0.03em !important;
            margin-top: 0.1em !important;
          }
          
          .print-content p {
            margin: 0.02em 0 !important;
            font-size: 7px !important;
          }
          
          /* Compact table */
          .print-content table {
            margin: 0.05em 0 !important;
            font-size: 7px !important;
            width: 100% !important;
          }
          
          .print-content table th,
          .print-content table td {
            padding: 0.03em 0.05em !important;
            font-size: 7px !important;
          }
          
          /* Force everything on one page */
          .print-content {
            page-break-inside: avoid;
            height: auto;
            overflow: visible;
          }
          
          /* Reduce all margins */
          .mb-2 {
            margin-bottom: 0.05em !important;
          }
          
          .mt-1 {
            margin-top: 0.05em !important;
          }
          
          .pb-1 {
            padding-bottom: 0.03em !important;
          }
          
          .space-y-0\\.5 > * + * {
            margin-top: 0.01em !important;
          }
          
          .space-y-1 > * + * {
            margin-top: 0.01em !important;
          }
          
          /* Grid gap reduction */
          .gap-4 {
            gap: 0.2em !important;
          }
          
          /* Terms section */
          .print-content > div:last-child {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-top: 0.03em !important;
          }
          
          /* Text sizes */
          .text-\\[8px\\] {
            font-size: 6px !important;
          }
          
          .text-\\[10px\\] {
            font-size: 7px !important;
          }
          
          .text-xs {
            font-size: 7px !important;
          }
          
          .text-xl {
            font-size: 12px !important;
          }
          
          /* Border adjustments */
          .border-b {
            border-bottom-width: 1px !important;
          }
          
          .border-t-2 {
            border-top-width: 1px !important;
          }
          
          /* Logo size adjustment for print */
          .w-12 {
            width: 2rem !important;
          }
          
          .h-12 {
            height: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default UnifiedInvoicePrintPreview;
