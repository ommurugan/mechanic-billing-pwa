import MobileInvoiceCard from "../MobileInvoiceCard";
import { DatabaseInvoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: DatabaseInvoice[];
  customers: any[];
  vehicles: any[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (invoice: DatabaseInvoice) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: DatabaseInvoice) => void;
  onMarkPaid: (invoiceId: string) => void;
}

export const InvoiceList = ({
  invoices,
  customers,
  vehicles,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onPrint,
  onMarkPaid,
}: InvoiceListProps) => {
  if (isLoading) {
    return <p className="text-center py-8">Loading invoices...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-8">
        Failed to load invoices. Please try again.
      </p>
    );
  }

  if (invoices.length === 0) {
    return <p className="text-center py-8">No invoices found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {invoices.map(invoice => {
        const customer = customers.find(c => c.id === invoice.customer_id);
        const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);

        const customerName = customer ? customer.name : 'Unknown Customer';
        const vehicleInfo = vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.vehicle_number}` : 'Unknown Vehicle';

        return (
          <MobileInvoiceCard
            key={invoice.id}
            invoice={invoice}
            customerName={customerName}
            vehicleInfo={vehicleInfo}
            onEdit={onEdit}
            onDelete={onDelete}
            onPrint={onPrint}
            onMarkPaid={onMarkPaid}
          />
        );
      })}
    </div>
  );
};
