
import React from 'react';

interface InvoiceVehicleDetailsProps {
  vehicle: any;
  invoice: any;
}

const InvoiceVehicleDetails = ({ vehicle, invoice }: InvoiceVehicleDetailsProps) => {
  return (
    <div className="bg-gray-50 p-3 rounded mb-4">
      <h3 className="font-bold mb-2">VEHICLE DETAILS:</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
          <p><strong>Registration:</strong> {vehicle.vehicle_number}</p>
        </div>
        <div>
          <p><strong>Type:</strong> {vehicle.vehicle_type}</p>
          {invoice.kilometers && <p><strong>Kilometers:</strong> {invoice.kilometers.toLocaleString()} km</p>}
        </div>
      </div>
    </div>
  );
};

export default InvoiceVehicleDetails;
