
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import { Part } from '@/hooks/useSupabaseData';
import PartCard from './PartCard';

interface PartsListProps {
  parts: Part[];
  onAddPart: () => void;
}

const PartsList = ({ parts, onAddPart }: PartsListProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Parts Inventory</h2>
          <p className="text-gray-600 text-sm">Manage your spare parts stock and pricing</p>
        </div>
        <Button onClick={onAddPart} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>
      </div>

      <Card>
        <CardContent className="pt-3">
          {parts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {parts.map((part) => (
                <PartCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No parts yet</h3>
              <p className="mb-4 text-sm">Add your first spare part to start building your inventory.</p>
              <Button onClick={onAddPart} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Part
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartsList;
