import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AdminLayout";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/configuracoes")({
  component: ConfigAdmin,
});

function ConfigAdmin() {
  const { settings, updateSettings } = useStore();
  return (
    <div>
      <PageHeader title="Configurações" subtitle="Loja" />
      <div className="max-w-2xl bg-card border border-border p-6 space-y-5">
        {[
          ["Nome da loja", "storeName"],
          ["WhatsApp (só números)", "whatsapp"],
          ["Instagram (username)", "instagram"],
          ["Logo (URL)", "logo"],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{label}</label>
            <input
              value={(settings as any)[key] ?? ""}
              onChange={e => updateSettings({ [key]: e.target.value } as any)}
              className="w-full border border-border px-3 py-2 text-sm bg-transparent"
            />
          </div>
        ))}
        <div>
          <label className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Cor de destaque</label>
          <div className="flex items-center gap-3">
            <input type="color" value={settings.primaryColor} onChange={e => updateSettings({ primaryColor: e.target.value })} className="h-10 w-16 bg-transparent border border-border" />
            <span className="text-sm font-mono">{settings.primaryColor}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Alterações salvam automaticamente.</p>
      </div>
    </div>
  );
}
