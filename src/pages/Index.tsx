import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Values from "@/components/Values";
import AnalisisComplejo from "@/components/AnalisisComplejo";
import LiveAdvisor from "@/components/LiveAdvisor";
import EvaluationModal from "@/components/EvaluationModal";
import Footer from "@/components/Footer";

const Index = () => {
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
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
