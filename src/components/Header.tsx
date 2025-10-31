import sinergiaLogo from "@/assets/sinergia-logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <img 
            src={sinergiaLogo} 
            alt="Sinergia AI Logo" 
            className="h-12 w-auto animate-glow"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
