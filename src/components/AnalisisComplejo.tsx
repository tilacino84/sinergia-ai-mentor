import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Brain, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

const AnalisisComplejo = () => {
  const [isDeepMode, setIsDeepMode] = useState(true);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast.error("Por favor ingresa una consulta");
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const { deepAnalysis, quickResponse } = await import("@/services/geminiService");
      
      const result = isDeepMode 
        ? await deepAnalysis(query)
        : await quickResponse(query);
      
      setResponse(result);
      toast.success("Análisis completado");
    } catch (error) {
      console.error("Error al analizar:", error);
      toast.error("Error al procesar la consulta");
      setResponse("Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
           style={{
             backgroundImage: `repeating-linear-gradient(
               0deg,
               hsl(var(--primary)) 0px,
               transparent 1px,
               transparent 40px,
               hsl(var(--primary)) 41px
             ),
             repeating-linear-gradient(
               90deg,
               hsl(var(--primary)) 0px,
               transparent 1px,
               transparent 40px,
               hsl(var(--primary)) 41px
             )`
           }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Análisis y Estrategia de <span className="text-primary">Negocios</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Potenciado por Gemini AI
            </p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-border glow-cyan">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                {isDeepMode ? (
                  <Brain className="w-8 h-8 text-primary" />
                ) : (
                  <Zap className="w-8 h-8 text-secondary" />
                )}
                <div>
                  <Label htmlFor="analysis-mode" className="text-lg font-semibold">
                    {isDeepMode ? "Análisis Profundo" : "Respuesta Rápida"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isDeepMode
                      ? "Gemini 2.5 Pro - Máxima configuración de pensamiento"
                      : "Gemini Flash Lite - Respuestas instantáneas"}
                  </p>
                </div>
              </div>
              <Switch
                id="analysis-mode"
                checked={isDeepMode}
                onCheckedChange={setIsDeepMode}
              />
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="query" className="text-base mb-2 block">
                  Tu consulta estratégica
                </Label>
                <Textarea
                  id="query"
                  placeholder="Ej: Necesito un plan de expansión para mi negocio de consultoría tecnológica..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 text-base"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-background font-semibold py-6 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  "Generar Análisis"
                )}
              </Button>

              {response && (
                <div className="mt-6 p-6 bg-background/50 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    Resultado del Análisis
                  </h3>
                  <div className="whitespace-pre-wrap text-foreground">
                    {response}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AnalisisComplejo;
