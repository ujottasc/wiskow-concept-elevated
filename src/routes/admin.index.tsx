import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { orders, customers, products, collections } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Receita", value: formatPrice(revenue), delta: "+18%", icon: TrendingUp },
    { label: "Pedidos", value: orders.length, delta: "+6", icon: ShoppingCart },
    { label: "Clientes", value: customers.length, delta: "+3", icon: Users },
    { label: "Produtos", value: products.length, delta: `${collections.length} coleções`, icon: Package },
  ];

  return (
    <div>
      <PageHeader title="Bem-vinda" subtitle="Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="p-6 bg-card border border-border">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-muted-foreground">{s.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-4 font-serif text-3xl">{s.value}</p>
              <p className="mt-2 text-xs text-petal inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> {s.delta}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-card border border-border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Pedidos recentes</h2>
            <a href="/admin/pedidos" className="text-xs link-underline">Ver todos</a>
          </div>
          <div className="mt-6 divide-y divide-border">
            {orders.map(o => (
              <div key={o.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{o.customer}</p>
                  <p className="text-xs text-muted-foreground">{o.date} · {o.items} item(s)</p>
                </div>
                <div className="text-right">
                  <p>{formatPrice(o.total)}</p>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border p-6">
          <h2 className="font-serif text-2xl">Mais vendidos</h2>
          <div className="mt-6 space-y-4">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.images[0]} alt="" className="w-12 h-14 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(p.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
