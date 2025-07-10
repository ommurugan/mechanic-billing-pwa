import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Wrench,
  Package
} from "lucide-react";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const Services = () => {
  const { services, parts, fetchServices, fetchParts, loading } = useSupabaseData();
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    sacCode: "",
    gstRate: "18"
  });

  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    hsnCode: "",
    gstRate: "18",
    supplier: "",
    partNumber: ""
  });

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.category && service.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (part.category && part.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddService = async () => {
    if (!newService.name || !newService.price || !newService.sacCode) {
      toast.error("Please fill in required fields (Name, Price, SAC Code)");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('services')
        .insert({
          name: newService.name,
          description: newService.description || null,
          base_price: parseFloat(newService.price),
          estimated_time: newService.duration ? parseInt(newService.duration) : 0,
          category: newService.category || null,
          sac_code: newService.sacCode,
          gst_rate: parseInt(newService.gstRate)
        });

      if (error) throw error;

      toast.success("Service added successfully!");
      setShowAddServiceForm(false);
      setNewService({
        name: "",
        description: "",
        price: "",
        duration: "",
        category: "",
        sacCode: "",
        gstRate: "18"
      });
      fetchServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to add service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPart = async () => {
    if (!newPart.name || !newPart.price || !newPart.hsnCode) {
      toast.error("Please fill in required fields (Name, Price, HSN Code)");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('parts')
        .insert({
          name: newPart.name,
          category: newPart.category || null,
          hsn_code: newPart.hsnCode,
          price: parseFloat(newPart.price),
          gst_rate: parseInt(newPart.gstRate),
          stock_quantity: newPart.stock ? parseInt(newPart.stock) : 0,
          supplier: newPart.supplier || null,
          part_number: newPart.partNumber || null
        });

      if (error) throw error;

      toast.success("Part added successfully!");
      setShowAddPartForm(false);
      setNewPart({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        hsnCode: "",
        gstRate: "18",
        supplier: "",
        partNumber: ""
      });
      fetchParts();
    } catch (error: any) {
      toast.error(error.message || "Failed to add part");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Services & Parts</h1>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {/* Search */}
          <Card className="mb-3">
            <CardContent className="pt-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search services and parts..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="services" className="space-y-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services Catalog</TabsTrigger>
              <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
            </TabsList>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Services Catalog</h2>
                    <p className="text-gray-600 text-sm">Manage your service offerings and pricing</p>
                  </div>
                  <Dialog open={showAddServiceForm} onOpenChange={setShowAddServiceForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
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
                            <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                            <Input 
                              id="serviceDuration"
                              type="number"
                              value={newService.duration}
                              onChange={(e) => setNewService({...newService, duration: e.target.value})}
                              placeholder="120"
                            />
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
                        </div>
                        <Button 
                          onClick={handleAddService} 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={submitting}
                        >
                          {submitting ? "Adding..." : "Add Service"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="pt-3">
                    {filteredServices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredServices.map((service) => (
                          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">SAC: {service.sac_code}</p>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-lg font-semibold text-blue-600">
                                ₹{Number(service.base_price).toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                                {service.gst_rate}% GST
                              </span>
                            </div>
                            {service.category && (
                              <p className="text-xs text-gray-500 mt-2">{service.category}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
                        <p className="mb-4 text-sm">Create your first service to start building your catalog.</p>
                        <Button onClick={() => setShowAddServiceForm(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Service
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Parts Tab */}
            <TabsContent value="parts">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">Parts Inventory</h2>
                    <p className="text-gray-600 text-sm">Manage your spare parts stock and pricing</p>
                  </div>
                  <Dialog open={showAddPartForm} onOpenChange={setShowAddPartForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Part
                      </Button>
                    </DialogTrigger>
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
                          onClick={handleAddPart} 
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={submitting}
                        >
                          {submitting ? "Adding..." : "Add Part"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="pt-3">
                    {filteredParts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredParts.map((part) => (
                          <div key={part.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-900">{part.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">HSN: {part.hsn_code}</p>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-lg font-semibold text-green-600">
                                ₹{Number(part.price).toLocaleString('en-IN')}
                              </span>
                              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {part.gst_rate}% GST
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-600">
                                Stock: {part.stock_quantity || 0}
                              </span>
                              {part.category && (
                                <span className="text-xs text-gray-500">{part.category}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No parts yet</h3>
                        <p className="mb-4 text-sm">Add your first spare part to start building your inventory.</p>
                        <Button onClick={() => setShowAddPartForm(true)} className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Part
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Services;
