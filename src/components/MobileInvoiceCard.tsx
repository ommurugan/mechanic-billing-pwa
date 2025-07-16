
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye,
  Printer,
  Trash2,
  Check,
  Clock,
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
  onMarkPaid?: (invoiceId: string) => void;
}

const MobileInvoiceCard = ({ 
  invoice, 
  customerName, 
  vehicleInfo, 
  onEdit, 
  onDelete, 
  onPrint,
  onMarkPaid
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
      case 'draft': return <Receipt className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {getStatusIcon(invoice.status)}
            </div>
            <div>
              <p className="font-medium text-sm">{invoice.invoice_number}</p>
              <Badge variant={getStatusColor(invoice.status)} className="text-xs mt-1">
                {invoice.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{(invoice.total || 0).toFixed(2)}</p>
            <p className="text-xs text-gray-500">
              Tax: ₹{(invoice.total_gst_amount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <p className="text-sm text-gray-600">{customerName}</p>
          <p className="text-sm text-gray-600">{vehicleInfo}</p>
          <p className="text-xs text-gray-500">
            Created: {new Date(invoice.created_at).toLocaleDateString()}
          </p>
          {invoice.kilometers && (
            <p className="text-xs text-gray-500">
              KM: {invoice.kilometers.toLocaleString()}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(invoice)} className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          {invoice.status === 'pending' && onMarkPaid && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onMarkPaid(invoice.id)}
              className="text-green-600 hover:text-green-700"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          
          <Button size="sm" variant="ghost" onClick={() => onPrint(invoice)}>
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onDelete(invoice.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileInvoiceCard;
