import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, ShoppingBag, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useStore, formatPrice } from "@/lib/store";
import { normalizeVariants, variantGallery } from "@/lib/product-variants";

export const Route = createFileRoute("/produto/$id")({
  head: () => ({
    meta: [
      { title: "Produto — Wiskow Concept" },
      { name: "description", content: "Detalhes da peça Wiskow Concept." },
      { property: "og:title", content: "Produto — Wiskow Concept" },
      { property: "og:description", content: "Detalhes da peça Wiskow Concept." },
    ],
  }),
  component: ProdutoPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-x py-32 text-center">
        <h1 className="font-serif text-4xl">Peça não encontrada</h1>
        <Link to="/catalogo" className="mt-6 inline-block link-underline text-sm">Voltar ao catálogo</Link>
      </div>
    </SiteLayout>
  ),
});

function ProdutoPage() {
  const { id } = Route.useParams();
  const { products, favorites, toggleFavorite, addToCart, setCartOpen, settings } = useStore();
  const product = products.find(p => p.id === id);
  if (!product) throw notFound();

  const variants = useMemo(() => normalizeVariants(product), [product]);
  const [size, setSize] = useState(product.sizes[0]);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [activeImg, setActiveImg] = useState(0);
  const activeVariant = variants.find(v => v.id === variantId) ?? variants[0];
  const color = activeVariant?.name ?? product.colors[0] ?? "";
  const gallery = variantGallery(product, activeVariant);
  const selectVariant = (id: string) => { setVariantId(id); setActiveImg(0); };
  const variantStock = activeVariant && typeof activeVariant.stock === "number" ? activeVariant.stock : null;
  const soldOut = variantStock !== null && variantStock <= 0;
  const isFav = favorites.includes(product.id);
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const buy = () => {
    addToCart({ productId: product.id, size, color, quantity: 1 });
    setCartOpen(true);
  };
  const whats = () => {
    const msg = `Olá! Tenho interesse em ${product.name} (${size} · ${color}) — ${formatPrice(product.price)}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <SiteLayout>
      <div className="container-x pt-8 pb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalogo" className="hover:text-foreground">Catálogo</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <section className="container-x pb-24 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        {/* Gallery */}
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-3">
            {gallery.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-24 overflow-hidden border ${i === activeImg ? "border-foreground" : "border-transparent"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <motion.div
            key={`${variantId ?? ""}-${activeImg}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="flex-1 aspect-[3/4] overflow-hidden bg-muted"
          >
            <img src={gallery[activeImg] ?? gallery[0]} alt={product.name} className="h-full w-full object-cover hover:scale-110 transition-transform duration-[2000ms]" />
          </motion.div>
        </div>

        {/* Info */}
        <div className="lg:pl-8 lg:pt-8">
          {product.isNew && <p className="eyebrow text-accent">Novo</p>}
          <h1 className="font-serif text-4xl md:text-5xl mt-3">{product.name}</h1>
          <p className="mt-4 text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-2 text-xs text-muted-foreground uppercase tracking-[0.2em]">Em até 6x sem juros</p>
          {product.status === "Sob encomenda" && (
            <div className="mt-4 border border-border p-3 text-sm text-muted-foreground">
              <strong className="text-foreground uppercase tracking-[0.2em] text-xs">Sob encomenda</strong>
              <p className="mt-1">Prazo de até 5 dias após a confirmação do pagamento.</p>
            </div>
          )}

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          <div className={`mt-10 ${variants.length ? "" : "hidden"}`}>
            <p className="eyebrow text-muted-foreground">
              Cor · {color}
              {variantStock !== null && (
                <span className={soldOut ? "text-destructive ml-2" : "ml-2"}>
                  · {soldOut ? "Esgotado" : `${variantStock} disponível(is)`}
                </span>
              )}
            </p>
            <div className="mt-3 flex gap-3 flex-wrap">
              {variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => selectVariant(v.id)}
                  aria-pressed={activeVariant?.id === v.id}
                  title={v.name}
                  className={`inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 text-xs border transition-colors ${activeVariant?.id === v.id ? "border-foreground" : "border-border hover:border-foreground/50"}`}
                >
                  <span
                    className={`h-6 w-6 rounded-full border ${activeVariant?.id === v.id ? "border-foreground ring-1 ring-foreground ring-offset-2 ring-offset-background" : "border-border"}`}
                    style={{ backgroundColor: v.hex }}
                  />
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center">
              <p className="eyebrow text-muted-foreground">Tamanho</p>
              <button className="text-xs link-underline text-muted-foreground">Guia de tamanhos</button>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {product.sizes.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  className={`min-w-12 px-3 h-12 text-xs border ${size === s ? "border-foreground bg-foreground text-background" : "border-border"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            <button onClick={buy} disabled={soldOut} className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors inline-flex items-center justify-center gap-2">
              <ShoppingBag className="h-4 w-4" /> {soldOut ? "Esgotado" : "Adicionar à sacola"}
            </button>
            <button onClick={() => toggleFavorite(product.id)} className="w-14 border border-border flex items-center justify-center hover:border-foreground">
              <Heart className={`h-4 w-4 ${isFav ? "fill-accent text-accent" : ""}`} />
            </button>
          </div>
          <button onClick={whats} className="mt-3 w-full border border-foreground py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors inline-flex items-center justify-center gap-2">
            <MessageCircle className="h-4 w-4" /> Comprar pelo WhatsApp
          </button>

          <div className="mt-10 border-t border-border pt-6 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <p>Envio para todo o Brasil</p>
            <p>Troca em até 30 dias</p>
            <p>Embalagem premium</p>
            <p>Atendimento personalizado</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-24">
          <h2 className="font-serif text-3xl md:text-4xl mb-8">Você também vai gostar</h2>
          <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
