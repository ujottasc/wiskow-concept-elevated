import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/pedidos")({
  component: PedidosAdmin,
});

const STATUSES: OrderStatus[] = ["Pendente", "Pago", "Enviado", "Entregue", "Cancelado"];

function PedidosAdmin() {
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState<"Todos" | OrderStatus>("Todos");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);

  const list = useMemo(() => orders.filter(o =>
    (filter === "Todos" || o.status === filter) &&
    (!query.trim() || o.customer.toLowerCase().includes(query.toLowerCase()) || o.id.includes(query.toLowerCase()))
  ), [orders, filter, query]);

  return (
    <div>
      <PageHeader title="Pedidos" subtitle="Vendas" />

      <div className="flex flex-wrap gap-2 mb-6 items-center">
        {(["Todos", ...STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-[10px] uppercase tracking-[0.2em] border ${filter === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"}`}>
            {s}
          </button>
        ))}
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar cliente" className="ml-auto border border-border px-3 py-2 text-sm bg-transparent" />
      </div>

      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left">
              <th className="p-4 eyebrow text-muted-foreground">Pedido</th>
              <th className="p-4 eyebrow text-muted-foreground">Cliente</th>
              <th className="p-4 eyebrow text-muted-foreground hidden md:table-cell">Data</th>
              <th className="p-4 eyebrow text-muted-foreground">Status</th>
              <th className="p-4 eyebrow text-muted-foreground text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map(o => (
              <tr key={o.id} className="hover:bg-secondary/40 cursor-pointer" onClick={() => setDetail(o)}>
                <td className="p-4 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{o.date}</td>
                <td className="p-4" onClick={e => e.stopPropagation()}>
                  <select value={o.status} onChange={e => void updateOrderStatus(o.id, e.target.value as OrderStatus)}
                    className="border border-border bg-transparent px-2 py-1 text-[10px] uppercase tracking-[0.2em]">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhum pedido encontrado.</p>}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end" onClick={() => setDetail(null)}>
          <div className="w-full max-w-lg bg-background h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-2xl">Pedido #{detail.id.slice(0, 8).toUpperCase()}</h2>
              <button onClick={() => setDetail(null)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-6 text-sm">
              <div>
                <p className="eyebrow text-muted-foreground">Cliente</p>
                <p className="mt-1">{detail.customer}</p>
                <p className="text-muted-foreground text-xs">{detail.email}</p>
                <p className="text-muted-foreground text-xs">{detail.phone}</p>
                {detail.phone && (
                  <a href={`https://wa.me/${detail.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 border border-border px-4 py-2 text-[10px] uppercase tracking-[0.2em]">
                    <MessageCircle className="h-3.5 w-3.5" /> Falar no WhatsApp
                  </a>
                )}
              </div>
              <div>
                <p className="eyebrow text-muted-foreground mb-2">Itens</p>
                <ul className="divide-y divide-border">
                  {(detail.lines ?? []).map((l, i) => (
                    <li key={i} className="py-2 flex justify-between gap-4">
                      <span>{l.quantity}× {l.name}<span className="text-muted-foreground text-xs"> {l.size} {l.color}</span></span>
                      <span>{formatPrice(l.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border pt-4 space-y-1">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(detail.subtotal ?? 0)}</span></div>
                {!!detail.discount && <div className="flex justify-between text-muted-foreground"><span>Desconto {detail.couponCode ? `(${detail.couponCode})` : ""}</span><span>-{formatPrice(detail.discount)}</span></div>}
                <div className="flex justify-between font-serif text-xl"><span>Total</span><span>{formatPrice(detail.total)}</span></div>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground mb-2">Status</p>
                <select value={detail.status}
                  onChange={async e => { const s = e.target.value as OrderStatus; await updateOrderStatus(detail.id, s); setDetail({ ...detail, status: s }); }}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
