
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import SearchBar from "@/components/services/SearchBar";
import ServicesList from "@/components/services/ServicesList";
import PartsList from "@/components/services/PartsList";
import AddServiceModal from "@/components/services/AddServiceModal";
import AddPartModal from "@/components/services/AddPartModal";

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
    durationUnit: "minutes",
    category: "",
    sacCode: "",
    gstRate: "18"
  });

  const [newPart, setNewPart] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    duration: "",
    durationUnit: "minutes",
    category: "",
    hsnCode: "",
    gstRate: "18",
    supplier: "",
    partNumber: ""
  });

  const timeUnits = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' }
  ];

  const convertToMinutes = (duration: number, unit: string) => {
    switch (unit) {
      case 'hours':
        return duration * 60;
      case 'days':
        return duration * 60 * 24;
      case 'months':
        return duration * 60 * 24 * 30;
      default:
        return duration; // minutes
    }
  };

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
      const durationInMinutes = newService.duration ? 
        convertToMinutes(parseInt(newService.duration), newService.durationUnit) : 0;

      const { error } = await supabase
        .from('services')
        .insert({
          name: newService.name,
          description: newService.description || null,
          base_price: parseFloat(newService.price),
          estimated_time: durationInMinutes,
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
        durationUnit: "minutes",
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
        duration: "",
        durationUnit: "minutes",
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
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            <Tabs defaultValue="services" className="space-y-3">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="services">Services Catalog</TabsTrigger>
                <TabsTrigger value="parts">Parts Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="services">
                <ServicesList 
                  services={filteredServices} 
                  onAddService={() => setShowAddServiceForm(true)} 
                />
              </TabsContent>

              <TabsContent value="parts">
                <PartsList 
                  parts={filteredParts} 
                  onAddPart={() => setShowAddPartForm(true)} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <AddServiceModal
        isOpen={showAddServiceForm}
        onClose={() => setShowAddServiceForm(false)}
        newService={newService}
        setNewService={setNewService}
        onSubmit={handleAddService}
        submitting={submitting}
        timeUnits={timeUnits}
      />

      <AddPartModal
        isOpen={showAddPartForm}
        onClose={() => setShowAddPartForm(false)}
        newPart={newPart}
        setNewPart={setNewPart}
        onSubmit={handleAddPart}
        submitting={submitting}
        timeUnits={timeUnits}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Services;
