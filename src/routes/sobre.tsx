import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { IMG } from "@/lib/brand-images";


export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Wiskow Concept" },
      { name: "description", content: "A história e o manifesto da Wiskow Concept." },
      { property: "og:title", content: "Sobre — Wiskow Concept" },
      { property: "og:description", content: "A história e o manifesto da Wiskow Concept." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="container-x pt-20 pb-16 text-center max-w-4xl mx-auto">
        <p className="eyebrow text-muted-foreground">Manifesto</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">Roupa não é tendência.<br/>É linguagem.</h1>
      </section>

      <section className="container-x pb-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <img src={IMG.neonAlt} alt="Editorial Wiskow Concept em luz neon" className="h-full w-full object-cover" />
        </motion.div>
      </section>

      <section className="container-x pb-24 grid gap-16 md:grid-cols-2 max-w-5xl mx-auto">
        <div>
          <p className="eyebrow text-muted-foreground">A marca</p>
          <h2 className="font-serif text-3xl md:text-4xl mt-4">Nasceu do gesto.</h2>
        </div>
        <div className="text-muted-foreground leading-relaxed space-y-4">
          <p>A Wiskow Concept começou como um caderno de recortes. Silhuetas anotadas, tecidos tocados de leve, cores absorvidas nas viagens. Uma marca que fala baixo, mas fica.</p>
          <p>Trabalhamos com pequenas produções, matérias-primas naturais e uma obsessão discreta pelo caimento. Cada peça é pensada para envelhecer com a mulher que a veste.</p>
        </div>
      </section>

      <section className="container-x pb-24 grid gap-6 md:grid-cols-3">
        <div className="aspect-[3/4] overflow-hidden"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" className="h-full w-full object-cover" alt="" /></div>
        <div className="aspect-[3/4] overflow-hidden md:mt-16"><img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80" className="h-full w-full object-cover" alt="" /></div>
        <div className="aspect-[3/4] overflow-hidden"><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80" className="h-full w-full object-cover" alt="" /></div>
      </section>

      <section className="container-x pb-24 max-w-3xl mx-auto text-center">
        <p className="eyebrow text-muted-foreground">Nossos valores</p>
        <div className="mt-10 grid gap-10 md:grid-cols-3 text-left">
          {[
            { t: "Feito com tempo", d: "Sem pressa industrial. Peças pequenas, feitas com atenção." },
            { t: "Materiais naturais", d: "Linho, seda, cashmere, algodão egípcio. Fibras que respiram." },
            { t: "Silhueta que fica", d: "Design que não persegue estações. Roupa para o guarda-roupa." },
          ].map(v => (
            <div key={v.t}>
              <h3 className="font-serif text-2xl">{v.t}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
