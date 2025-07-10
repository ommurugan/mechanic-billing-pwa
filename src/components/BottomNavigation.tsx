
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  Wrench, 
  BarChart3
} from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Receipt, label: "Invoices", path: "/invoices" },
    { icon: Users, label: "Customers", path: "/customers" },
    { icon: Wrench, label: "Services", path: "/services" },
    { icon: BarChart3, label: "Reports", path: "/reports" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40 animate-fade-in">
      <div className="flex justify-around items-center py-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center py-2 px-1 min-w-0 flex-1 text-xs transition-all duration-200",
              isActive(item.path)
                ? "text-blue-600 scale-105"
                : "text-gray-600 hover:text-blue-500"
            )}
          >
            <item.icon className={cn(
              "h-6 w-6 mb-1 transition-colors duration-200",
              isActive(item.path) && "text-blue-600"
            )} />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
