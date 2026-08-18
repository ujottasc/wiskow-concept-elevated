import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/cupons")({
  component: CuponsAdmin,
});

function CuponsAdmin() {
  const { coupons, addCoupon, updateCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    await addCoupon({ id: "novo", code: value, discount: Math.max(1, Math.min(100, discount)), active: true });
    setCode("");
  };

  return (
    <div>
      <PageHeader title="Cupons" subtitle="Promoções" />
      <div className="max-w-2xl bg-card border border-border p-6">
        <form onSubmit={create} className="grid grid-cols-[minmax(0,1fr)_5.5rem] sm:flex gap-2 mb-6">
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="CÓDIGO" className="min-w-0 sm:flex-1 border border-border px-3 py-2 text-sm bg-transparent uppercase" />
          <input type="number" min={1} max={100} value={discount} onChange={e => setDiscount(+e.target.value)} className="w-full sm:w-24 border border-border px-3 py-2 text-sm bg-transparent" />
          <button className="col-span-2 sm:col-auto bg-foreground text-background px-5 min-h-11 text-xs uppercase tracking-[0.22em] inline-flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Criar</button>
        </form>
        <ul className="divide-y divide-border">
          {coupons.map(c => (
            <li key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono">{c.code}</p>
                <p className="text-xs text-muted-foreground">{c.discount}% de desconto</p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <input type="checkbox" checked={c.active} onChange={e => void updateCoupon({ ...c, active: e.target.checked })} />
                  {c.active ? "Ativo" : "Inativo"}
                </label>
                <button aria-label="Remover" className="inline-flex h-11 w-11 items-center justify-center" onClick={() => { if (confirm(`Remover ${c.code}?`)) void removeCoupon(c.id); }}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
              </div>
            </li>
          ))}
        </ul>
        {coupons.length === 0 && <p className="text-sm text-muted-foreground">Nenhum cupom criado.</p>}
      </div>
    </div>
  );
}
