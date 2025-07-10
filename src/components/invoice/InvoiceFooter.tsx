
import React from 'react';

interface InvoiceFooterProps {
  invoice: any;
}

const InvoiceFooter = ({ invoice }: InvoiceFooterProps) => {
  return (
    <>
      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">NOTES:</h3>
          <p className="text-sm border p-3 rounded">{invoice.notes}</p>
        </div>
      )}

      {/* Terms and Signature */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h3 className="font-bold mb-2">TERMS & CONDITIONS:</h3>
          <div className="text-xs space-y-1">
            <p>• Payment is due within 30 days</p>
            <p className="mx-[30px]">• All services carry warranty as per terms</p>
            <p>• Vehicle will be released only after payment</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceFooter;
