
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface InvoiceFiltersProps {
  searchTerm: string;
  selectedStatus: string;
  dateRange: DateRange | undefined;
  isMobileView: boolean;
  showFilters: boolean;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (status: string) => void;
  onDateChange: (dateRange: DateRange | undefined) => void;
  onToggleFilters: () => void;
}

export const InvoiceFilters = ({
  searchTerm,
  selectedStatus,
  dateRange,
  isMobileView,
  showFilters,
  onSearch,
  onStatusChange,
  onDateChange,
  onToggleFilters,
}: InvoiceFiltersProps) => {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <Input
          type="search"
          placeholder="Search invoices..."
          className="md:w-64"
          onChange={onSearch}
        />

        {!isMobileView && (
          <Select onValueChange={onStatusChange} defaultValue={selectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, "LLL dd, y")} - ${format(
                    dateRange.to,
                    "LLL dd, y"
                  )}`
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from ? dateRange.from : new Date()}
              selected={dateRange}
              onSelect={onDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {isMobileView && (
        <div className="mb-4">
          <Button variant="secondary" onClick={onToggleFilters}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {showFilters && (
            <div className="mt-4 space-y-2">
              <Select onValueChange={onStatusChange} defaultValue={selectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </>
  );
};
