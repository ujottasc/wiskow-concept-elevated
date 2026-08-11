import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Wiskow Concept" },
      { name: "description", content: "Painel administrativo Wiskow Concept." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Wiskow Concept" },
      { property: "og:description", content: "Painel administrativo." },
    ],
  }),
  component: AdminGuard,
});

function AdminGuard() {
  const { ready, user, isAdmin } = useStore();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Carregando…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" search={{ redirect: "/admin" }} replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="eyebrow text-muted-foreground">Acesso restrito</p>
          <h1 className="font-serif text-4xl mt-3">Esta área é somente para administradores</h1>
          <a href="/" className="mt-8 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em]">Voltar à loja</a>
        </div>
      </div>
    );
  }
  return <AdminLayout />;
}
