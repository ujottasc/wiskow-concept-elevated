import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/pagina-inicial")({
  component: HomeAdmin,
});

function HomeAdmin() {
  const { banners, collections, products, settings, updateSettings } = useStore();

  const toggle = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id];

  return (
    <div>
      <PageHeader title="Página Inicial" subtitle="Curadoria" />
      <div className="space-y-10 max-w-4xl">
        <section>
          <h2 className="font-serif text-2xl mb-4">Banner principal</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {banners.map(b => (
              <button key={b.id} onClick={() => updateSettings({ heroBannerId: b.id })}
                className={`border overflow-hidden text-left ${settings.heroBannerId === b.id ? "border-foreground ring-2 ring-foreground/20" : "border-border"}`}>
                {b.image && <div className="aspect-[4/3] overflow-hidden"><img src={b.image} alt={b.title} className="h-full w-full object-cover" /></div>}
                <div className="p-3"><p className="font-serif">{b.title}</p></div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Coleções em destaque</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {collections.map(c => {
              const on = settings.featuredCollectionIds.includes(c.id);
              return (
                <button key={c.id} onClick={() => updateSettings({ featuredCollectionIds: toggle(settings.featuredCollectionIds, c.id) })}
                  className={`border overflow-hidden text-left ${on ? "border-foreground ring-2 ring-foreground/20" : "border-border"}`}>
                  <div className="aspect-[4/3] overflow-hidden"><img src={c.image} alt={c.name} className="h-full w-full object-cover" /></div>
                  <div className="p-3"><p className="font-serif">{c.name}</p></div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-4">Produtos em destaque</h2>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {products.map(p => {
              const on = settings.featuredProductIds.includes(p.id);
              return (
                <button key={p.id} onClick={() => updateSettings({ featuredProductIds: toggle(settings.featuredProductIds, p.id) })}
                  className={`border overflow-hidden text-left ${on ? "border-foreground ring-2 ring-foreground/20" : "border-border"}`}>
                  <div className="aspect-[3/4] overflow-hidden"><img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /></div>
                  <div className="p-2"><p className="text-xs">{p.name}</p></div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
