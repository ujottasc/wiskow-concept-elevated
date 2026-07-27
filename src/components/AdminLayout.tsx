import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Layers, Tag, ShoppingCart, Users,
  Ticket, Image, Home, FileText, Instagram, Settings, User, LogOut,
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

export function AdminLayout() {
  const { user, logout } = useStore();
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 shrink-0 border-r border-border bg-background sticky top-0 h-screen overflow-y-auto hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" aria-label="Wiskow Concept"><Logo className="h-12" /></Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {MENU.map(m => {
            const active = m.exact ? pathname === m.to : pathname.startsWith(m.to);
            const Icon = m.icon;
            return (
              <Link key={m.to} to={m.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />
                {m.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="text-xs">
            <p className="text-muted-foreground">Conectada como</p>
            <p className="mt-1 truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="mt-3 w-full inline-flex items-center justify-center gap-2 border border-border py-2 text-xs uppercase tracking-[0.22em] hover:bg-secondary">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur px-4 py-3 flex items-center justify-between">
          <Link to="/" aria-label="Wiskow Concept" className="inline-flex items-center gap-2">
            <Logo variant="mark" className="h-7" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Admin</span>
          </Link>
          <button onClick={logout} className="text-xs uppercase tracking-[0.22em]">Sair</button>
        </header>
        <main className="p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
      <div>
        <p className="eyebrow text-muted-foreground">{subtitle ?? "Admin"}</p>
        <h1 className="font-serif text-4xl md:text-5xl mt-2">{title}</h1>
      </div>
      {action}
    </div>
  );
}
