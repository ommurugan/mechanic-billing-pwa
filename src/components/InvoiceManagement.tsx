
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInvoiceData } from "@/hooks/useInvoiceData";
import { DatabaseInvoice } from "@/types/invoice";
import { InvoiceFilters } from "./invoice/InvoiceFilters";
import { InvoiceList } from "./invoice/InvoiceList";
import { InvoicePagination } from "./invoice/InvoicePagination";

const InvoiceManagement = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    invoices,
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
  } = useInvoiceData();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEdit = (invoice: DatabaseInvoice) => {
    console.log("Edit invoice:", invoice);
  };

  const handlePrint = (invoice: DatabaseInvoice) => {
    console.log("Print invoice:", invoice);
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>
            Manage and view all your invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between">
              <InvoiceFilters
                searchTerm={searchTerm}
                selectedStatus={selectedStatus}
                dateRange={dateRange}
                isMobileView={isMobileView}
                showFilters={showFilters}
                onSearch={handleSearch}
                onStatusChange={handleStatusChange}
                onDateChange={handleDateChange}
                onToggleFilters={() => setShowFilters(!showFilters)}
              />

              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Invoice
              </Button>
            </div>

            <InvoiceList
              invoices={invoices}
              customers={customers}
              vehicles={vehicles}
              isLoading={isLoading}
              isError={isError}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPrint={handlePrint}
              onMarkPaid={handleMarkPaid}
            />

            <InvoicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceManagement;
