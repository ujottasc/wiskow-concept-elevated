import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/informacoes")({
  head: () => ({
    meta: [
      { title: "Informações — Wiskow Concept" },
      { name: "description", content: "Trocas, envios, guia de tamanhos e cuidados com as peças Wiskow Concept." },
      { property: "og:title", content: "Informações — Wiskow Concept" },
      { property: "og:description", content: "Trocas, envios, tamanhos e cuidados com as peças." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Informacoes,
});

function Informacoes() {
  const { content } = useStore();

  return (
    <SiteLayout>
      <section className="container-x pt-20 pb-12 text-center">
        <p className="eyebrow text-muted-foreground">Atendimento</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Informações</h1>
      </section>

      <section className="container-x pb-24 max-w-3xl mx-auto space-y-12">
        {content.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">Em breve, mais informações por aqui.</p>
        )}
        {content.map(c => (
          <article key={c.id}>
            <h2 className="font-serif text-3xl">{c.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{c.body}</p>
          </article>
        ))}
      </section>
    </SiteLayout>
  );
}
