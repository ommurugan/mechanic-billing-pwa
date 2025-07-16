
import React from 'react';

interface InvoiceItemsTableProps {
  invoiceItems: any[];
  invoice: any;
  loading: boolean;
}

const InvoiceItemsTable = ({ invoiceItems, invoice, loading }: InvoiceItemsTableProps) => {
  return (
    <table className="w-full border-collapse border border-black mb-4 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-black p-2 text-left">Description</th>
          <th className="border border-black p-2 text-left">HSN/SAC Code</th>
          <th className="border border-black p-2 text-center">Qty</th>
          <th className="border border-black p-2 text-right">Rate</th>
          <th className="border border-black p-2 text-right">Discount</th>
          <th className="border border-black p-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {/* Display invoice items */}
        {invoiceItems.map((item: any, index: number) => (
          <tr key={index}>
            <td className="border border-black p-2">
              {item.name}
              <div className="text-xs text-gray-600 capitalize">({item.item_type})</div>
            </td>
            <td className="border border-black p-2">{item.sac_hsn_code || '-'}</td>
            <td className="border border-black p-2 text-center">{item.quantity}</td>
            <td className="border border-black p-2 text-right">₹{item.unit_price.toFixed(2)}</td>
            <td className="border border-black p-2 text-right">₹{(item.discount_amount || 0).toFixed(2)}</td>
            <td className="border border-black p-2 text-right">₹{item.total_amount.toFixed(2)}</td>
          </tr>
        ))}
        
        {/* Labor charges if present */}
        {invoice.labor_charges > 0 && (
          <tr>
            <td className="border border-black p-2">
              Labor Charges
              <div className="text-xs text-gray-600">(Service)</div>
            </td>
            <td className="border border-black p-2">-</td>
            <td className="border border-black p-2 text-center">1</td>
            <td className="border border-black p-2 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
            <td className="border border-black p-2 text-right">₹0.00</td>
            <td className="border border-black p-2 text-right">₹{invoice.labor_charges.toFixed(2)}</td>
          </tr>
        )}
        
        {/* Extra charges if present */}
        {invoice.extra_charges?.map((charge: any, index: number) => (
          <tr key={`extra-${index}`}>
            <td className="border border-black p-2">
              {charge.name}
              <div className="text-xs text-gray-600">(Extra Charge)</div>
            </td>
            <td className="border border-black p-2">-</td>
            <td className="border border-black p-2 text-center">1</td>
            <td className="border border-black p-2 text-right">₹{charge.amount.toFixed(2)}</td>
            <td className="border border-black p-2 text-right">₹0.00</td>
            <td className="border border-black p-2 text-right">₹{charge.amount.toFixed(2)}</td>
          </tr>
        ))}
        
        {/* Show loading state or empty message */}
        {loading && (
          <tr>
            <td colSpan={6} className="border border-black p-4 text-center">
              Loading invoice items...
            </td>
          </tr>
        )}
        
        {!loading && invoiceItems.length === 0 && invoice.labor_charges === 0 && (!invoice.extra_charges || invoice.extra_charges.length === 0) && (
          <tr>
            <td colSpan={6} className="border border-black p-4 text-center text-gray-500">
              No items found for this invoice
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InvoiceItemsTable;
