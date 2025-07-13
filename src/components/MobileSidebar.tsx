
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LayoutDashboard, Receipt, Users, Wrench, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";

const MobileSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard"
    },
    {
      icon: Receipt,
      label: "Invoices",
      path: "/invoices"
    },
    {
      icon: Users,
      label: "Customers",
      path: "/customers"
    },
    {
      icon: Wrench,
      label: "Services",
      path: "/services"
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/reports"
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 rounded-2xl">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <img 
              src="/lovable-uploads/79150a38-d99d-4155-a317-dc31ab547426.png" 
              alt="OM MURUGAN AUTO WORKS" 
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">OM MURUGAN</h2>
            <p className="text-xs text-gray-600">AUTO WORKS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 h-12 text-base transition-all duration-200 hover:scale-[1.02]",
              isActive(item.path) 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => handleNavigate(item.path)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile - No hamburger menu, sidebar will be triggered by other means if needed */}
      <div className="md:hidden">
        {/* Remove the floating hamburger menu button completely */}
      </div>
    </>
  );
};

export default MobileSidebar;
