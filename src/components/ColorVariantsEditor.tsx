import { useState } from "react";
import { Plus, Trash2, Star, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ImageUploader";
import { hexForName } from "@/lib/product-variants";
import type { ProductVariant } from "@/lib/types";

interface Props {
  value: ProductVariant[];
  onChange: (v: ProductVariant[]) => void;
}

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random()}`;

export function ColorVariantsEditor({ value, onChange }: Props) {
  const [open, setOpen] = useState<string | null>(value[0]?.id ?? null);

  const patch = (id: string, data: Partial<ProductVariant>) =>
    onChange(value.map(v => (v.id === id ? { ...v, ...data } : v)));

  const add = () => {
    const v: ProductVariant = { id: newId(), name: "", hex: "#111111", images: [] };
    onChange([...value, v]);
    setOpen(v.id);
  };

  const remove = (v: ProductVariant) => {
    if (!confirm(`Remover a cor "${v.name || "sem nome"}" e suas imagens?`)) return;
    onChange(value.filter(x => x.id !== v.id));
  };

  const renameVariant = (v: ProductVariant, name: string) => {
    const dup = value.some(x => x.id !== v.id && x.name.trim().toLowerCase() === name.trim().toLowerCase() && name.trim());
    if (dup) toast.error("Já existe uma cor com esse nome neste produto.");
    const auto = hexForName(name);
    patch(v.id, { name, ...(auto !== "#CCCCCC" && !v.touchedHex ? { hex: auto } : {}) } as Partial<ProductVariant>);
  };

  return (
    <div className="border border-border p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Cores e variações</p>
          <p className="text-xs text-muted-foreground mt-1">Cada cor tem suas próprias fotos. Opcional.</p>
        </div>
        <button
          type="button"
          onClick={add}
          className="shrink-0 inline-flex items-center gap-2 border border-foreground px-3 min-h-11 text-[10px] uppercase tracking-[0.22em]"
        >
          <Plus className="h-4 w-4" /> Adicionar cor
        </button>
      </div>

      {value.length === 0 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Nenhuma cor cadastrada — o produto usará apenas a galeria principal.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {value.map(v => {
          const isOpen = open === v.id;
          const imgs = v.images ?? [];
          const main = v.primaryImage && imgs.includes(v.primaryImage) ? v.primaryImage : imgs[0];
          return (
            <div key={v.id} className="border border-border bg-card">
              <div className="flex items-center gap-3 p-3">
                <span
                  className="h-7 w-7 shrink-0 rounded-full border border-border"
                  style={{ backgroundColor: v.hex }}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : v.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <span className="block text-sm truncate">{v.name || "Nova cor"}</span>
                  <span className="block text-xs text-muted-foreground">{imgs.length} imagem(ns)</span>
                </button>
                <button type="button" onClick={() => setOpen(isOpen ? null : v.id)} aria-label={isOpen ? "Recolher" : "Expandir"} className="w-11 h-11 flex items-center justify-center border border-border">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <button type="button" onClick={() => remove(v)} aria-label="Remover cor" className="w-11 h-11 flex items-center justify-center border border-border">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {isOpen && (
                <div className="border-t border-border p-3 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_9rem] gap-3 sm:items-end">
                    <label className="block">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Nome da cor</span>
                      <input
                        value={v.name}
                        onChange={e => renameVariant(v, e.target.value)}
                        placeholder="Ex.: Preto"
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Cor</span>
                      <input
                        type="color"
                        value={/^#[0-9a-fA-F]{6}$/.test(v.hex) ? v.hex : "#111111"}
                        onChange={e => patch(v.id, { hex: e.target.value, touchedHex: true } as Partial<ProductVariant>)}
                        className="h-11 w-full sm:w-14 border border-border bg-transparent p-1"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Hex</span>
                      <input
                        value={v.hex}
                        onChange={e => patch(v.id, { hex: e.target.value, touchedHex: true } as Partial<ProductVariant>)}
                        className="w-full border border-border bg-transparent px-3 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <ImageUploader
                    label={`Imagens da cor ${v.name || "(sem nome)"}`}
                    multiple
                    folder="produtos"
                    value={imgs}
                    onChange={images =>
                      patch(v.id, {
                        images,
                        primaryImage: images.includes(v.primaryImage ?? "") ? v.primaryImage : images[0],
                      })
                    }
                  />

                  {imgs.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">Imagem principal</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {imgs.map(url => (
                          <button
                            key={url}
                            type="button"
                            onClick={() => patch(v.id, { primaryImage: url })}
                            className={`relative aspect-[3/4] overflow-hidden border ${main === url ? "border-foreground" : "border-border"}`}
                          >
                            <img src={url} alt="" className="h-full w-full object-cover" />
                            {main === url && (
                              <span className="absolute top-1 left-1 bg-background/90 border border-border p-1">
                                <Star className="h-3 w-3 fill-foreground" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
