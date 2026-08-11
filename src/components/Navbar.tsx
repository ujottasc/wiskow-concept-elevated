import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";

import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { to: "/nova-colecao", label: "Nova Coleção" },
  { to: "/colecoes", label: "Coleções" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function Navbar({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { favorites, cart, setCartOpen, user, logout } = useStore();
  const pathname = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isTransparent = transparentOnTop && !scrolled;
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent text-white"
            : "bg-background/85 backdrop-blur-md border-b border-border text-foreground"
        }`}
      >
        <div className="container-x flex items-center justify-between h-16 md:h-20">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className="text-[11px] uppercase tracking-[0.22em] link-underline">
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to="/" aria-label="Wiskow Concept" className="absolute left-1/2 -translate-x-1/2">
            <Logo light={isTransparent} className="h-9 md:h-11" />
          </Link>

          <div className="flex items-center gap-4 md:gap-5 flex-1 justify-end">
            <Link to="/catalogo" aria-label="Buscar" className="hidden md:inline-flex">
              <Search className="h-4 w-4" />
            </Link>
            {user?.role === "ADMIN" && (
              <Link to="/admin" className="hidden md:inline text-[10px] uppercase tracking-[0.22em] link-underline">
                Admin
              </Link>
            )}
            <Link to="/favoritos" aria-label="Favoritos" className="relative">
              <Heart className="h-4 w-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <button aria-label="Carrinho" className="relative" onClick={() => setCartOpen(true)}>
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[9px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <button aria-label="Sair" onClick={() => { void logout(); }} className="hidden md:inline">
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background text-foreground"
          >
            <div className="container-x flex items-center justify-between h-16">
              <Logo className="h-8" />
              <button onClick={() => setOpen(false)} aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            <div className="container-x mt-12 flex flex-col gap-6">
              {NAV.map(n => (
                <Link key={n.to} to={n.to} className="text-2xl font-serif">{n.label}</Link>
              ))}
              {user?.role === "ADMIN" && <Link to="/admin" className="text-2xl font-serif">Admin</Link>}
              {user
                ? <button onClick={() => { void logout(); }} className="text-left text-2xl font-serif text-muted-foreground">Sair</button>
                : <Link to="/login" className="text-2xl font-serif text-muted-foreground">Entrar</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
