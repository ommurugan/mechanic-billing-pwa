
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Car, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CustomerFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const CustomerForm = ({ onSave, onCancel }: CustomerFormProps) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: ''
  });

  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    vehicleNumber: '',
    vehicleType: 'car' as const,
    engineNumber: '',
    chassisNumber: '',
    color: ''
  });

  const handleSaveCustomer = async () => {
    if (!customerData.name || !customerData.phone) {
      toast.error("Name and phone are required");
      return;
    }

    try {
      // Insert customer
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          address: customerData.address || null,
          gst_number: customerData.gstNumber || null
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Insert vehicle if vehicle number is provided
      if (vehicleData.vehicleNumber && vehicleData.make && vehicleData.model) {
        const { error: vehicleError } = await supabase
          .from('vehicles')
          .insert([{
            customer_id: customer.id,
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year ? parseInt(vehicleData.year) : null,
            vehicle_number: vehicleData.vehicleNumber,
            vehicle_type: vehicleData.vehicleType,
            engine_number: vehicleData.engineNumber || null,
            chassis_number: vehicleData.chassisNumber || null,
            color: vehicleData.color || null
          }]);

        if (vehicleError) throw vehicleError;
      }

      toast.success("Customer added successfully!");
      onSave();
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error("Failed to add customer");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Customer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={customerData.phone}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                placeholder="Email address"
              />
            </div>
            <div>
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                value={customerData.gstNumber}
                onChange={(e) => setCustomerData({...customerData, gstNumber: e.target.value})}
                placeholder="GST number"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={customerData.address}
              onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
              placeholder="Customer address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Add Vehicle (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={vehicleData.make}
                onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                placeholder="Vehicle make"
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={vehicleData.model}
                onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                placeholder="Vehicle model"
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={vehicleData.year}
                onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
                placeholder="Year"
              />
            </div>
            <div>
              <Label htmlFor="vehicleNumber">Vehicle Number</Label>
              <Input
                id="vehicleNumber"
                value={vehicleData.vehicleNumber}
                onChange={(e) => setVehicleData({...vehicleData, vehicleNumber: e.target.value})}
                placeholder="Vehicle number"
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={vehicleData.color}
                onChange={(e) => setVehicleData({...vehicleData, color: e.target.value})}
                placeholder="Vehicle color"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSaveCustomer} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Customer
        </Button>
      </div>
    </div>
  );
};

export default CustomerForm;
