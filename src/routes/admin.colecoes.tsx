import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";
import type { Collection } from "@/lib/types";

export const Route = createFileRoute("/admin/colecoes")({
  component: ColecoesAdmin,
});

function ColecoesAdmin() {
  const { collections, addCollection, updateCollection, removeCollection } = useStore();
  const [editing, setEditing] = useState<Collection | null>(null);

  const save = () => {
    if (!editing) return;
    const exists = collections.find(c => c.id === editing.id);
    if (exists) updateCollection(editing);
    else addCollection(editing);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Coleções" subtitle="Curadoria" action={
        <button onClick={() => setEditing({ id: `col-${Date.now()}`, name: "", description: "", image: "" })}
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.22em]">
          <Plus className="h-4 w-4" /> Nova coleção
        </button>
      } />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map(c => (
          <div key={c.id} className="bg-card border border-border overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" />}
            </div>
            <div className="p-5">
              <h3 className="font-serif text-xl">{c.name}</h3>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setEditing(c)} className="flex-1 border border-border py-2 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-1"><Pencil className="h-3 w-3" /> Editar</button>
                <button onClick={() => confirm(`Remover ${c.name}?`) && removeCollection(c.id)} className="border border-border w-10 flex items-center justify-center"><Trash2 className="h-3 w-3" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-lg bg-background h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Coleção</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <F label="Nome"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="input" /></F>
              <F label="Descrição"><textarea rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input" /></F>
              <F label="Imagem (URL)"><input value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} className="input" /></F>
              <button onClick={save} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em]">Salvar</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.input{width:100%;background:transparent;border:1px solid var(--border);padding:.6rem .8rem;font-size:.875rem;outline:none}`}</style>
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>{children}</div>;
}
