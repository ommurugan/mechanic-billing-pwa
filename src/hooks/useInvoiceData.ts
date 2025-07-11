
import { DatabaseInvoice } from "@/types/invoice";
import { useInvoiceFetch } from "./useInvoiceFetch";
import { useInvoiceFiltering } from "./useInvoiceFiltering";
import { useInvoiceCrud } from "./useInvoiceCrud";

export type { DatabaseInvoice };

export const useInvoiceData = () => {
  const {
    invoices: allInvoices,
    customers,
    vehicles,
    isLoading,
    isError,
    setInvoices,
  } = useInvoiceFetch({
    dateRange: undefined,
    searchTerm: "",
    selectedStatus: 'pending',
  });

  const {
    currentPage,
    totalPages,
    dateRange,
    searchTerm,
    selectedStatus,
    filteredInvoices,
    filters,
    handlePageChange,
    handleDateChange,
    handleStatusChange,
    handleSearch,
  } = useInvoiceFiltering(allInvoices, customers, vehicles);

  const { handleDelete, handleMarkPaid } = useInvoiceCrud(allInvoices, setInvoices);

  // Update the fetch hook with current filters
  const { refetch } = useInvoiceFetch(filters);

  return {
    invoices: filteredInvoices,
    customers,
    vehicles,
    currentPage,
    totalPages,
    isLoading,
    isError,
    dateRange,
    searchTerm,
    selectedStatus,
    handlePageChange,
    handleDateChange,
    handleStatusChange,
    handleSearch,
    handleDelete,
    handleMarkPaid,
  };
};
