import type { Product, ProductVariant } from "@/lib/types";

/** Cores conhecidas → hex sugerido (usado como fallback para produtos antigos). */
const NAMED: Record<string, string> = {
  preto: "#111111",
  branco: "#FFFFFF",
  "off-white": "#F5F1EA",
  offwhite: "#F5F1EA",
  cru: "#EFE7DA",
  bege: "#E4D5C3",
  nude: "#E2C9BA",
  areia: "#DCCDB6",
  caramelo: "#A9703F",
  marrom: "#5B3A29",
  cinza: "#9A9A9A",
  grafite: "#3A3A3A",
  vermelho: "#B3121B",
  vinho: "#5C1A2B",
  rosa: "#FDB9E2",
  "rosa claro": "#FFD9EF",
  pink: "#F58FCA",
  azul: "#1F3A93",
  "azul claro": "#8FB3E0",
  marinho: "#1B2A44",
  verde: "#2F6B4F",
  oliva: "#6B6B3A",
  amarelo: "#E8C33C",
  laranja: "#D4712A",
  dourado: "#C4A24C",
  prata: "#C0C0C0",
  lilas: "#C3A7E0",
  "lilás": "#C3A7E0",
};

export function hexForName(name: string): string {
  return NAMED[name.trim().toLowerCase()] ?? "#CCCCCC";
}

export function normalizeVariants(p: Product): ProductVariant[] {
  const list = (p.variants ?? []).filter(v => v && v.name?.trim());
  if (list.length) return list;
  // Retrocompatibilidade: produtos antigos só tinham nomes de cor + galeria única.
  return (p.colors ?? []).map((c, i) => ({
    id: `legacy-${i}`,
    name: c,
    hex: hexForName(c),
    images: p.images ?? [],
    primaryImage: p.images?.[0],
  }));
}

export function variantGallery(p: Product, variant?: ProductVariant | null): string[] {
  if (!variant) return p.images ?? [];
  const imgs = variant.images?.length ? [...variant.images] : (p.images ?? []);
  const main = variant.primaryImage;
  if (main && imgs.includes(main)) return [main, ...imgs.filter(i => i !== main)];
  return imgs;
}

/** Imagem de capa do produto (primeira variação com imagem, senão a galeria base). */
export function coverImages(p: Product): string[] {
  const base = p.images ?? [];
  if (base.length) return base;
  const v = (p.variants ?? []).find(v => v.images?.length);
  return v ? variantGallery(p, v) : [];
}
