import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Search, SlidersHorizontal } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

const searchSchema = z.object({
  cat: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Catálogo — Wiskow Concept" },
      { name: "description", content: "Explore o catálogo completo Wiskow Concept." },
      { property: "og:title", content: "Catálogo — Wiskow Concept" },
      { property: "og:description", content: "Explore o catálogo completo Wiskow Concept." },
    ],
  }),
  component: Catalogo,
});

type Sort = "recent" | "asc" | "desc";
type StatusFilter = "all" | "Disponível" | "Sob encomenda";

function Catalogo() {
  const { cat, q } = Route.useSearch();
  const { products, categories, collections } = useStore();
  const [selectedCat, setSelectedCat] = useState<string | null>(cat ?? null);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [query, setQuery] = useState(q ?? "");
  const [sort, setSort] = useState<Sort>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    let r = [...products];
    if (selectedCat) r = r.filter(p => p.category === selectedCat);
    if (selectedCol) r = r.filter(p => p.collectionId === selectedCol);
    if (statusFilter !== "all") r = r.filter(p => p.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (sort === "asc") r.sort((a, b) => a.price - b.price);
    if (sort === "desc") r.sort((a, b) => b.price - a.price);
    return r;
  }, [products, selectedCat, selectedCol, query, sort, statusFilter]);

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "Disponível", label: "Disponíveis" },
    { key: "Sob encomenda", label: "Sob encomenda" },
  ];

  return (
    <SiteLayout>
      <section className="container-x pt-16 pb-8 text-center">
        <p className="eyebrow text-muted-foreground">Loja</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Catálogo</h1>
      </section>

      <section className="container-x pb-24">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR */}
          <aside className={`lg:w-64 shrink-0 ${filtersOpen ? "" : "hidden lg:block"}`}>
            <div className="space-y-8 sticky top-24">
              <div>
                <label className="eyebrow text-muted-foreground">Buscar</label>
                <div className="mt-3 flex border-b border-border">
                  <Search className="h-4 w-4 self-center text-muted-foreground" />
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="O que procura?"
                    className="bg-transparent flex-1 py-2 px-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground">Categorias</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><button onClick={() => setSelectedCat(null)} className={`text-left ${!selectedCat ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}>Todas</button></li>
                  {categories.map(c => (
                    <li key={c.id}>
                      <button onClick={() => setSelectedCat(c.id)} className={`text-left ${selectedCat === c.id ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}>{c.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground">Coleções</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li><button onClick={() => setSelectedCol(null)} className={`text-left ${!selectedCol ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}>Todas</button></li>
                  {collections.map(c => (
                    <li key={c.id}>
                      <button onClick={() => setSelectedCol(c.id)} className={`text-left ${selectedCol === c.id ? "text-foreground" : "text-muted-foreground"} hover:text-foreground transition-colors`}>{c.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* MAIN */}
          <div className="flex-1">
            <div className="flex items-center justify-between border-y border-border py-4 mb-8">
              <button onClick={() => setFiltersOpen(v => !v)} className="lg:hidden inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em]">
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </button>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{filtered.length} peças</p>
              <div className="flex items-center gap-2">
                <label className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Ordenar</label>
                <select value={sort} onChange={e => setSort(e.target.value as Sort)} className="bg-transparent text-sm outline-none border-b border-transparent hover:border-border">
                  <option value="recent">Mais recentes</option>
                  <option value="asc">Menor preço</option>
                  <option value="desc">Maior preço</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:gap-8 grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-24">Nenhuma peça encontrada com esses filtros.</p>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
