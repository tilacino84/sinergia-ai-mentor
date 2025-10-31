import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  onOpenEvaluation: () => void;
}

const Hero = ({ onOpenEvaluation }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Animated background hexagons */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-primary"
            style={{
              width: '200px',
              height: '230px',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            ¿Tu emprendimiento está listo para{" "}
            <span className="text-primary glow-cyan">escalar</span>?
          </h1>
          
          <p className="text-2xl text-secondary font-semibold">
            Descubre qué necesitas hoy.
          </p>
          
          <p className="text-lg text-muted-foreground max-w-xl">
            Sinergia AI es tu plataforma B2B de soluciones tecnológicas que combina 
            análisis estratégico profundo con inteligencia artificial avanzada para 
            impulsar el crecimiento de tu negocio.
          </p>
          
          <Button 
            onClick={onOpenEvaluation}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-background font-semibold text-lg px-8 py-6 glow-cyan group"
          >
            Comenzar evaluación con IA
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="relative animate-float">
          <div className="relative w-full h-[600px] flex items-center justify-center">
            {/* Central hexagon */}
            <div className="absolute w-64 h-72 border-4 border-primary glow-cyan animate-glow"
                 style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            </div>
            
            {/* Orbiting nodes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
              const radius = 180;
              const x = Math.cos((deg * Math.PI) / 180) * radius;
              const y = Math.sin((deg * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={i}
                  className="absolute w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center glow-cyan"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    animation: `glow-pulse ${2 + i * 0.2}s ease-in-out infinite`,
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
