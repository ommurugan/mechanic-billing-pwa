export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  createdAt: string;
  lastServiceDate?: string;
  totalSpent: number;
  loyaltyPoints: number;
  notes?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year?: number;
  vehicleNumber: string;
  vehicleType: 'car' | 'bike' | 'scooter';
  engineNumber?: string;
  chassisNumber?: string;
  color?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  estimatedTime: number; // in minutes
  description?: string;
  isActive: boolean;
}

export interface Part {
  id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  supplier?: string;
  partNumber?: string;
  isActive: boolean;
}

export interface InvoiceItem {
  id: string;
  type: 'service' | 'part';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'upi' | 'netbanking';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt: string;
  refundAmount?: number;
  refundReason?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: 'gst' | 'non-gst';
  customerId: string;
  vehicleId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  extraCharges: Array<{
    name: string;
    amount: number;
  }>;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'pending' | 'overdue' | 'cancelled';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  laborCharges: number;
  payments: Payment[];
  kilometers?: number;
}

export interface ServiceHistory {
  id: string;
  vehicleId: string;
  invoiceId: string;
  serviceDate: string;
  services: string[];
  parts: string[];
  totalAmount: number;
  mileage?: number;
  nextServiceDue?: string;
  notes?: string;
}
