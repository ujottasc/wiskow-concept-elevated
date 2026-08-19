import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { PageHeader, AdminDrawer } from "@/components/AdminLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { ColorVariantsEditor } from "@/components/ColorVariantsEditor";
import { useStore, formatPrice } from "@/lib/store";
import type { Product } from "@/lib/types";

export const Route = createFileRoute("/admin/produtos")({
  component: ProdutosAdmin,
});

const empty: Product = {
  id: "",
  name: "",
  price: 0,
  category: "",
  collectionId: "",
  description: "",
  images: [],
  sizes: ["P", "M", "G"],
  colors: [],
  variants: [],
  featured: false,
  isNew: false,
  stock: 10,
  status: "Disponível",
};

function ProdutosAdmin() {
  const { products, categories, collections, addProduct, updateProduct, removeProduct } = useStore();
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = products.filter(p =>
    (!catFilter || p.category === catFilter) &&
    (!query || p.name.toLowerCase().includes(query.toLowerCase()))
  );

  const openNew = () => setEditing({ ...empty, category: categories[0]?.id ?? "" });

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return;
    const variants = (editing.variants ?? []).filter(v => v.name.trim());
    if ((editing.variants ?? []).length !== variants.length) {
      toast.error("Existe uma cor sem nome. Preencha ou remova antes de salvar.");
      return;
    }
    const names = variants.map(v => v.name.trim().toLowerCase());
    if (new Set(names).size !== names.length) {
      toast.error("Há cores duplicadas neste produto.");
      return;
    }
    setSaving(true);
    const payload = { ...editing, variants, colors: variants.length ? variants.map(v => v.name.trim()) : editing.colors };
    const exists = products.find(p => p.id === editing.id);
    if (exists) await updateProduct(payload);
    else await addProduct(payload);
    setSaving(false);
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

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center mb-6">
        <div className="flex items-center border-b border-border flex-1 min-w-0 sm:min-w-64">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar..." className="bg-transparent px-3 py-2 text-sm outline-none flex-1" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="w-full sm:w-auto bg-transparent border border-border px-3 py-2 text-sm">
          <option value="">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="hidden md:block bg-card border border-border overflow-x-auto">
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
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.images[0] && <img src={p.images[0]} alt="" className="w-10 h-12 object-cover" />}
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell capitalize">{categories.find(c => c.id === p.category)?.name ?? "—"}</td>
                <td className="p-3 hidden md:table-cell">{p.stock}</td>
                <td className="p-3 text-right">{formatPrice(p.price)}</td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} aria-label="Editar" className="p-2 hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => { if (confirm(`Remover ${p.name}?`)) void removeProduct(p.id); }} aria-label="Remover" className="p-2 hover:bg-secondary"><Trash2 className="h-3.5 w-3.5" /></button>
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


      {/* Lista em cards no mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-card border border-border p-3">
            <div className="flex gap-3">
              {p.images[0] && <img src={p.images[0]} alt="" className="w-16 h-20 shrink-0 object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="font-medium break-words">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{categories.find(c => c.id === p.category)?.name ?? "Sem categoria"}</p>
                <p className="text-sm mt-1">{formatPrice(p.price)} · <span className="text-muted-foreground text-xs">{p.stock} em estoque</span></p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setEditing(p)} className="flex-1 border border-border min-h-11 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2"><Pencil className="h-4 w-4" /> Editar</button>
              <button onClick={() => { if (confirm(`Remover ${p.name}?`)) void removeProduct(p.id); }} aria-label="Remover" className="border border-border w-11 min-h-11 flex items-center justify-center"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum produto encontrado.</p>}
      </div>

      {editing && (
        <AdminDrawer title={`${products.find(p => p.id === editing.id) ? "Editar" : "Novo"} produto`} onClose={() => setEditing(null)}>

              <Field label="Nome"><input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} className="input" /></Field>
              <Field label="Preço"><input type="number" min={0} step="0.01" value={editing.price} onChange={e => setEditing({ ...editing, price: +e.target.value })} className="input" /></Field>
              <Field label="Categoria">
                <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} className="input">
                  <option value="">Sem categoria</option>
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

              <ImageUploader
                label="Imagens gerais (usadas quando não há cor selecionada)"
                multiple
                folder="produtos"
                value={editing.images}
                onChange={images => setEditing({ ...editing, images })}
              />

              <ColorVariantsEditor
                value={editing.variants ?? []}
                onChange={variants => setEditing({ ...editing, variants })}
              />

              <Field label="Tamanhos disponíveis">
                <SizesPicker value={editing.sizes} onChange={sizes => setEditing({ ...editing, sizes })} />
              </Field>
              <Field label="Estoque"><input type="number" min={0} value={editing.stock} onChange={e => setEditing({ ...editing, stock: +e.target.value })} className="input" /></Field>

              <div className="flex gap-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} />
                  Destaque
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!editing.isNew} onChange={e => setEditing({ ...editing, isNew: e.target.checked })} />
                  Novidade
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                <button disabled={saving || !editing.name.trim()} onClick={() => void save()} className="flex-1 bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">
                  {saving ? "Salvando…" : "Salvar"}
                </button>
                <button onClick={() => setEditing(null)} className="px-6 py-3 text-xs uppercase tracking-[0.22em] border border-border">Cancelar</button>
              </div>
        </AdminDrawer>
      )}

      <style>{`.input{width:100%;background:transparent;border:1px solid var(--border);padding:.6rem .8rem;font-size:.875rem;outline:none}.input:focus{border-color:var(--foreground)}`}</style>
    </div>
  );
}

const PRESET_SIZES = ["PP", "P", "M", "G", "GG", "XG", "Tam único"];

function SizesPicker({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");
  const toggle = (s: string) => {
    const has = value.some(v => v.toLowerCase() === s.toLowerCase());
    onChange(has ? value.filter(v => v.toLowerCase() !== s.toLowerCase()) : [...value, s]);
  };
  const addCustom = () => {
    const s = custom.trim();
    if (!s) return;
    if (!value.some(v => v.toLowerCase() === s.toLowerCase())) onChange([...value, s]);
    setCustom("");
  };
  const extras = value.filter(v => !PRESET_SIZES.some(p => p.toLowerCase() === v.toLowerCase()));
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[...PRESET_SIZES, ...extras].map(s => {
          const active = value.some(v => v.toLowerCase() === s.toLowerCase());
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              aria-pressed={active}
              className={`min-h-11 px-4 text-xs uppercase tracking-[0.18em] border ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground/50"}`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder="Outro tamanho (ex.: 38)"
          className="input flex-1"
        />
        <button type="button" onClick={addCustom} className="px-4 border border-border text-xs uppercase tracking-[0.18em]">Adicionar</button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {value.length ? `Selecionados: ${value.join(" · ")}` : "Nenhum tamanho selecionado."}
      </p>
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
