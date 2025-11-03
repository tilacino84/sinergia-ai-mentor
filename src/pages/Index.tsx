import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Values from "@/components/Values";
import AnalisisComplejo from "@/components/AnalisisComplejo";
import LiveAdvisor from "@/components/LiveAdvisor";
import EvaluationModal from "@/components/EvaluationModal";
import Footer from "@/components/Footer";

const Index = () => {
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Login button for non-authenticated users */}
      {!user && (
        <div className="fixed top-20 right-6 z-40">
          <Button
            onClick={() => navigate('/auth')}
            className="gap-2 bg-primary hover:bg-primary/90 glow-cyan"
          >
            <LogIn className="h-4 w-4" />
            Iniciar Sesión
          </Button>
        </div>
      )}
      
      <Hero onOpenEvaluation={() => setIsEvaluationOpen(true)} />
      <Values />
      <AnalisisComplejo />
      <LiveAdvisor />
      <Footer />
      
      <EvaluationModal 
        open={isEvaluationOpen} 
        onOpenChange={setIsEvaluationOpen}
      />
    </div>
  );
};

export default Index;
