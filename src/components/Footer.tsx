import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { useStore } from "@/lib/store";

export function Footer() {
  const { settings } = useStore();
  return (
    <footer className="border-t border-border mt-24 bg-background">
      <div className="container-x py-16 grid gap-12 md:grid-cols-4">
        <div>
          <h4 className="font-serif text-2xl tracking-[0.15em]">WISKOW</h4>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Moda feminina contemporânea. Peças atemporais para mulheres que desenham a própria narrativa.
          </p>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Navegue</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/nova-colecao" className="link-underline">Nova Coleção</Link></li>
            <li><Link to="/colecoes" className="link-underline">Coleções</Link></li>
            <li><Link to="/catalogo" className="link-underline">Catálogo</Link></li>
            <li><Link to="/sobre" className="link-underline">Sobre</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Atendimento</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link to="/contato" className="link-underline">Contato</Link></li>
            <li><a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="link-underline">WhatsApp</a></li>
            <li>Segunda a Sexta, 10h — 19h</li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-muted-foreground">Siga-nos</p>
          <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm link-underline">
            <Instagram className="h-4 w-4" /> @{settings.instagram}
          </a>
          <p className="mt-6 text-xs text-muted-foreground">
            Assine a newsletter e receba primeiro cada lançamento.
          </p>
          <form onSubmit={e => e.preventDefault()} className="mt-3 flex border-b border-border">
            <input type="email" placeholder="Seu e-mail" className="bg-transparent flex-1 py-2 text-sm outline-none" />
            <button className="text-[10px] uppercase tracking-[0.22em]">Enviar</button>
          </form>
        </div>
      </div>
      <div className="container-x border-t border-border py-6 flex flex-col md:flex-row justify-between text-xs text-muted-foreground gap-2">
        <p>© {new Date().getFullYear()} Wiskow Concept. Todos os direitos reservados.</p>
        <p>Desenvolvido com cuidado.</p>
      </div>
    </footer>
  );
}
