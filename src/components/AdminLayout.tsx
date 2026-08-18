import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, Layers, Tag, ShoppingCart, Users,
  Ticket, Image, Home, FileText, Instagram, Settings, User, LogOut, Menu, X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/Logo";


type MenuItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const MENU: MenuItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Catálogo", icon: Package },
  { to: "/admin/colecoes", label: "Coleções", icon: Layers },
  { to: "/admin/categorias", label: "Categorias", icon: Tag },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/cupons", label: "Cupons", icon: Ticket },
  { to: "/admin/banners", label: "Banners", icon: Image },
  { to: "/admin/pagina-inicial", label: "Página Inicial", icon: Home },
  { to: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { to: "/admin/instagram", label: "Instagram", icon: Instagram },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { to: "/admin/perfil", label: "Perfil", icon: User },
];

function SidebarContent({ pathname, onNavigate, email, logout }: {
  pathname: string; onNavigate?: () => void; email?: string; logout: () => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-border flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link to="/" aria-label="Wiskow Concept" onClick={onNavigate}><Logo className="h-12" /></Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admin</p>
        </div>
        {onNavigate && (
          <button onClick={onNavigate} aria-label="Fechar menu" className="shrink-0 p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {MENU.map(m => {
          const active = m.exact ? pathname === m.to : pathname.startsWith(m.to);
          const Icon = m.icon;
          return (
            <Link key={m.to} to={m.to} onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{m.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs">
          <p className="text-muted-foreground">Conectada como</p>
          <p className="mt-1 truncate">{email}</p>
        </div>
        <button onClick={logout} className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-border py-2 text-xs uppercase tracking-[0.22em] hover:bg-secondary">
          <LogOut className="h-3 w-3" /> Sair
        </button>
      </div>
    </>
  );
}

export function AdminLayout() {
  const { user, logout } = useStore();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 shrink-0 border-r border-border bg-background sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
        <SidebarContent pathname={pathname} email={user?.email} logout={logout} />
      </aside>

      {/* Mobile / tablet drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Fechar menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] bg-background border-r border-border flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
            <SidebarContent pathname={pathname} email={user?.email} logout={logout} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur px-4 py-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <button onClick={() => setOpen(true)} aria-label="Abrir menu" aria-expanded={open}
            className="shrink-0 inline-flex items-center justify-center border border-border h-9 w-9">
            <Menu className="h-4 w-4" />
          </button>
          <Link to="/" aria-label="Wiskow Concept" className="inline-flex min-w-0 items-center gap-2">
            <Logo variant="mark" className="h-7 shrink-0" />
            <span className="truncate text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admin</span>
          </Link>
          <button onClick={logout} className="shrink-0 text-xs uppercase tracking-[0.22em]">Sair</button>
        </header>
        <main className="p-4 sm:p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="eyebrow text-muted-foreground">{subtitle ?? "Admin"}</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl mt-2 break-words">{title}</h1>
      </div>
      {action && (
        <div className="w-full sm:w-auto sm:shrink-0 [&>button]:w-full [&>input]:w-full sm:[&>button]:w-auto sm:[&>input]:w-auto [&>button]:justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

/** Painel lateral responsivo usado nas telas do admin. */
export function AdminDrawer({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} bg-background h-full overflow-y-auto overscroll-contain flex flex-col`}>
        <div className="sticky top-0 z-10 bg-background flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-border">
          <h2 className="font-serif text-xl sm:text-2xl truncate">{title}</h2>
          <button onClick={onClose} aria-label="Fechar" className="shrink-0 inline-flex h-11 w-11 items-center justify-center -mr-2">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6 space-y-5 pb-24">{children}</div>
      </div>
    </div>
  );
}
