import { X, Plus, Minus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, formatPrice } from "@/lib/store";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, products, updateCartQty, removeFromCart, settings } = useStore();

  const items = cart.map((c, i) => ({ ...c, product: products.find(p => p.id === c.productId), idx: i })).filter(x => x.product);
  const subtotal = items.reduce((s, i) => s + (i.product!.price * i.quantity), 0);
  const shipping = subtotal > 0 ? 39 : 0;

  const checkout = () => {
    const lines = items.map(i => `• ${i.product!.name} (${i.size}, ${i.color}) × ${i.quantity} — ${formatPrice(i.product!.price * i.quantity)}`).join("%0A");
    const msg = `Olá Wiskow Concept! Gostaria de finalizar meu pedido:%0A%0A${lines}%0A%0ASubtotal: ${formatPrice(subtotal)}%0AFrete: ${formatPrice(shipping)}%0ATotal: ${formatPrice(subtotal + shipping)}`;
    window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50" onClick={() => setCartOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <p className="eyebrow text-muted-foreground">Sacola</p>
                <h3 className="font-serif text-xl mt-1">Seus itens</h3>
              </div>
              <button onClick={() => setCartOpen(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-muted-foreground">Sua sacola está vazia.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map(item => (
                    <li key={item.idx} className="p-6 flex gap-4">
                      <img src={item.product!.images[0]} alt="" className="w-24 h-32 object-cover" />
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-medium">{item.product!.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{item.size} · {item.color}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.idx)} aria-label="Remover">
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button className="p-1.5" onClick={() => updateCartQty(item.idx, item.quantity - 1)}><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button className="p-1.5" onClick={() => updateCartQty(item.idx, item.quantity + 1)}><Plus className="h-3 w-3" /></button>
                          </div>
                          <p className="text-sm">{formatPrice(item.product!.price * item.quantity)}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Frete estimado</span><span>{formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-serif text-lg pt-3 border-t border-border"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div>
                <button onClick={checkout} className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors">
                  Finalizar pelo WhatsApp
                </button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em]">Demonstração — pedido segue pelo WhatsApp</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
