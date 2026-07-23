import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";
import { Instagram as IG } from "lucide-react";

export const Route = createFileRoute("/admin/instagram")({
  component: InstagramAdmin,
});

const FEED = [
  "photo-1490481651871-ab68de25d43d",
  "photo-1483985988355-763728e1935b",
  "photo-1469334031218-e382a71b716b",
  "photo-1441986300917-64674bd600d8",
  "photo-1583744946564-b52ac1c389c8",
  "photo-1595777457583-95e059d581b8",
  "photo-1594633312681-425c7b97ccd1",
  "photo-1485462537746-965f33f7f6a7",
];

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
          {FEED.map(id => (
            <div key={id} className="aspect-square overflow-hidden">
              <img src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
