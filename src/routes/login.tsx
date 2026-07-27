import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";


export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Wiskow Concept" },
      { name: "description", content: "Acesse a experiência exclusiva Wiskow Concept." },
      { property: "og:title", content: "Wiskow Concept — Entrar" },
      { property: "og:description", content: "Acesse a experiência exclusiva Wiskow Concept." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const r = login(email, password);
    if (!r.ok) {
      setError(r.error ?? "Não foi possível entrar.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-[#fdb9e2]">
        <Logo variant="mark" className="max-h-[40%] max-w-[45%]" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="eyebrow">Wiskow Concept</p>
          <h2 className="font-serif text-5xl mt-4 leading-tight">Uma nova estação.<br/>Um novo capítulo.</h2>
        </div>
      </div>


      <div className="flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <p className="eyebrow text-muted-foreground">Área privada</p>
          <h1 className="font-serif text-4xl mt-3">Entrar</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Acesse com suas credenciais para explorar a experiência completa.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-destructive"
              >{error}</motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-10 text-xs text-muted-foreground leading-relaxed border-t border-border pt-6">
            <p className="eyebrow mb-3">Demonstração</p>
            <p>Use um dos e-mails abaixo com senha <span className="text-foreground">admin</span>:</p>
            <ul className="mt-2 space-y-1">
              <li>arthur.contato9@gmail.com</li>
              <li>mwiskowadmin@gmail.com</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
