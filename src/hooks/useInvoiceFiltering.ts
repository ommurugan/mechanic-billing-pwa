
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { DatabaseInvoice, InvoiceFilters } from "@/types/invoice";

const ITEMS_PER_PAGE = 10;

export const useInvoiceFiltering = (invoices: DatabaseInvoice[], customers: any[], vehicles: any[]) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const customer = customers.find(c => c.id === invoice.customer_id);
    const vehicle = vehicles.find(v => v.id === invoice.vehicle_id);

    const customerName = customer ? customer.name.toLowerCase() : '';
    const vehicleNumber = vehicle ? vehicle.vehicle_number.toLowerCase() : '';
    const invoiceNumber = invoice.invoice_number.toLowerCase();

    const searchTermLower = searchTerm.toLowerCase();

    return (
      customerName.includes(searchTermLower) ||
      vehicleNumber.includes(searchTermLower) ||
      invoiceNumber.includes(searchTermLower)
    );
  });

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filters: InvoiceFilters = {
    dateRange,
    searchTerm,
    selectedStatus,
  };

  return {
    currentPage,
    totalPages,
    dateRange,
    searchTerm,
    selectedStatus,
    filteredInvoices: paginatedInvoices,
    filters,
    handlePageChange,
    handleDateChange,
    handleStatusChange,
    handleSearch,
  };
};
