const Values = () => {
  const values = [
    { text: "EXPERTA", color: "secondary" },
    { text: "ESTRATÉGICA", color: "secondary" },
    { text: "CONFIABLE", color: "secondary" },
  ];

  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {value.text}
              </h2>
              <div className="h-1 w-full bg-secondary glow-lime rounded-full" />
            </div>
          ))}
        </div>
        
        <p className="text-center text-xl text-muted-foreground mt-16 max-w-3xl mx-auto">
          Soluciones Tecnológicas B2B
        </p>
      </div>
    </section>
  );
};

export default Values;
