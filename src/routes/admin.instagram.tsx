import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";
import { instagramFeed } from "@/lib/brand-images";
import { Instagram as IG } from "lucide-react";

export const Route = createFileRoute("/admin/instagram")({
  component: InstagramAdmin,
});

const FEED = instagramFeed;


function InstagramAdmin() {
  const { settings } = useStore();
  return (
    <div>
      <PageHeader title="Instagram" subtitle="Feed" />
      <div className="bg-card border border-border p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <IG className="h-5 w-5" />
          <div>
            <p className="font-serif text-xl">@{settings.instagram}</p>
            <p className="text-xs text-muted-foreground">Conectado</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FEED.map(src => (
            <div key={src} className="aspect-square overflow-hidden">
              <img src={src} alt="Publicação Wiskow Concept" className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
