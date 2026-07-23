import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, MessageCircle, MapPin, Mail } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Wiskow Concept" },
      { name: "description", content: "Fale com a Wiskow Concept." },
      { property: "og:title", content: "Contato — Wiskow Concept" },
      { property: "og:description", content: "Estamos por aqui." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { settings } = useStore();
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <section className="container-x pt-20 pb-16 text-center">
        <p className="eyebrow text-muted-foreground">Fale com a gente</p>
        <h1 className="font-serif text-5xl md:text-7xl mt-4">Contato</h1>
      </section>

      <section className="container-x pb-24 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Canais diretos</h2>
          <div className="mt-8 space-y-6">
            <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
              <MessageCircle className="h-5 w-5 mt-1" />
              <div>
                <p className="text-sm font-medium link-underline">WhatsApp</p>
                <p className="text-xs text-muted-foreground mt-1">+55 51 99759-3705</p>
              </div>
            </a>
            <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="flex items-start gap-4">
              <Instagram className="h-5 w-5 mt-1" />
              <div>
                <p className="text-sm font-medium link-underline">Instagram</p>
                <p className="text-xs text-muted-foreground mt-1">@{settings.instagram}</p>
              </div>
            </a>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 mt-1" />
              <div>
                <p className="text-sm font-medium">contato@wiskow.com</p>
                <p className="text-xs text-muted-foreground mt-1">Respondemos em até 24h.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-1" />
              <div>
                <p className="text-sm font-medium">Atendimento sob agendamento</p>
                <p className="text-xs text-muted-foreground mt-1">Porto Alegre — RS</p>
              </div>
            </div>
          </div>

          <div className="mt-10 aspect-[16/9] overflow-hidden bg-secondary/40 border border-border flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-6 w-6 mx-auto" />
              <p className="mt-2 text-xs uppercase tracking-[0.22em]">Mapa · placeholder</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl">Envie uma mensagem</h2>
          <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-6">
            {["Nome", "E-mail", "Telefone"].map(f => (
              <div key={f}>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{f}</label>
                <input type={f === "E-mail" ? "email" : "text"} required className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Mensagem</label>
              <textarea rows={4} required className="w-full bg-transparent border-b border-border py-2 text-sm outline-none focus:border-foreground transition-colors resize-none" />
            </div>
            <button className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-[0.25em] hover:bg-accent transition-colors">
              {sent ? "Enviado — obrigada!" : "Enviar mensagem"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
