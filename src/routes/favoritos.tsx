import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, X } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/favoritos")({
  head: () => ({
    meta: [
      { title: "Favoritos — Wiskow Concept" },
      { name: "description", content: "Sua wishlist Wiskow Concept." },
      { property: "og:title", content: "Favoritos — Wiskow Concept" },
      { property: "og:description", content: "Sua wishlist." },
    ],
  }),
  component: Favoritos,
});

function Favoritos() {
  const { favorites, products, toggleFavorite, addToCart, setCartOpen } = useStore();
  const items = products.filter(p => favorites.includes(p.id));

  return (
    <SiteLayout>
      <section className="container-x py-16">
        <p className="eyebrow text-muted-foreground">Wishlist</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">Favoritos</h1>

        {items.length === 0 ? (
          <div className="mt-16 text-center py-24 border-t border-border">
            <Heart className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Você ainda não salvou nenhuma peça.</p>
            <Link to="/catalogo" className="mt-6 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map(p => (
              <div key={p.id} className="group relative">
                <Link to="/produto/$id" params={{ id: p.id }} className="block">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </div>
                  <div className="mt-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-sm">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => { addToCart({ productId: p.id, size: p.sizes[0], color: p.colors[0], quantity: 1 }); setCartOpen(true); }}
                    className="flex-1 border border-foreground py-2.5 text-[10px] uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="h-3 w-3" /> Mover para sacola
                  </button>
                  <button onClick={() => toggleFavorite(p.id)} className="border border-border w-10 flex items-center justify-center hover:border-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
