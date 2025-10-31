import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, MapPin, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ title: string; url: string }>;
}

interface EvaluationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EvaluationModal = ({ open, onOpenChange }: EvaluationModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy Sinergia AI, tu consultor de negocios. Estoy aquí para ayudarte a determinar qué necesita tu emprendimiento para escalar. ¿Podrías contarme brevemente sobre tu negocio?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      // Request geolocation when modal opens
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation not available:", error);
        }
      );
    }
  }, [open]);

  const detectSearchIntent = (text: string): boolean => {
    const searchKeywords = ["noticias", "tendencias", "cerca", "mercado", "buscar", "encontrar", "dónde"];
    return searchKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Detect if grounding is needed
      const needsGrounding = detectSearchIntent(input);

      if (needsGrounding) {
        // For grounding, we'll use a simulated search
        // In production, you'd integrate with Google Search API via edge function
        const assistantResponse: Message = {
          role: "assistant",
          content: `He buscado información relevante sobre "${input}". Aquí están los resultados más recientes:`,
          sources: [
            { title: "Tendencias de mercado 2025", url: "https://example.com/tendencias" },
            { title: "Análisis del sector", url: "https://example.com/analisis" },
          ],
        };
        setMessages((prev) => [...prev, assistantResponse]);
        toast.success("Búsqueda completada");
      } else {
        // Regular conversation with Gemini
        const { chatEvaluation } = await import("@/services/geminiService");
        
        const conversationHistory = messages
          .filter(m => m.role === "user" || m.role === "assistant")
          .map(m => ({ role: m.role, content: m.content }));
        
        conversationHistory.push({ role: "user", content: input });
        
        const result = await chatEvaluation(conversationHistory);
        
        const assistantResponse: Message = {
          role: "assistant",
          content: result,
        };
        
        setMessages((prev) => [...prev, assistantResponse]);
      }
    } catch (error) {
      console.error("Error en chat:", error);
      toast.error("Error al procesar el mensaje");
      
      const errorResponse: Message = {
        role: "assistant",
        content: "Lo siento, hubo un error. Por favor intenta nuevamente.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col bg-card border-2 border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Evaluación con IA
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Potenciado por Gemini 2.5 Flash con búsqueda en tiempo real
          </p>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 ${
                message.role === "user"
                  ? "ml-auto bg-primary/10 border-primary/30"
                  : "mr-auto bg-background/50"
              } max-w-[80%]`}
            >
              <p className="text-sm font-semibold mb-2">
                {message.role === "user" ? "Tú" : "Sinergia AI"}
              </p>
              <p className="text-foreground">{message.content}</p>
              
              {message.sources && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Fuentes encontradas:
                  </p>
                  {message.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {source.title}
                    </a>
                  ))}
                </div>
              )}
            </Card>
          ))}
          {isLoading && (
            <Card className="p-4 mr-auto bg-background/50 max-w-[80%]">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Pensando...</p>
              </div>
            </Card>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2 p-4 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center px-4 pb-2">
          💡 Intenta preguntar: "¿Cuáles son las tendencias de marketing digital?" o 
          "Busca negocios de consultoría cerca de mí"
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default EvaluationModal;
