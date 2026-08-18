import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram as IG } from "lucide-react";
import { PageHeader } from "@/components/AdminLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { useStore } from "@/lib/store";
import { instagramFeed } from "@/lib/brand-images";

export const Route = createFileRoute("/admin/instagram")({
  component: InstagramAdmin,
});

function InstagramAdmin() {
  const { settings, updateSettings, saveSettingsNow } = useStore();
  const [saving, setSaving] = useState(false);
  const feed = settings.instagramFeed.length ? settings.instagramFeed : [];

  return (
    <div>
      <PageHeader title="Instagram" subtitle="Feed" />
      <div className="bg-card border border-border p-6 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <IG className="h-5 w-5" />
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">Usuário</label>
            <input value={settings.instagram} onChange={e => updateSettings({ instagram: e.target.value.replace("@", "") })}
              className="w-full max-w-xs border border-border px-3 py-2 text-sm bg-transparent" />
          </div>
        </div>

        <ImageUploader
          label="Publicações do feed"
          multiple
          folder="instagram"
          value={feed}
          onChange={urls => updateSettings({ instagramFeed: urls })}
        />

        <div className="flex flex-wrap gap-3">
          <button onClick={async () => { setSaving(true); await saveSettingsNow(); setSaving(false); }}
            className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50" disabled={saving}>
            {saving ? "Salvando..." : "Salvar feed"}
          </button>
          {feed.length === 0 && (
            <button onClick={() => updateSettings({ instagramFeed: instagramFeed.slice(0, 12) })}
              className="border border-border px-6 py-3 text-xs uppercase tracking-[0.22em]">
              Usar imagens da marca
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
