
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  newService: any;
  setNewService: (service: any) => void;
  onSubmit: () => void;
  submitting: boolean;
  timeUnits: Array<{ value: string; label: string }>;
}

const AddServiceModal = ({
  isOpen,
  onClose,
  newService,
  setNewService,
  onSubmit,
  submitting,
  timeUnits
}: AddServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Create a new service offering for your catalog
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceName">Service Name *</Label>
            <Input 
              id="serviceName"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              placeholder="Enter service name"
            />
          </div>
          <div>
            <Label htmlFor="sacCode">SAC Code *</Label>
            <Input 
              id="sacCode"
              value={newService.sacCode}
              onChange={(e) => setNewService({...newService, sacCode: e.target.value})}
              placeholder="Enter SAC code"
            />
          </div>
          <div>
            <Label htmlFor="serviceDescription">Description</Label>
            <Textarea 
              id="serviceDescription"
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
              placeholder="Describe the service"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="servicePrice">Price (₹) *</Label>
              <Input 
                id="servicePrice"
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({...newService, price: e.target.value})}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="gstRate">GST Rate *</Label>
              <Select value={newService.gstRate} onValueChange={(value) => setNewService({...newService, gstRate: value})}>
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
              <Label htmlFor="serviceDuration">Duration</Label>
              <Input 
                id="serviceDuration"
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({...newService, duration: e.target.value})}
                placeholder="1"
              />
            </div>
            <div>
              <Label htmlFor="durationUnit">Time Unit</Label>
              <Select 
                value={newService.durationUnit} 
                onValueChange={(value) => setNewService({...newService, durationUnit: value})}
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
          <div>
            <Label htmlFor="serviceCategory">Category</Label>
            <Input 
              id="serviceCategory"
              value={newService.category}
              onChange={(e) => setNewService({...newService, category: e.target.value})}
              placeholder="e.g., Maintenance"
            />
          </div>
          <Button 
            onClick={onSubmit} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Service"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
