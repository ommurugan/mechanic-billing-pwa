
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceAdded: () => void;
  service?: any;
}

const ServiceForm = ({ isOpen, onClose, onServiceAdded, service }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    category: service?.category || '',
    base_price: service?.base_price || 0,
    sac_code: service?.sac_code || '',
    estimated_time: service?.estimated_time || 0,
    time_unit: 'hours', // Default to hours
    is_active: service?.is_active ?? true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const timeUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' }
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert time to minutes for storage
      let timeInMinutes = formData.estimated_time;
      switch (formData.time_unit) {
        case 'hours':
          timeInMinutes = formData.estimated_time * 60;
          break;
        case 'days':
          timeInMinutes = formData.estimated_time * 60 * 24;
          break;
        case 'months':
          timeInMinutes = formData.estimated_time * 60 * 24 * 30;
          break;
        default:
          timeInMinutes = formData.estimated_time; // minutes
      }

      const serviceData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        base_price: parseFloat(formData.base_price.toString()),
        sac_code: formData.sac_code,
        estimated_time: timeInMinutes,
        gst_rate: 18, // Fixed GST rate for services - keeping for database compatibility
        is_active: formData.is_active
      };

      let error;
      if (service?.id) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);
        error = updateError;
      } else {
        // Create new service
        const { error: insertError } = await supabase
          .from('services')
          .insert([serviceData]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving service:', error);
        toast({
          title: "Error",
          description: "Failed to save service. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Service ${service?.id ? 'updated' : 'created'} successfully!`,
      });

      onServiceAdded();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Error",
        description: "Failed to save service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDisplayTime = () => {
    if (!service?.estimated_time) return 0;
    
    const timeInMinutes = service.estimated_time;
    switch (formData.time_unit) {
      case 'hours':
        return Math.round(timeInMinutes / 60);
      case 'days':
        return Math.round(timeInMinutes / (60 * 24));
      case 'months':
        return Math.round(timeInMinutes / (60 * 24 * 30));
      default:
        return timeInMinutes;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{service?.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g., Engine, Brake, Oil Change"
            />
          </div>

          <div>
            <Label htmlFor="base_price">Base Price (₹) *</Label>
            <Input
              id="base_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.base_price}
              onChange={(e) => handleChange('base_price', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <Label htmlFor="sac_code">SAC Code *</Label>
            <Input
              id="sac_code"
              value={formData.sac_code}
              onChange={(e) => handleChange('sac_code', e.target.value)}
              placeholder="e.g., 9988"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimated_time">Estimated Time *</Label>
              <Input
                id="estimated_time"
                type="number"
                min="1"
                value={service?.id ? getDisplayTime() : formData.estimated_time}
                onChange={(e) => handleChange('estimated_time', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            <div>
              <Label htmlFor="time_unit">Time Unit</Label>
              <Select
                value={formData.time_unit}
                onValueChange={(value) => handleChange('time_unit', value)}
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (service?.id ? 'Update Service' : 'Add Service')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
