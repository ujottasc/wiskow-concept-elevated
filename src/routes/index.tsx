import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Instagram } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { IMG } from "@/lib/brand-images";

const OG_IMAGE = `https://wiskow-concept-elevated.lovable.app${IMG.bodyCutout}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wiskow Concept — Moda Feminina Contemporânea" },
      { name: "description", content: "Malha segunda pele, bodies, conjuntos e denim. Conheça a nova coleção Wiskow Concept." },
      { property: "og:title", content: "Wiskow Concept" },
      { property: "og:description", content: "Malha segunda pele, bodies, conjuntos e denim." },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: Home,
});


function Home() {
  const { banners, settings, collections, products, categories } = useStore();
  const hero = banners.find(b => b.id === settings.heroBannerId) ?? banners[0];
  const featuredCollections = collections.filter(c => settings.featuredCollectionIds.includes(c.id)).slice(0, 3);
  const featuredProducts = products.filter(p => settings.featuredProductIds.includes(p.id)).slice(0, 4);

  return (
    <SiteLayout transparentNav>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        {hero && (
          <>
            <motion.img
              initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
              src={hero.image} alt={hero.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50" />
          </>
        )}
        <div className="relative h-full container-x flex flex-col justify-end pb-20 md:pb-28 text-white">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.4 }} className="eyebrow">
            {hero?.subtitle ?? "Nova coleção"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl mt-4 leading-[0.95]"
          >
            {hero?.title ?? "Wiskow"}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.9 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link to="/nova-colecao" className="border border-white px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-colors">
              Nova coleção
            </Link>
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"
              className="px-8 py-3 text-xs uppercase tracking-[0.25em] link-underline">
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="container-x py-24 md:py-32 text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="eyebrow text-muted-foreground">
          Wiskow Concept
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-4xl md:text-6xl mt-4 max-w-3xl mx-auto leading-tight">
          Peças pensadas para durar mais que uma estação.
        </motion.h2>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="container-x pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-muted-foreground">Coleções</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-2">Em destaque</h2>
          </div>
          <Link to="/colecoes" className="hidden md:inline text-xs uppercase tracking-[0.22em] link-underline">Ver todas</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCollections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link to="/colecoes" className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="eyebrow text-muted-foreground">Coleção</p>
                    <h3 className="font-serif text-2xl mt-1">{c.name}</h3>
                  </div>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LOOKS / FEATURED PRODUCTS */}
      <section className="container-x pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-muted-foreground">Looks favoritos</p>
            <h2 className="font-serif text-4xl md:text-5xl mt-2">A seleção da estação</h2>
          </div>
          <Link to="/catalogo" className="hidden md:inline text-xs uppercase tracking-[0.22em] link-underline">Ver catálogo</Link>
        </div>
        <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-secondary/40 py-24">
        <div className="container-x">
          <p className="eyebrow text-muted-foreground text-center">Categorias</p>
          <h2 className="font-serif text-4xl md:text-5xl mt-2 text-center">Explore por peça</h2>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link to="/catalogo" search={{ cat: c.id }} className="block border border-border bg-background py-8 text-center hover:bg-foreground hover:text-background transition-colors">
                  <span className="font-serif text-xl">{c.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL GALLERY */}
      <section className="container-x py-24">
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} className="md:row-span-2 aspect-[3/4] md:aspect-auto overflow-hidden">
            <img src={IMG.conjuntoOff} alt="Conjunto cropped e saia off white Wiskow Concept" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }} className="aspect-square overflow-hidden">
            <img src={IMG.chocolateLook} alt="Blusa segunda pele chocolate com jeans" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }} className="aspect-square overflow-hidden">
            <img src={IMG.amarracaoCostas} alt="Blusa com amarração nas costas" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3 }} className="md:col-span-2 aspect-[2/1] overflow-hidden">
            <img src={IMG.neon} alt="Editorial neon Wiskow Concept" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>

        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24 text-center">
        <p className="eyebrow text-muted-foreground">Atendimento personalizado</p>
        <h2 className="font-serif text-4xl md:text-6xl mt-4 max-w-2xl mx-auto leading-tight">
          Encontre a peça perfeita com nossa consultoria pessoal.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="bg-foreground text-background px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors">
            Falar no WhatsApp
          </a>
          <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors">
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
