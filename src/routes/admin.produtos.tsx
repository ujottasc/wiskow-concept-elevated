import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/produtos")({
  component: ProdutosAdmin,
});

const empty: Product = {
  id: "",
  name: "",
  price: 0,
  category: "vestidos",
  collectionId: "",
  description: "",
  images: [""],
  sizes: ["P", "M", "G"],
  colors: ["Preto"],
  stock: 10,
};

function ProdutosAdmin() {
  const { products, categories, collections, addProduct, updateProduct, removeProduct } = useStore();
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [editing, setEditing] = useState<Product | null>(null);

  const filtered = products.filter(p =>
    (!catFilter || p.category === catFilter) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  );

  const openNew = () => setEditing({ ...empty, id: `p-${Date.now()}` });

  const save = () => {
    if (!editing) return;
    const exists = products.find(p => p.id === editing.id);
    if (exists) updateProduct(editing);
    else addProduct(editing);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader
        title="Catálogo"
        subtitle="Produtos"
        action={
          <button onClick={openNew} className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.22em]">
            <Plus className="h-4 w-4" /> Novo produto
          </button>
        }
      />

      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex items-center border-b border-border flex-1 min-w-64">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar..." className="bg-transparent px-3 py-2 text-sm outline-none flex-1" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="bg-transparent border border-border px-3 py-2 text-sm">
          <option value="">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="p-4 eyebrow text-muted-foreground">Produto</th>
              <th className="p-4 eyebrow text-muted-foreground hidden md:table-cell">Categoria</th>
              <th className="p-4 eyebrow text-muted-foreground hidden md:table-cell">Estoque</th>
              <th className="p-4 eyebrow text-muted-foreground text-right">Preço</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-secondary/40">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-12 object-cover" />
                  <span>{p.name}</span>
                </td>
                <td className="p-3 hidden md:table-cell capitalize">{p.category}</td>
                <td className="p-3 hidden md:table-cell">{p.stock}</td>
                <td className="p-3 text-right">{formatPrice(p.price)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} className="p-2 hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => confirm(`Remover ${p.name}?`) && removeProduct(p.id)} className="p-2 hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-lg bg-background h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">{products.find(p => p.id === editing.id) ? "Editar" : "Novo"} produto</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Nome"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
              <Field label="Preço"><input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} className="input" /></Field>
              <Field label="Categoria">
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="input">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Coleção">
                <select value={editing.collectionId ?? ""} onChange={e => setEditing({ ...editing, collectionId: e.target.value })} className="input">
                  <option value="">Nenhuma</option>
                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Descrição"><textarea rows={4} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="input" /></Field>
              <Field label="Imagens (URL, uma por linha)">
                <textarea rows={3} value={editing.images.join("\n")} onChange={e => setEditing({ ...editing, images: e.target.value.split("\n").filter(Boolean) })} className="input" />
                <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.2em]">Upload mock — cole URLs de imagem</p>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Tamanhos (vírgula)"><input value={editing.sizes.join(", ")} onChange={e => setEditing({ ...editing, sizes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="input" /></Field>
                <Field label="Cores (vírgula)"><input value={editing.colors.join(", ")} onChange={e => setEditing({ ...editing, colors: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} className="input" /></Field>
              </div>
              <Field label="Estoque"><input type="number" value={editing.stock} onChange={e => setEditing({ ...editing, stock: +e.target.value })} className="input" /></Field>
              <div className="flex gap-2 pt-4 border-t border-border">
                <button onClick={save} className="flex-1 bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em]">Salvar</button>
                <button onClick={() => setEditing(null)} className="px-6 py-3 text-xs uppercase tracking-[0.22em] border border-border">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;background:transparent;border:1px solid var(--border);padding:.6rem .8rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
