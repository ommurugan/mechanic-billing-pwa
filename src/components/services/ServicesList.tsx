
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Wrench } from "lucide-react";
import { Service } from '@/hooks/useSupabaseData';
import ServiceCard from './ServiceCard';

interface ServicesListProps {
  services: Service[];
  onAddService: () => void;
}

const ServicesList = ({ services, onAddService }: ServicesListProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Services Catalog</h2>
          <p className="text-gray-600 text-sm">Manage your service offerings and pricing</p>
        </div>
        <Button onClick={onAddService} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardContent className="pt-3">
          {services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
              <p className="mb-4 text-sm">Create your first service to start building your catalog.</p>
              <Button onClick={onAddService} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServicesList;
