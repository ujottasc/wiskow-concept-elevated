import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";
import { lovable } from "@/integrations/lovable/index";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s["redirect"] === "string" && s["redirect"].startsWith("/") ? s["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Wiskow Concept" },
      { name: "description", content: "Acesse sua conta Wiskow Concept para salvar favoritos e acompanhar pedidos." },
      { property: "og:title", content: "Entrar — Wiskow Concept" },
      { property: "og:description", content: "Acesse sua conta Wiskow Concept." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, signup, resetPassword, user, ready } = useStore();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: search.redirect ?? "/", replace: true });
  }, [ready, user, navigate, search.redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (password.length < 6) { setError("A senha precisa ter ao menos 6 caracteres."); return; }
    setLoading(true);
    const r = mode === "login" ? await login(email, password) : await signup(name, email, password);
    setLoading(false);
    if (!r.ok) { setError(r.error ?? "Não foi possível continuar."); return; }
    if ("needsConfirmation" in r && r.needsConfirmation) {
      setInfo("Conta criada! Confirme o e-mail que enviamos para ativar seu acesso.");
      return;
    }
    toast.success(mode === "login" ? "Bem-vinda de volta." : "Conta criada com sucesso.");
    navigate({ to: search.redirect ?? "/", replace: true });
  };

  const google = async () => {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setError("Não foi possível entrar com o Google."); return; }
    if (result.redirected) return;
    navigate({ to: search.redirect ?? "/", replace: true });
  };

  const forgot = async () => {
    if (!email) { setError("Informe seu e-mail para redefinir a senha."); return; }
    const r = await resetPassword(email);
    if (!r.ok) { setError(r.error ?? "Erro ao enviar e-mail."); return; }
    setInfo("Enviamos um link de redefinição para o seu e-mail.");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background">
      <div className="relative hidden md:flex items-center justify-center overflow-hidden bg-rose">
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
          <Link to="/" className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground link-underline">← Voltar à loja</Link>
          <h1 className="font-serif text-4xl mt-6">{mode === "login" ? "Entrar" : "Criar conta"}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {mode === "login"
              ? "Acesse sua conta para salvar favoritos e acompanhar pedidos."
              : "Crie sua conta em segundos e salve suas peças preferidas."}
          </p>

          <button
            type="button"
            onClick={google}
            className="mt-8 w-full border border-border py-3 text-xs uppercase tracking-[0.22em] hover:border-foreground transition-colors"
          >
            Continuar com Google
          </button>

          <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="mt-6 space-y-6">
            {mode === "signup" && (
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2" htmlFor="name">Nome</label>
                <input id="name" required value={name} onChange={e => setName(e.target.value)} maxLength={80}
                  className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors" />
              </div>
            )}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2" htmlFor="email">E-mail</label>
              <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} maxLength={255}
                className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2" htmlFor="password">Senha</label>
              <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} minLength={6}
                className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {info && <p className="text-sm text-foreground">{info}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors disabled:opacity-60">
              {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <button type="button" className="link-underline" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setInfo(null); }}>
              {mode === "login" ? "Criar uma conta" : "Já tenho conta"}
            </button>
            {mode === "login" && <button type="button" className="link-underline" onClick={forgot}>Esqueci a senha</button>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
