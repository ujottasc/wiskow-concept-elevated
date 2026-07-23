import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/admin/pedidos")({
  component: PedidosAdmin,
});

function PedidosAdmin() {
  const { orders } = useStore();
  return (
    <div>
      <PageHeader title="Pedidos" subtitle="Vendas" />
      <div className="bg-card border border-border overflow-hidden">
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
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-secondary/40">
                <td className="p-4 font-mono text-xs">#{o.id.toUpperCase()}</td>
                <td className="p-4">{o.customer}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{o.date}</td>
                <td className="p-4"><span className="text-[10px] uppercase tracking-[0.2em] border border-border px-2 py-1">{o.status}</span></td>
                <td className="p-4 text-right">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
