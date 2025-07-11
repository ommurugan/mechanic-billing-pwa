
import { DateRange } from "react-day-picker";

export type InvoiceStatus = "pending" | "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface DatabaseInvoice {
  id: string;
  invoice_number: string;
  invoice_type: string;
  customer_id: string;
  vehicle_id: string;
  subtotal: number;
  discount_amount: number;
  discount_percentage: number;
  cgst_amount: number;
  sgst_amount: number;
  total_gst_amount: number;
  labor_charges: number;
  extra_charges: any;
  total: number;
  status: InvoiceStatus;
  created_at: string;
  due_date: string;
  paid_at?: string;
  notes?: string;
  kilometers?: number;
}

export interface InvoiceFilters {
  dateRange: DateRange | undefined;
  searchTerm: string;
  selectedStatus: string;
}
