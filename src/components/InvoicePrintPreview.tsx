
import React from 'react';
import { Invoice, Customer, Vehicle } from '@/types/billing';

interface InvoicePrintPreviewProps {
  invoice: Invoice;
  customer: Customer;
  vehicle: Vehicle;
  onClose: () => void;
}

const InvoicePrintPreview = ({ invoice, customer, vehicle, onClose }: InvoicePrintPreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Screen controls - hidden when printing */}
      <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50">
        <h2 className="text-xl font-bold">Invoice Preview</h2>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      {/* Invoice content - this will be printed */}
      <div className="print-content max-w-4xl mx-auto p-8 print:p-4 print:max-w-none print:mx-0">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="h-16 w-16 mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold">OM MURUGAN AUTO WORKS</h1>
              <p className="text-lg mt-2">Complete Auto Care Solutions</p>
            </div>
          </div>
          <p className="text-sm">Phone: +91 98765 43210 | Email: info@ommurugan.com</p>
        </div>

        {/* Invoice Header */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-3">BILL TO:</h2>
            <div className="space-y-1">
              <p className="font-semibold">{customer.name}</p>
              <p>{customer.phone}</p>
              <p>{customer.email}</p>
              {customer.gstNumber && (
                <p><strong>GST No:</strong> {customer.gstNumber}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-2">
              <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {formatDate(invoice.createdAt)}</p>
              <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
              <p><strong>Invoice Type:</strong> {invoice.invoiceType === 'gst' ? 'GST Invoice' : 'Non-GST Invoice'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-gray-50 print:bg-gray-100 p-4 rounded mb-6">
          <h3 className="font-bold mb-2">VEHICLE DETAILS:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
              <p><strong>Registration:</strong> {vehicle.vehicleNumber}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {vehicle.vehicleType}</p>
              {invoice.kilometers && (
                <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-black mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-left">Description</th>
              <th className="border border-black p-2 text-center">HSN/SAC Code</th>
              <th className="border border-black p-2 text-center">Qty</th>
              <th className="border border-black p-2 text-right">Rate</th>
              <th className="border border-black p-2 text-right">Discount</th>
              <th className="border border-black p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-2">
                  {item.name}
                  <div className="text-sm text-gray-600 capitalize">({item.type})</div>
                </td>
                <td className="border border-black p-2 text-center">{(item as any).sac_hsn_code || '-'}</td>
                <td className="border border-black p-2 text-center">{item.quantity}</td>
                <td className="border border-black p-2 text-right">₹{item.unitPrice.toFixed(2)}</td>
                <td className="border border-black p-2 text-right">₹{item.discount.toFixed(2)}</td>
                <td className="border border-black p-2 text-right">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
            {invoice.laborCharges > 0 && (
              <tr>
                <td className="border border-black p-2">Labor Charges</td>
                <td className="border border-black p-2 text-center">-</td>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
                <td className="border border-black p-2 text-right">₹0.00</td>
                <td className="border border-black p-2 text-right">₹{invoice.laborCharges.toFixed(2)}</td>
              </tr>
            )}
            {invoice.extraCharges?.map((charge, index) => (
              <tr key={`extra-${index}`}>
                <td className="border border-black p-2">{charge.name}</td>
                <td className="border border-black p-2 text-center">-</td>
                <td className="border border-black p-2 text-center">1</td>
                <td className="border border-black p-2 text-right">₹{charge.amount.toFixed(2)}</td>
                <td className="border border-black p-2 text-right">₹0.00</td>
                <td className="border border-black p-2 text-right">₹{charge.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div></div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({invoice.discount}%):</span>
                <span>-₹{((invoice.subtotal * invoice.discount) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{invoice.invoiceType === 'gst' ? `GST (${invoice.taxRate}%):` : 'Tax:'}</span>
              <span>₹{invoice.taxAmount.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-black pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
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
        <div className="grid grid-cols-2 gap-8 mt-12">
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
          
          /* Hide the wrapper */
          .fixed {
            display: none !important;
          }
          
          /* Show only the print content */
          .print-content {
            display: block !important;
            position: static !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          /* Ensure only this print content is visible */
          .fixed:not(.print-content) {
            display: none !important;
          }
          
          /* Hide any other modals or overlays */
          [role="dialog"], .modal {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePrintPreview;
