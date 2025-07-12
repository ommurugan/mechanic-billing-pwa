
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      // Clear the session in the database
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error("Logout error:", error);
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        // Navigate to auth page after successful logout
        navigate('/auth');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error signing out");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
