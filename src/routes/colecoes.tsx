import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/colecoes")({
  head: () => ({
    meta: [
      { title: "Coleções — Wiskow Concept" },
      { name: "description", content: "Todas as coleções Wiskow Concept." },
      { property: "og:title", content: "Coleções — Wiskow Concept" },
      { property: "og:description", content: "Todas as coleções Wiskow Concept." },
    ],
  }),
  component: Colecoes,
});

function Colecoes() {
  const { collections } = useStore();
  return (
    <SiteLayout>
      <section className="container-x pt-20 pb-12 text-center">
        <p className="eyebrow text-muted-foreground">Arquivo</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Coleções</h1>
        <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
          Uma retrospectiva das estações. Cada peça, um pensamento.
        </p>
      </section>

      <section className="container-x pb-24 space-y-16">
        {collections.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className={`grid gap-8 md:gap-16 md:grid-cols-2 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="eyebrow text-muted-foreground">Coleção {String(i + 1).padStart(2, "0")}</p>
              <h2 className="font-serif text-4xl md:text-6xl mt-4">{c.name}</h2>
              <p className="mt-6 text-muted-foreground max-w-md leading-relaxed">{c.description}</p>
              <Link to="/catalogo" className="mt-8 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors">
                Explorar
              </Link>
            </div>
          </motion.div>
        ))}
      </section>
    </SiteLayout>
  );
}
