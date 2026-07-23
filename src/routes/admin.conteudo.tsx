import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";

export const Route = createFileRoute("/admin/conteudo")({
  component: ConteudoAdmin,
});

function ConteudoAdmin() {
  return (
    <div>
      <PageHeader title="Conteúdo" subtitle="Páginas editoriais" />
      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {["Sobre", "Manifesto", "Política de Trocas", "Guia de tamanhos"].map(t => (
          <div key={t} className="bg-card border border-border p-6">
            <h3 className="font-serif text-xl">{t}</h3>
            <p className="text-xs text-muted-foreground mt-2">Última atualização · há 3 dias</p>
            <button className="mt-4 text-xs uppercase tracking-[0.22em] link-underline">Editar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
