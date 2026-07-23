import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/perfil")({
  component: PerfilAdmin,
});

function PerfilAdmin() {
  const { user, logout } = useStore();
  return (
    <div>
      <PageHeader title="Perfil" subtitle="Conta" />
      <div className="max-w-xl bg-card border border-border p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-serif text-2xl">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-serif text-xl">{user?.email}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.22em]">Role · {user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="mt-8 border border-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors">
          Encerrar sessão
        </button>
      </div>
    </div>
  );
}
