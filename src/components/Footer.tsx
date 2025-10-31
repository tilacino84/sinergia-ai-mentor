import sinergiaLogo from "@/assets/sinergia-logo.png";
import techIllustration from "@/assets/tech-illustration.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-background via-card/30 to-card/60 border-t border-primary/20 py-16 overflow-hidden">
      {/* Background illustration - more integrated */}
      <div className="absolute right-0 bottom-0 w-full md:w-2/3 h-full opacity-[0.08] pointer-events-none">
        <img 
          src={techIllustration} 
          alt="" 
          className="w-full h-full object-cover object-right-bottom mix-blend-screen"
        />
      </div>
      
      {/* Decorative hexagon overlay */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-72 border-2 border-primary/10 opacity-30"
           style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 p-3 rounded-lg bg-background/40 backdrop-blur-sm border border-primary/20">
              <img 
                src={sinergiaLogo} 
                alt="Sinergia AI" 
                className="h-14 w-auto drop-shadow-[0_0_15px_rgba(0,209,255,0.4)]"
              />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Soluciones tecnológicas B2B para impulsar el crecimiento de tu negocio con inteligencia artificial avanzada.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Análisis de Negocios
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Asesor en Vivo
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Evaluación con IA
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contacto@sinergia-ai.com</li>
              <li>+52 (55) 1234-5678</li>
              <li className="pt-4">
                <div className="flex gap-4">
                  <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Sinergia AI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
