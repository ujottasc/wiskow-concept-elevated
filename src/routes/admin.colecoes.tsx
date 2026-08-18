import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { PageHeader, AdminDrawer } from "@/components/AdminLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { useStore } from "@/lib/store";
import type { Collection } from "@/lib/types";

export const Route = createFileRoute("/admin/colecoes")({
  component: ColecoesAdmin,
});

function ColecoesAdmin() {
  const { collections, addCollection, updateCollection, removeCollection } = useStore();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return;
    setSaving(true);
    if (isNew) await addCollection(editing);
    else await updateCollection(editing);
    setSaving(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Coleções" subtitle="Curadoria" action={
        <button onClick={() => { setIsNew(true); setEditing({ id: `col-${Date.now().toString(36)}`, name: "", description: "", image: "", featured: false }); }}
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.22em]">
          <Plus className="h-4 w-4" /> Nova coleção
        </button>
      } />

      {collections.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma coleção cadastrada.</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map(c => (
          <div key={c.id} className="bg-card border border-border overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" loading="lazy" />}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl">{c.name}</h3>
                {c.featured && <Star className="h-3.5 w-3.5 fill-current text-petal" />}
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { setIsNew(false); setEditing(c); }} className="flex-1 border border-border py-2 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-1"><Pencil className="h-3 w-3" /> Editar</button>
                <button onClick={() => { if (confirm(`Remover ${c.name}?`)) void removeCollection(c.id); }} className="border border-border w-10 flex items-center justify-center"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-lg bg-background h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">{isNew ? "Nova coleção" : "Editar coleção"}</h2>
              <button onClick={() => setEditing(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <F label="Nome"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" /></F>
              <F label="Descrição"><textarea rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" /></F>
              <ImageUploader
                label="Imagem"
                folder="colecoes"
                value={editing.image ? [editing.image] : []}
                onChange={urls => setEditing({ ...editing, image: urls[0] ?? "" })}
              />
              <label className="flex items-center gap-3 text-sm">
                <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} />
                Destacar na home
              </label>
              <button onClick={save} disabled={saving} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>{children}</div>;
}
