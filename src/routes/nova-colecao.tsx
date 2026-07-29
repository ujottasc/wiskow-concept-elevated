import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/nova-colecao")({
  head: () => ({
    meta: [
      { title: "Nova Coleção — Wiskow Concept" },
      { name: "description", content: "Atelier 25. Precisão em cada corte." },
      { property: "og:title", content: "Nova Coleção — Wiskow Concept" },
      { property: "og:description", content: "Atelier 25. Precisão em cada corte." },
    ],
  }),
  component: NovaColecao,
});

function NovaColecao() {
  const { collections, products } = useStore();
  const col = collections.find(c => c.id === "atelier-25") ?? collections[0];
  const items = products.filter(p => p.collectionId === col?.id);

  return (
    <SiteLayout>
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden">
        {col && (
          <>
            <motion.img
              initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              src={col.image} alt={col.name} className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        )}
        <div className="relative h-full container-x flex flex-col justify-end pb-20 text-white">
          <p className="eyebrow">Nova coleção</p>
          <h1 className="font-serif text-6xl md:text-8xl mt-4">{col?.name}</h1>
          <p className="max-w-lg mt-6 text-sm md:text-base leading-relaxed opacity-90">{col?.description}</p>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-24">
            Em breve. <Link to="/catalogo" className="link-underline">Ver catálogo</Link>
          </p>
        )}
      </section>
    </SiteLayout>
  );
}
