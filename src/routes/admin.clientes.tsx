import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientesAdmin,
});

function ClientesAdmin() {
  const { customers } = useStore();
  return (
    <div>
      <PageHeader title="Clientes" subtitle="Base" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map(c => (
          <div key={c.id} className="bg-card border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-serif text-lg">
                {c.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-sm border-t border-border pt-4">
              <div><p className="text-xs text-muted-foreground">Pedidos</p><p>{c.orders}</p></div>
              <div><p className="text-xs text-muted-foreground">Gasto</p><p>{formatPrice(c.spent)}</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
