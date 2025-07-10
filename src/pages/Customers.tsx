
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin,
  Users,
  Edit,
  Car
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import CustomerForm from "@/components/CustomerForm";
import CustomerEditModal from "@/components/CustomerEditModal";

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customersData, vehiclesData] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('vehicles').select('*')
      ]);

      if (customersData.data) setCustomers(customersData.data);
      if (vehiclesData.data) setVehicles(vehiclesData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomerVehicles = (customerId: string) => {
    return vehicles.filter(v => v.customer_id === customerId);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveCustomer = () => {
    fetchData();
    setShowCreateForm(false);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
  };

  const handleSaveEdit = () => {
    fetchData();
    setEditingCustomer(null);
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
        <div className="flex w-full">
          <MobileSidebar />
          
          <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
            <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Add New Customer</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 sm:flex-initial"
                  >
                    Back to Customers
                  </Button>
                  <div className="hidden md:block">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 w-full overflow-x-hidden">
              <CustomerForm
                onSave={handleSaveCustomer}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Customers</h1>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 w-full overflow-x-hidden">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                      <p className="text-sm text-gray-600">Total Customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Car className="h-8 w-8 text-green-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                      <p className="text-sm text-gray-600">Total Vehicles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-8 px-3 flex-shrink-0">
                      GST
                    </Badge>
                    <div className="min-w-0">
                      <p className="text-2xl font-bold text-gray-900">
                        {customers.filter(c => c.gst_number).length}
                      </p>
                      <p className="text-sm text-gray-600">GST Customers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Add */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search customers..." 
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>

            {/* Customers List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCustomers.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No customers found</p>
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add First Customer
                  </Button>
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <Card key={customer.id} className="hover:shadow-md transition-shadow w-full">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{customer.name}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {customer.gst_number && (
                              <Badge variant="secondary" className="text-xs">GST Customer</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {getCustomerVehicles(customer.id).length} Vehicle(s)
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEditCustomer(customer)}
                          className="flex-shrink-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{customer.phone}</span>
                      </div>
                      
                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      
                      {customer.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-600 truncate">{customer.address}</span>
                        </div>
                      )}
                      
                      {customer.gst_number && (
                        <div className="text-sm">
                          <span className="font-medium">GST Number: </span>
                          <span className="text-gray-600 break-all">{customer.gst_number}</span>
                        </div>
                      )}

                      {/* Customer Vehicles */}
                      {getCustomerVehicles(customer.id).length > 0 && (
                        <div className="pt-3 border-t">
                          <p className="text-sm font-medium mb-2">Vehicles:</p>
                          <div className="space-y-1">
                            {getCustomerVehicles(customer.id).map((vehicle) => (
                              <div key={vehicle.id} className="flex items-center gap-2 text-sm text-gray-600">
                                <Car className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{vehicle.make} {vehicle.model} - {vehicle.vehicle_number}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <CustomerEditModal
          isOpen={true}
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Customers;
