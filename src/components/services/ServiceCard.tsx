
import React from 'react';
import { Service } from '@/hooks/useSupabaseData';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900">{service.name}</h3>
      <p className="text-sm text-gray-600 mt-1">SAC: {service.sac_code}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-semibold text-blue-600">
          ₹{Number(service.base_price).toLocaleString('en-IN')}
        </span>
        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
          {service.gst_rate}% GST
        </span>
      </div>
      {service.category && (
        <p className="text-xs text-gray-500 mt-2">{service.category}</p>
      )}
    </div>
  );
};

export default ServiceCard;
