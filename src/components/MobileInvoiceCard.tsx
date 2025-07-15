
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Printer, 
  Check, 
  Clock,
  Eye,
  CheckCircle,
  AlertCircle,
  Receipt,
  X
} from "lucide-react";

interface MobileInvoiceCardProps {
  invoice: any;
  customerName: string;
  vehicleInfo: string;
  onEdit: (invoice: any) => void;
  onDelete: (invoiceId: string) => void;
  onPrint: (invoice: any) => void;
  onMarkPaid: () => void;
  onUndoPaid: () => void;
  onView?: (invoice: any) => void;
}

const MobileInvoiceCard = ({ 
  invoice, 
  customerName, 
  vehicleInfo, 
  onEdit, 
  onDelete, 
  onPrint, 
  onMarkPaid, 
  onUndoPaid,
  onView 
}: MobileInvoiceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      case 'draft': return 'outline';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'draft': return <Edit className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with status */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {getStatusIcon(invoice.status)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{invoice.invoice_number}</p>
                <Badge variant={getStatusColor(invoice.status)} className="capitalize text-xs">
                  {invoice.status}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">₹{(invoice.total || 0).toFixed(2)}</p>
              {invoice.invoice_type === 'gst' && invoice.total_gst_amount > 0 && (
                <p className="text-xs text-gray-500">Tax: ₹{(invoice.total_gst_amount || 0).toFixed(2)}</p>
              )}
            </div>
          </div>

          {/* Customer and Vehicle Info */}
          <div className="space-y-1">
            <p className="text-sm text-gray-600"><strong>Customer:</strong> {customerName}</p>
            <p className="text-sm text-gray-600"><strong>Vehicle:</strong> {vehicleInfo}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(invoice.created_at).toLocaleDateString()}
              {invoice.kilometers && (
                <span className="ml-2">• KM: {invoice.kilometers.toLocaleString()}</span>
              )}
            </p>
            {invoice.invoice_type === 'gst' && invoice.customer_id && (
              <p className="text-xs text-gray-500">GST Number available</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {onView && (
              <Button size="sm" variant="outline" onClick={() => onView(invoice)} className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => onEdit(invoice)} className="flex-1">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={() => onPrint(invoice)} className="flex-1">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {invoice.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={onMarkPaid}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <Check className="h-4 w-4 mr-1" />
                Mark Paid
              </Button>
            )}
            {invoice.status === 'paid' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={onUndoPaid}
                className="text-orange-600 border-orange-600 hover:bg-orange-50 flex-1"
              >
                <Clock className="h-4 w-4 mr-1" />
                Undo Paid
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onDelete(invoice.id)}
              className="text-red-500 border-red-500 hover:bg-red-50 flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileInvoiceCard;
