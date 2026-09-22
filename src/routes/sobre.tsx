import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { IMG } from "@/lib/brand-images";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Wiskow Concept" },
      {
        name: "description",
        content: "A história e o manifesto da Wiskow Concept.",
      },
      { property: "og:title", content: "Sobre — Wiskow Concept" },
      {
        property: "og:description",
        content: "A história e o manifesto da Wiskow Concept.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="container-x pt-20 pb-16 text-center max-w-4xl mx-auto">
        <p className="eyebrow text-muted-foreground">A marca</p>

        <h1 className="font-serif text-5xl md:text-7xl mt-4 leading-tight">
          Nasceu de um sonho.
        </h1>
      </section>

      <section className="container-x pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="aspect-[16/9] md:aspect-[21/9] overflow-hidden"
        >
          <img src={IMG.neonAlt} alt="Editorial Wiskow Concept em luz neon" className="h-full w-full object-cover" />
        </motion.div>
      </section>

      <section className="container-x pb-24 grid gap-16 md:grid-cols-2 max-w-5xl mx-auto">
        <div>
          <p className="eyebrow text-muted-foreground">Wiskow Concept</p>

          <h2 className="font-serif text-3xl md:text-4xl mt-4">Uma ideia transformada em algo real.</h2>
        </div>

        <div className="text-muted-foreground leading-relaxed space-y-4">
          <p>
            A Wiskow Concept nasceu da vontade de transformar uma ideia em algo real. Um sonho construído com coragem
            para começar, dedicação em cada detalhe e o desejo de criar uma marca que tivesse personalidade.
          </p>

          <p>
            Mais do que roupas, a Wiskow Concept representa uma forma de se expressar. Peças escolhidas para acompanhar
            diferentes momentos, do cotidiano às ocasiões especiais, sempre com um olhar atento às tendências e àquilo
            que faz cada mulher se sentir confiante.
          </p>

          <p>
            Acreditamos na moda como extensão da personalidade, na autoestima que nasce quando você se sente bem com o
            que veste e nos detalhes que tornam cada escolha única.
          </p>

          <p>
            A Wiskow Concept é só o começo de uma história que queremos construir junto com vocês.
          </p>
        </div>
      </section>

      <section className="container-x pb-24 grid gap-6 md:grid-cols-3">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={IMG.caneladaOffLook}
            className="h-full w-full object-cover"
            alt="Blusa canelada off white com jeans wide"
            loading="lazy"
          />
        </div>

        <div className="aspect-[3/4] overflow-hidden md:mt-16">
          <img
            src={IMG.vestidoCurtoCostas}
            className="h-full w-full object-cover"
            alt="Vestido curto preto de costas"
            loading="lazy"
          />
        </div>

        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={IMG.conjuntoCutout}
            className="h-full w-full object-cover"
            alt="Conjunto cut-out preto"
            loading="lazy"
          />
        </div>
      </section>

    </SiteLayout>
  );
}
