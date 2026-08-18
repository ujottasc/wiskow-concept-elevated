import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/perfil")({
  component: PerfilAdmin,
});

function PerfilAdmin() {
  const { user, logout, updateProfile } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await updateProfile({ name: name.trim(), phone: phone.trim() });
    setSaving(false);
    if (res.ok) toast.success("Perfil atualizado.");
    else toast.error(res.error ?? "Não foi possível salvar.");
  };

  return (
    <div>
      <PageHeader title="Perfil" subtitle="Conta" />
      <div className="max-w-xl bg-card border border-border p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center font-serif text-2xl">
            {user?.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-serif text-xl">{user?.email}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-[0.22em]">Acesso · {user?.role === "ADMIN" ? "Administradora" : "Cliente"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Nome</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Telefone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="51999999999" className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
          </div>
          <button onClick={save} disabled={saving} className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar perfil"}
          </button>
        </div>

        <button onClick={logout} className="border border-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors">
          Encerrar sessão
        </button>
      </div>
    </div>
  );
}
