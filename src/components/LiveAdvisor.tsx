import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Radio } from "lucide-react";
import { toast } from "sonner";

const LiveAdvisor = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);
  const [isListening, setIsListening] = useState(false);

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsActive(true);
      setIsListening(true);
      toast.success("Asesor en vivo activado");
      
      // Simulated initial greeting
      setTranscript([
        { role: "assistant", text: "Hola, soy tu asesor de IA en vivo. ¿En qué puedo ayudarte hoy?" }
      ]);

      // In production, this would initialize Gemini Live API with voice "Zephyr"
      console.log("Gemini Live API would be initialized here with voice: Zephyr");
      
    } catch (error) {
      toast.error("No se pudo acceder al micrófono");
      console.error("Microphone access error:", error);
    }
  };

  const endConversation = () => {
    setIsActive(false);
    setIsListening(false);
    toast.info("Conversación finalizada");
  };

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Asesor de IA <span className="text-primary">en Vivo</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Conversación de voz en tiempo real con Gemini Live
            </p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 border-border">
            <div className="flex flex-col items-center gap-8">
              {/* Microphone visualization */}
              <div className="relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  isListening ? "bg-primary/20 animate-pulse" : "bg-muted"
                }`}>
                  {isListening ? (
                    <Radio className="w-16 h-16 text-primary animate-glow" />
                  ) : (
                    <Mic className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
                {isListening && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" 
                         style={{ animationDelay: '0.5s' }} />
                  </>
                )}
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-lg font-semibold text-primary">
                  {isActive ? "🔴 En vivo" : "Listo para comenzar"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {isActive 
                    ? "Escuchando... Habla ahora" 
                    : "Haz clic en Iniciar para comenzar la conversación"}
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4">
                {!isActive ? (
                  <Button
                    onClick={startConversation}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-background font-semibold px-8"
                  >
                    <Mic className="mr-2" />
                    Iniciar Conversación
                  </Button>
                ) : (
                  <Button
                    onClick={endConversation}
                    size="lg"
                    variant="destructive"
                    className="font-semibold px-8"
                  >
                    <MicOff className="mr-2" />
                    Finalizar
                  </Button>
                )}
              </div>

              {/* Transcript */}
              {transcript.length > 0 && (
                <div className="w-full mt-8 p-6 bg-background/50 rounded-lg border border-primary/30 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Transcripción en Vivo
                  </h3>
                  <div className="space-y-4">
                    {transcript.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${
                          item.role === "assistant"
                            ? "bg-primary/10 border-l-4 border-primary"
                            : "bg-secondary/10 border-l-4 border-secondary"
                        }`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {item.role === "assistant" ? "IA" : "Tú"}
                        </p>
                        <p className="text-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center italic">
                    [Nota: Esta es una simulación. En producción se integraría con Gemini Live API 
                    usando la voz "Zephyr" y modelo Flash de Gemini 2.5 (09-2025)]
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveAdvisor;
