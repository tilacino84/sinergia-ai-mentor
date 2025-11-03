import sinergiaLogo from "@/assets/sinergia-logo.png";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/60 backdrop-blur-xl border-b border-primary/20">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-background/40 cursor-pointer hover:bg-background/60 transition-colors" onClick={() => window.location.href = '/'}>
            <img 
              src={sinergiaLogo} 
              alt="Sinergia AI Logo" 
              className="h-10 w-auto drop-shadow-[0_0_15px_rgba(0,209,255,0.5)]"
            />
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 border-primary/30 hover:bg-primary/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
