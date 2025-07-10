
import MobileSidebar from "@/components/MobileSidebar";
import BottomNavigation from "@/components/BottomNavigation";
import LogoutButton from "@/components/LogoutButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GSTInvoiceManagement from "@/components/GSTInvoiceManagement";
import NonGSTInvoiceManagement from "@/components/NonGSTInvoiceManagement";

const Invoices = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="flex w-full">
        <MobileSidebar />
        
        <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
          <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 pt-16 md:pt-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Invoices</h1>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6 w-full overflow-x-hidden">
            <Tabs defaultValue="non-gst" className="space-y-4 w-full">
              <div className="w-full overflow-x-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="non-gst" className="text-sm md:text-base">Non-GST Invoices</TabsTrigger>
                  <TabsTrigger value="gst" className="text-sm md:text-base">GST Invoices</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="non-gst" className="w-full overflow-x-hidden">
                <NonGSTInvoiceManagement />
              </TabsContent>
              
              <TabsContent value="gst" className="w-full overflow-x-hidden">
                <GSTInvoiceManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Invoices;
