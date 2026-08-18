import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Minus, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { coverImages } from "@/lib/product-variants";
import { useStore, formatPrice } from "@/lib/store";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Sacola — Wiskow Concept" },
      { name: "description", content: "Sua sacola Wiskow Concept." },
      { property: "og:title", content: "Sacola — Wiskow Concept" },
      { property: "og:description", content: "Revise seus itens." },
    ],
  }),
  component: Carrinho,
});

function Carrinho() {
  const { cart, products, updateCartQty, removeFromCart, settings } = useStore();
  const items = cart.map((c, i) => ({ ...c, product: products.find(p => p.id === c.productId), idx: i })).filter(x => x.product);
  const subtotal = items.reduce((s, i) => s + i.product!.price * i.quantity, 0);
  const shipping = subtotal > 0 ? 39 : 0;

  const checkout = () => {
    const lines = items.map(i => `• ${i.product!.name} (${i.size}, ${i.color}) × ${i.quantity} — ${formatPrice(i.product!.price * i.quantity)}`).join("%0A");
    const msg = `Olá! Gostaria de finalizar meu pedido:%0A%0A${lines}%0A%0ATotal: ${formatPrice(subtotal + shipping)}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <SiteLayout>
      <section className="container-x py-16">
        <p className="eyebrow text-muted-foreground">Checkout</p>
        <h1 className="font-serif text-5xl md:text-6xl mt-4">Sua sacola</h1>

        {items.length === 0 ? (
          <div className="mt-16 text-center py-24 border-t border-border">
            <p className="text-muted-foreground">Nenhum item na sacola.</p>
            <Link to="/catalogo" className="mt-6 inline-block border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors">
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border border-t border-b border-border">
              {items.map(item => (
                <li key={item.idx} className="py-6 flex gap-6">
                  <img src={coverImages(item.product!)[0]} alt="" className="w-32 h-40 object-cover" />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-serif text-xl">{item.product!.name}</h3>
                        <p className="text-xs text-muted-foreground mt-2">Tamanho {item.size} · {item.color}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.idx)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button className="p-2" onClick={() => updateCartQty(item.idx, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                        <span className="w-10 text-center text-sm">{item.quantity}</span>
                        <button className="p-2" onClick={() => updateCartQty(item.idx, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                      </div>
                      <p>{formatPrice(item.product!.price * item.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="bg-secondary/40 p-8 h-fit sticky top-24">
              <h3 className="font-serif text-2xl">Resumo</h3>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frete estimado</span><span>{formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-serif text-xl pt-3 border-t border-border"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
              </div>
              <button onClick={checkout} className="mt-6 w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors">
                Finalizar pelo WhatsApp
              </button>
              <p className="mt-3 text-[10px] text-center text-muted-foreground uppercase tracking-[0.22em]">Demonstração</p>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
