import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";
import type { Banner } from "@/lib/types";

export const Route = createFileRoute("/admin/banners")({
  component: BannersAdmin,
});

function BannersAdmin() {
  const { banners, addBanner, updateBanner, removeBanner } = useStore();
  const [editing, setEditing] = useState<Banner | null>(null);

  const save = () => {
    if (!editing) return;
    const exists = banners.find(b => b.id === editing.id);
    if (exists) updateBanner(editing);
    else addBanner(editing);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Banners" subtitle="Home" action={
        <button onClick={() => setEditing({ id: `b-${Date.now()}`, title: "", subtitle: "", image: "", cta: "", href: "", order: banners.length + 1 })}
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.22em]">
          <Plus className="h-4 w-4" /> Novo banner
        </button>
      } />

      <div className="space-y-4">
        {banners.map(b => (
          <div key={b.id} className="bg-card border border-border flex gap-6 overflow-hidden">
            <div className="w-56 h-40 shrink-0 bg-muted overflow-hidden">
              {b.image && <img src={b.image} alt={b.title} className="h-full w-full object-cover" />}
            </div>
            <div className="flex-1 p-4">
              <p className="eyebrow text-muted-foreground">Ordem {b.order}</p>
              <h3 className="font-serif text-2xl mt-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{b.subtitle}</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button onClick={() => setEditing(b)} className="border border-border p-2"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => removeBanner(b.id)} className="border border-border p-2"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-lg bg-background h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Banner</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {[
                ["Título", "title"], ["Subtítulo", "subtitle"], ["Imagem (URL)", "image"], ["CTA", "cta"], ["Link", "href"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>
                  <input value={(editing as any)[key] ?? ""} onChange={e => setEditing({ ...editing, [key]: e.target.value } as Banner)} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Ordem</label>
                <input type="number" value={editing.order} onChange={e => setEditing({ ...editing, order: +e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
              </div>
              <button onClick={save} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em]">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
