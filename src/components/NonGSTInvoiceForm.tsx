
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2,
  Car,
  User,
  Receipt,
  CreditCard,
  Save,
  Gauge,
  X
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CustomerForm from "./CustomerForm";

interface NonGSTInvoiceFormProps {
  onSave: (invoice: any) => void;
  onCancel: () => void;
  existingInvoice?: any;
}

const NonGSTInvoiceForm = ({ onSave, onCancel, existingInvoice }: NonGSTInvoiceFormProps) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [kilometers, setKilometers] = useState<number>(0);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [laborCharges, setLaborCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [extraCharges, setExtraCharges] = useState<Array<{name: string; amount: number}>>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'netbanking'>('cash');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const fetchData = async () => {
    try {
      const [customersData, servicesData, partsData] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('services').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('parts').select('*').eq('is_active', true).order('created_at', { ascending: false })
      ]);

      if (customersData.data) setCustomers(customersData.data);
      if (servicesData.data) setServices(servicesData.data);
      if (partsData.data) setParts(partsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchVehicles = async (customerId: string) => {
    try {
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('customer_id', customerId);
      
      if (data) setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchVehicles(selectedCustomer.id);
    }
  }, [selectedCustomer]);

  const customerVehicles = vehicles;

  const addService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service && !invoiceItems.find(item => item.item_id === serviceId && item.item_type === 'service')) {
      const newItem = {
        id: Date.now().toString(),
        item_type: 'service',
        item_id: service.id,
        name: service.name,
        sac_hsn_code: service.sac_code,
        quantity: 1,
        unit_price: service.base_price,
        discount_amount: 0,
        gst_rate: service.gst_rate,
        total_amount: service.base_price
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const addPart = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    if (part && !invoiceItems.find(item => item.item_id === partId && item.item_type === 'part')) {
      const newItem = {
        id: Date.now().toString(),
        item_type: 'part',
        item_id: part.id,
        name: part.name,
        sac_hsn_code: part.hsn_code,
        quantity: 1,
        unit_price: part.price,
        discount_amount: 0,
        gst_rate: part.gst_rate,
        total_amount: part.price
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }
  };

  const removeItem = (itemId: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== itemId));
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, quantity, total_amount: (item.unit_price - item.discount_amount) * quantity }
        : item
    ));
  };

  const updateItemDiscount = (itemId: string, discount: number) => {
    setInvoiceItems(items => items.map(item => 
      item.id === itemId 
        ? { ...item, discount_amount: discount, total_amount: (item.unit_price - discount) * item.quantity }
        : item
    ));
  };

  const addExtraCharge = () => {
    setExtraCharges([...extraCharges, { name: "", amount: 0 }]);
  };

  const updateExtraCharge = (index: number, field: 'name' | 'amount', value: string | number) => {
    const updated = [...extraCharges];
    updated[index] = { ...updated[index], [field]: value };
    setExtraCharges(updated);
  };

  const removeExtraCharge = (index: number) => {
    setExtraCharges(extraCharges.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => {
    const itemsTotal = invoiceItems.reduce((sum, item) => sum + item.total_amount, 0);
    const extraTotal = extraCharges.reduce((sum, charge) => sum + charge.amount, 0);
    return itemsTotal + laborCharges + extraTotal;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NON-GST-${year}${month}${day}-${random}`;
  };

  const handleSaveInvoice = async () => {
    if (!selectedCustomer || !selectedVehicle || invoiceItems.length === 0) {
      toast.error("Please fill in customer, vehicle, and at least one service/part");
      return;
    }

    try {
      const total = calculateTotal();
      const subtotal = calculateSubtotal();
      const discountAmount = (subtotal * discount) / 100;

      const invoiceData = {
        invoice_number: generateInvoiceNumber(),
        invoice_type: 'non-gst',
        customer_id: selectedCustomer.id,
        vehicle_id: selectedVehicle.id,
        subtotal,
        discount_percentage: discount,
        discount_amount: discountAmount,
        cgst_amount: 0,
        sgst_amount: 0,
        total_gst_amount: 0,
        labor_charges: laborCharges,
        extra_charges: extraCharges,
        total,
        status: 'pending' as const,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        notes,
        kilometers
      };

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      const itemsData = invoiceItems.map(item => ({
        invoice_id: invoice.id,
        item_type: item.item_type,
        item_id: item.item_id,
        name: item.name,
        sac_hsn_code: item.sac_hsn_code,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount,
        gst_rate: 0, // Non-GST
        cgst_amount: 0,
        sgst_amount: 0,
        total_amount: item.total_amount
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsData);

      if (itemsError) throw itemsError;

      // Insert payment if amount provided
      if (paymentAmount > 0) {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert([{
            invoice_id: invoice.id,
            amount: paymentAmount,
            method: paymentMethod,
            status: 'completed' as const
          }]);

        if (paymentError) throw paymentError;
      }

      toast.success("Non-GST Invoice saved successfully!");
      onSave(invoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error("Failed to save invoice");
    }
  };

  useEffect(() => {
    const total = calculateTotal();
    setPaymentAmount(total);
  }, [invoiceItems, laborCharges, discount, extraCharges]);

  if (showAddCustomer) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Customer</h2>
          <Button variant="outline" onClick={() => setShowAddCustomer(false)}>
            Back to Invoice
          </Button>
        </div>
        <CustomerForm
          onSave={() => {
            setShowAddCustomer(false);
            fetchData();
            toast.success("Customer added! Please select from dropdown.");
          }}
          onCancel={() => setShowAddCustomer(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer & Vehicle Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Customer</Label>
              <div className="flex gap-2">
                <Select onValueChange={(value) => {
                  if (value === "add-new") {
                    setShowAddCustomer(true);
                    return;
                  }
                  const customer = customers.find(c => c.id === value);
                  setSelectedCustomer(customer || null);
                  setSelectedVehicle(null);
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add-new">
                      <span className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Customer
                      </span>
                    </SelectItem>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedCustomer && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium">{selectedCustomer.name}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
                {selectedCustomer.gst_number && (
                  <p className="text-sm text-blue-600">GST: {selectedCustomer.gst_number}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Vehicle</Label>
              <Select 
                onValueChange={(value) => {
                  const vehicle = customerVehicles.find(v => v.id === value);
                  setSelectedVehicle(vehicle || null);
                }}
                disabled={!selectedCustomer}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {customerVehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.vehicle_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedVehicle && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                <p className="text-sm text-gray-600">{selectedVehicle.vehicle_number}</p>
                <Badge variant="secondary">{selectedVehicle.vehicle_type}</Badge>
              </div>
            )}
            
            {selectedVehicle && (
              <div className="mt-4">
                <Label className="flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  Current Kilometers
                </Label>
                <Input
                  type="number"
                  value={kilometers}
                  onChange={(e) => setKilometers(parseInt(e.target.value) || 0)}
                  placeholder="Enter current kilometers"
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Services & Parts */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Parts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="parts">Parts</TabsTrigger>
              <TabsTrigger value="selected">Selected Items ({invoiceItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <div key={service.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.category}</p>
                        <p className="text-xs text-gray-500">SAC: {service.sac_code}</p>
                        <p className="text-lg font-semibold text-blue-600">₹{service.base_price}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addService(service.id)}
                        disabled={invoiceItems.some(item => item.item_id === service.id && item.item_type === 'service')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="parts" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parts.map(part => (
                  <div key={part.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{part.name}</h4>
                        <p className="text-sm text-gray-600">{part.category}</p>
                        <p className="text-xs text-gray-500">HSN: {part.hsn_code}</p>
                        <p className="text-lg font-semibold text-green-600">₹{part.price}</p>
                        <p className="text-xs text-gray-500">Stock: {part.stock_quantity}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addPart(part.id)}
                        disabled={invoiceItems.some(item => item.item_id === part.id && item.item_type === 'part')}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="selected" className="space-y-4">
              {invoiceItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items selected</p>
              ) : (
                <div className="space-y-3">
                  {invoiceItems.map(item => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{item.item_type}</p>
                          <p className="text-xs text-gray-500">{item.item_type === 'service' ? 'SAC' : 'HSN'}: {item.sac_hsn_code}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <p className="text-xs text-gray-500">Qty</p>
                          </div>
                          <div className="text-right">
                            <Input
                              type="number"
                              value={item.discount_amount}
                              onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="0"
                            />
                            <p className="text-xs text-gray-500">Discount</p>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="font-semibold">₹{item.total_amount}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Charges & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Additional Charges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Labor Charges</Label>
              <Input
                type="number"
                value={laborCharges}
                onChange={(e) => setLaborCharges(parseFloat(e.target.value) || 0)}
                placeholder="Enter labor charges"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Extra Charges</Label>
                <Button size="sm" variant="outline" onClick={addExtraCharge}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              {extraCharges.map((charge, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Charge name"
                    value={charge.name}
                    onChange={(e) => updateExtraCharge(index, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={charge.amount}
                    onChange={(e) => updateExtraCharge(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-32"
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeExtraCharge(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label>Discount (%)</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment & Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%):</span>
                  <span>-₹{((calculateSubtotal() * discount) / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (Non-GST):</span>
                <span>₹0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Details
              </h4>
              
              <div>
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Amount</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  max={calculateTotal()}
                />
                {paymentAmount < calculateTotal() && (
                  <p className="text-sm text-orange-600 mt-1">
                    Partial payment: ₹{(calculateTotal() - paymentAmount).toFixed(2)} remaining
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button onClick={handleSaveInvoice} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Invoice
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NonGSTInvoiceForm;
