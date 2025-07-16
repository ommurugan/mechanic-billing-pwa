
import React from 'react';

interface InvoiceHeaderProps {
  onPrint: () => void;
}

const InvoiceHeader = ({ onPrint }: InvoiceHeaderProps) => {
  return (
    <div className="text-center border-b-2 border-black pb-4 mb-6">
      <div className="flex items-center justify-center mb-2">
        <img src="/lovable-uploads/867f2348-4515-4cb0-8064-a7222ce3b23f.png" alt="OM MURUGAN AUTO WORKS" className="h-12 w-12 mr-3" />
        <div>
          <h1 className="text-2xl font-bold">OM MURUGAN AUTO WORKS</h1>
          <p className="text-sm">Complete Auto Care Solutions</p>
        </div>
      </div>
      <div className="text-xs space-y-1">
        <p>Door No.8, 4th Main Road, Manikandapuram, Thirumullaivoyal,</p>
        <p>Chennai-600 062.</p>
        <div className="flex justify-center gap-4 mt-2">
          <p><strong>GSTIN/UIN:</strong> 33AXNPGZ146F1ZR</p>
          <p><strong>State Name:</strong> Tamil Nadu, <strong>Code:</strong> 33</p>
        </div>
        <div className="flex justify-center gap-4">
          <p><strong>E-Mail:</strong> gopalakrish.p86@gmail.com</p>
          <p><strong>Phone:</strong> + 91 9884551560</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
