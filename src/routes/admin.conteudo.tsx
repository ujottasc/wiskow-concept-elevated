import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";
import type { SiteContent } from "@/lib/types";

export const Route = createFileRoute("/admin/conteudo")({
  component: ConteudoAdmin,
});

function ConteudoAdmin() {
  const { content, saveContent, removeContent } = useStore();
  const [editing, setEditing] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing || !editing.title.trim()) return;
    setSaving(true);
    await saveContent(editing);
    setSaving(false);
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Conteúdo" subtitle="Páginas editoriais" action={
        <button onClick={() => setEditing({ id: `pg-${Date.now().toString(36)}`, title: "", body: "", order: content.length + 1 })}
          className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.22em]">
          <Plus className="h-4 w-4" /> Novo bloco
        </button>
      } />

      <p className="text-xs text-muted-foreground mb-6">Estes blocos aparecem na página pública <a href="/informacoes" className="link-underline">/informacoes</a>.</p>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
        {content.map(c => (
          <div key={c.id} className="bg-card border border-border p-6">
            <h3 className="font-serif text-xl">{c.title}</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-3 whitespace-pre-line">{c.body}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditing(c)} className="flex-1 border border-border py-2 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-1"><Pencil className="h-3 w-3" /> Editar</button>
              <button onClick={() => { if (confirm(`Remover ${c.title}?`)) void removeContent(c.id); }} className="border border-border w-10 flex items-center justify-center"><Trash2 className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
      </div>
      {content.length === 0 && <p className="text-sm text-muted-foreground">Nenhum conteúdo criado ainda.</p>}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-full max-w-2xl bg-background h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Bloco de conteúdo</h2>
              <button onClick={() => setEditing(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Título</label>
                <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Texto</label>
                <textarea rows={14} value={editing.body} onChange={e => setEditing({ ...editing, body: e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Ordem</label>
                <input type="number" value={editing.order} onChange={e => setEditing({ ...editing, order: +e.target.value })} className="w-full border border-border px-3 py-2 text-sm bg-transparent" />
              </div>
              <button onClick={save} disabled={saving} className="w-full bg-foreground text-background py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
