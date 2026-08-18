import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AdminLayout";
import { ImageUploader } from "@/components/ImageUploader";
import { useStore } from "@/lib/store";
import type { Settings } from "@/lib/types";

export const Route = createFileRoute("/admin/configuracoes")({
  component: ConfigAdmin,
});

const FIELDS: [string, keyof Settings][] = [
  ["Nome da loja", "storeName"],
  ["WhatsApp (só números)", "whatsapp"],
  ["Instagram (username)", "instagram"],
];

function ConfigAdmin() {
  const { settings, updateSettings, saveSettingsNow } = useStore();
  const [saving, setSaving] = useState(false);

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Loja" />
      <div className="max-w-2xl bg-card border border-border p-6 space-y-5">
        {FIELDS.map(([label, key]) => (
          <div key={key}>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>
            <input
              value={String(settings[key] ?? "")}
              onChange={e => updateSettings({ [key]: e.target.value } as Partial<Settings>)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
        ))}

        <ImageUploader
          label="Logo personalizada (opcional)"
          folder="marca"
          value={settings.logo ? [settings.logo] : []}
          onChange={urls => updateSettings({ logo: urls[0] ?? "" })}
        />

        <div>
          <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Cor de destaque</label>
          <div className="flex items-center gap-3">
            <input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })} className="h-10 w-16 bg-transparent border border-border" />
            <span className="text-sm font-mono">{settings.primaryColor}</span>
          </div>
        </div>

        <button onClick={async () => { setSaving(true); await saveSettingsNow(); setSaving(false); }} disabled={saving}
          className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[0.22em] disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar configurações"}
        </button>
        <p className="text-xs text-muted-foreground">As alterações também salvam automaticamente.</p>
      </div>
    </div>
  );
}
