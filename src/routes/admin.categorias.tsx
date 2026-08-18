import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriasAdmin,
});

function CategoriasAdmin() {
  const { categories, products, addCategory, updateCategory, removeCategory } = useStore();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return;
    const id = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await addCategory({ id, name: value });
    setName("");
  };

  return (
    <div>
      <PageHeader title="Categorias" subtitle="Organização" />
      <div className="max-w-xl bg-card border border-border p-6">
        <form onSubmit={create} className="flex gap-2 mb-6">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nova categoria" className="flex-1 border border-border px-3 py-2 text-sm bg-transparent" />
          <button className="bg-foreground text-background px-5 text-xs uppercase tracking-[0.22em] inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Adicionar</button>
        </form>
        <ul className="divide-y divide-border">
          {categories.map(c => {
            const count = products.filter(p => p.category === c.id).length;
            const editing = editingId === c.id;
            return (
              <li key={c.id} className="py-3 flex justify-between items-center gap-3">
                {editing ? (
                  <input autoFocus value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 border border-border px-2 py-1 text-sm bg-transparent" />
                ) : (
                  <span className="text-sm">{c.name} <span className="text-xs text-muted-foreground">· {count} peça(s)</span></span>
                )}
                <div className="flex items-center gap-2">
                  {editing ? (
                    <>
                      <button aria-label="Salvar" onClick={async () => { if (editName.trim()) await updateCategory({ id: c.id, name: editName.trim() }); setEditingId(null); }}><Check className="h-4 w-4" /></button>
                      <button aria-label="Cancelar" onClick={() => setEditingId(null)}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </>
                  ) : (
                    <>
                      <button aria-label="Editar" onClick={() => { setEditingId(c.id); setEditName(c.name); }}><Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" /></button>
                      <button aria-label="Remover" onClick={() => { if (confirm(`Remover ${c.name}?`)) void removeCategory(c.id); }}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" /></button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {categories.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma categoria ainda.</p>}
      </div>
    </div>
  );
}
