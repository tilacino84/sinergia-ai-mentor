import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useEffect } from "react";

const authSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      authSchema.parse({ email, password });

      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Credenciales incorrectas");
        } else if (error.message.includes("User already registered")) {
          toast.error("Este email ya está registrado. Intenta iniciar sesión.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success(isLogin ? "¡Bienvenido!" : "¡Cuenta creada exitosamente!");
        navigate("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Error al procesar la solicitud");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
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

      <Card className="w-full max-w-md relative z-10 border-2 border-primary/30 bg-card/95 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            Sinergia AI
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin ? "Inicia sesión en tu cuenta" : "Crea una nueva cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 glow-cyan"
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : (isLogin ? "Iniciar Sesión" : "Registrarse")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
