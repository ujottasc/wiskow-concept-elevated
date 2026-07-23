import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/categorias")({
  component: CategoriasAdmin,
});

function CategoriasAdmin() {
  const { categories, addCategory, removeCategory } = useStore();
  const [name, setName] = useState("");
  return (
    <div>
      <PageHeader title="Categorias" subtitle="Organização" />
      <div className="max-w-xl bg-card border border-border p-6">
        <form onSubmit={e => { e.preventDefault(); if (!name.trim()) return; addCategory({ id: name.toLowerCase().replace(/\s+/g, "-"), name }); setName(""); }} className="flex gap-2 mb-6">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nova categoria" className="flex-1 border border-border px-3 py-2 text-sm bg-transparent" />
          <button className="bg-foreground text-background px-5 text-xs uppercase tracking-[0.22em] inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Adicionar</button>
        </form>
        <ul className="divide-y divide-border">
          {categories.map(c => (
            <li key={c.id} className="py-3 flex justify-between items-center">
              <span className="text-sm">{c.name}</span>
              <button onClick={() => removeCategory(c.id)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
