
import React from 'react';
import { Part } from '@/hooks/useSupabaseData';

interface PartCardProps {
  part: Part;
}

const PartCard = ({ part }: PartCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900">{part.name}</h3>
      <p className="text-sm text-gray-600 mt-1">HSN: {part.hsn_code}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-semibold text-green-600">
          ₹{Number(part.price).toLocaleString('en-IN')}
        </span>
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {part.gst_rate}% GST
        </span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-600">
          Stock: {part.stock_quantity || 0}
        </span>
        {part.category && (
          <span className="text-xs text-gray-500">{part.category}</span>
        )}
      </div>
    </div>
  );
};

export default PartCard;
