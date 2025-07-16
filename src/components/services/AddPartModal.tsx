
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPartModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPart: any;
  setNewPart: (part: any) => void;
  onSubmit: () => void;
  submitting: boolean;
  timeUnits: Array<{ value: string; label: string }>;
}

const AddPartModal = ({
  isOpen,
  onClose,
  newPart,
  setNewPart,
  onSubmit,
  submitting,
  timeUnits
}: AddPartModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>
            Add a new spare part to your inventory
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="partName">Part Name *</Label>
            <Input 
              id="partName"
              value={newPart.name}
              onChange={(e) => setNewPart({...newPart, name: e.target.value})}
              placeholder="Enter part name"
            />
          </div>
          <div>
            <Label htmlFor="hsnCode">HSN Code *</Label>
            <Input 
              id="hsnCode"
              value={newPart.hsnCode}
              onChange={(e) => setNewPart({...newPart, hsnCode: e.target.value})}
              placeholder="Enter HSN code"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partPrice">Price (₹) *</Label>
              <Input 
                id="partPrice"
                type="number"
                value={newPart.price}
                onChange={(e) => setNewPart({...newPart, price: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="partGstRate">GST Rate *</Label>
              <Select value={newPart.gstRate} onValueChange={(value) => setNewPart({...newPart, gstRate: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9">9%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partStock">Stock Quantity</Label>
              <Input 
                id="partStock"
                type="number"
                value={newPart.stock}
                onChange={(e) => setNewPart({...newPart, stock: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="partCategory">Category</Label>
              <Input 
                id="partCategory"
                value={newPart.category}
                onChange={(e) => setNewPart({...newPart, category: e.target.value})}
                placeholder="e.g., Filters"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partDuration">Install Duration</Label>
              <Input 
                id="partDuration"
                type="number"
                value={newPart.duration}
                onChange={(e) => setNewPart({...newPart, duration: e.target.value})}
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="partDurationUnit">Time Unit</Label>
              <Select 
                value={newPart.durationUnit} 
                onValueChange={(value) => setNewPart({...newPart, durationUnit: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input 
                id="supplier"
                value={newPart.supplier}
                onChange={(e) => setNewPart({...newPart, supplier: e.target.value})}
                placeholder="Supplier name"
              />
            </div>
            <div>
              <Label htmlFor="partNumber">Part Number</Label>
              <Input 
                id="partNumber"
                value={newPart.partNumber}
                onChange={(e) => setNewPart({...newPart, partNumber: e.target.value})}
                placeholder="Part number"
              />
            </div>
          </div>
          <Button 
            onClick={onSubmit} 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Part"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPartModal;
