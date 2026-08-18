import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientesAdmin,
});

function ClientesAdmin() {
  const { customers } = useStore();
  const [query, setQuery] = useState("");

  const list = useMemo(() => customers.filter(c =>
    !query.trim() || c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  ), [customers, query]);

  return (
    <div>
      <PageHeader title="Clientes" subtitle="Base" action={
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar cliente" className="border border-border px-3 py-2 text-sm bg-transparent" />
      } />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map(c => (
          <div key={c.id} className="bg-card border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-serif text-lg">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium truncate">{c.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{c.email}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm border-t border-border pt-4">
              <div><p className="text-xs text-muted-foreground">Pedidos</p><p>{c.orders}</p></div>
              <div><p className="text-xs text-muted-foreground">Gasto</p><p>{formatPrice(c.spent)}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`mailto:${c.email}`} className="flex-1 border border-border py-2 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-1"><Mail className="h-3 w-3" /> E-mail</a>
              {c.phone && (
                <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                  className="flex-1 border border-border py-2 text-[10px] uppercase tracking-[0.22em] inline-flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" /> WhatsApp</a>
              )}
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="text-sm text-muted-foreground">Nenhum cliente encontrado.</p>}
    </div>
  );
}
