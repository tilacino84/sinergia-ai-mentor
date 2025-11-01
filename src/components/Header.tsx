import sinergiaLogo from "@/assets/sinergia-logo.png";

const Header = () => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
