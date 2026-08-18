import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type {
  Product, Collection, Category, Banner, CartItem, Coupon, Order, Customer, Settings, User, SiteContent,
} from "./types";

const isBrowser = typeof window !== "undefined";
const readLS = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};
const writeLS = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

export const defaultSettings: Settings = {
  storeName: "Wiskow Concept",
  whatsapp: "5551997593705",
  instagram: "wiskow.concept",
  logo: "",
  primaryColor: "#fdb9e2",
  instagramFeed: [],
  featuredCollectionIds: [],
  featuredProductIds: [],
};

type DbRow = Record<string, unknown>;

const toProduct = (r: DbRow): Product => ({
  id: r["id"] as string,
  slug: (r["slug"] as string) ?? "",
  name: r["name"] as string,
  price: Number(r["price"] ?? 0),
  category: (r["category_id"] as string) ?? "",
  collectionId: (r["collection_id"] as string) ?? undefined,
  description: (r["description"] as string) ?? "",
  images: (r["images"] as string[]) ?? [],
  sizes: (r["sizes"] as string[]) ?? [],
  colors: (r["colors"] as string[]) ?? [],
  variants: Array.isArray(r["variants"]) ? (r["variants"] as Product["variants"]) : [],
  featured: Boolean(r["featured"]),
  isNew: Boolean(r["is_new"]),
  stock: Number(r["stock"] ?? 0),
});

const toBanner = (r: DbRow): Banner => ({
  id: r["id"] as string,
  title: r["title"] as string,
  subtitle: (r["subtitle"] as string) ?? "",
  image: (r["image"] as string) ?? "",
  cta: (r["cta"] as string) ?? "",
  href: (r["href"] as string) ?? "",
  order: Number(r["sort_order"] ?? 0),
});

const toOrder = (r: DbRow): Order => {
  const items = (r["items"] as { name?: string; size?: string; color?: string; quantity?: number; price?: number }[]) ?? [];
  return {
    id: r["id"] as string,
    customer: r["customer_name"] as string,
    phone: (r["customer_phone"] as string) ?? "",
    email: (r["customer_email"] as string) ?? "",
    total: Number(r["total"] ?? 0),
    status: (r["status"] as Order["status"]) ?? "Pendente",
    date: new Date(r["created_at"] as string).toISOString().slice(0, 10),
    items: items.reduce((n, i) => n + (i.quantity ?? 1), 0),
    lines: items.map(i => ({
      name: i.name ?? "Peça",
      size: i.size ?? "",
      color: i.color ?? "",
      quantity: i.quantity ?? 1,
      price: Number(i.price ?? 0),
    })),
    couponCode: (r["coupon_code"] as string) ?? null,
    subtotal: Number(r["subtotal"] ?? 0),
    discount: Number(r["discount"] ?? 0),
    userId: (r["user_id"] as string) ?? null,
  };
};

export interface NewOrderInput {
  name: string;
  phone: string;
  email?: string;
  items: { name: string; size: string; color: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string | null;
}

interface StoreCtx {
  ready: boolean;
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string; needsConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;

  products: Product[];
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;

  collections: Collection[];
  addCollection: (c: Collection) => Promise<void>;
  updateCollection: (c: Collection) => Promise<void>;
  removeCollection: (id: string) => Promise<void>;

  categories: Category[];
  addCategory: (c: Category) => Promise<void>;
  updateCategory: (c: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  banners: Banner[];
  addBanner: (b: Banner) => Promise<void>;
  updateBanner: (b: Banner) => Promise<void>;
  removeBanner: (id: string) => Promise<void>;

  coupons: Coupon[];
  addCoupon: (c: Coupon) => Promise<void>;
  updateCoupon: (c: Coupon) => Promise<void>;
  removeCoupon: (id: string) => Promise<void>;
  findCoupon: (code: string) => Coupon | undefined;

  orders: Order[];
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  createOrder: (input: NewOrderInput) => Promise<{ ok: boolean; error?: string }>;
  customers: Customer[];

  favorites: string[];
  toggleFavorite: (id: string) => Promise<void>;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  content: SiteContent[];
  saveContent: (c: SiteContent) => Promise<void>;
  removeContent: (id: string) => Promise<void>;

  updateProfile: (data: { name: string; phone: string }) => Promise<{ ok: boolean; error?: string }>;

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
  saveSettingsNow: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [content, setContent] = useState<SiteContent[]>([]);
  const [cartHydrated, setCartHydrated] = useState(false);
  const settingsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAdmin = user?.role === "ADMIN";

  // ---------- cart (local) ----------
  useEffect(() => {
    setCart(readLS<CartItem[]>("wk3:cart", []));
    setCartHydrated(true);
  }, []);
  useEffect(() => { if (cartHydrated) writeLS("wk3:cart", cart); }, [cart, cartHydrated]);

  // ---------- catalog ----------
  const loadCatalog = useCallback(async () => {
    const [p, c, cat, b, cp, st, ct] = await Promise.all([
      supabase.from("products").select("*").eq("active", true).order("created_at", { ascending: true }),
      supabase.from("collections").select("*").order("sort_order", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("banners").select("*").eq("active", true).order("sort_order", { ascending: true }),
      supabase.from("coupons").select("*").order("code", { ascending: true }),
      supabase.from("site_settings").select("*").maybeSingle(),
      supabase.from("site_content").select("*").order("sort_order", { ascending: true }),
    ]);
    if (ct.data) setContent(ct.data.map(r => ({ id: r.id, title: r.title, body: r.body, order: r.sort_order })));
    if (p.data) setProducts(p.data.map(toProduct));
    if (c.data) setCollections(c.data.map(r => ({
      id: r.id, name: r.name, description: r.description, image: r.image, featured: r.featured,
    })));
    if (cat.data) setCategories(cat.data.map(r => ({ id: r.id, name: r.name })));
    if (b.data) setBanners(b.data.map(toBanner));
    if (cp.data) setCoupons(cp.data.map(r => ({ id: r.id, code: r.code, discount: r.discount, active: r.active })));
    if (st.data) {
      setSettings({
        storeName: st.data.store_name,
        whatsapp: st.data.whatsapp,
        instagram: st.data.instagram,
        logo: st.data.logo,
        primaryColor: st.data.primary_color,
        instagramFeed: st.data.instagram_feed ?? [],
        heroBannerId: st.data.hero_banner_id ?? undefined,
        featuredCollectionIds: st.data.featured_collection_ids ?? [],
        featuredProductIds: st.data.featured_product_ids ?? [],
      });
    }
  }, []);

  const loadFavorites = useCallback(async (uid: string | null) => {
    if (!uid) { setFavorites([]); return; }
    const { data } = await supabase.from("favorites").select("product_id").eq("user_id", uid);
    setFavorites((data ?? []).map(r => r.product_id));
  }, []);

  const loadAdminData = useCallback(async (admin: boolean) => {
    if (!admin) { setOrders([]); setCustomers([]); return; }
    const [o, pr] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    const mapped = (o.data ?? []).map(toOrder);
    setOrders(mapped);
    setCustomers((pr.data ?? []).map(r => {
      const own = mapped.filter(m => m.userId === r.id);
      return {
        id: r.id,
        name: r.full_name || r.email.split("@")[0],
        email: r.email,
        phone: r.phone ?? "",
        orders: own.length,
        spent: own.reduce((s, x) => s + x.total, 0),
      };
    }));
  }, []);

  const resolveUser = useCallback(async (): Promise<User | null> => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return null;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", authUser.id);
    const admin = (roles ?? []).some(r => r.role === "admin");
    return {
      id: authUser.id,
      email: authUser.email ?? "",
      name: (authUser.user_metadata?.["full_name"] as string) ?? "",
      role: admin ? "ADMIN" : "USER",
    };
  }, []);

  const syncUser = useCallback(async () => {
    const u = await resolveUser();
    setUser(u);
    await Promise.all([loadFavorites(u?.id ?? null), loadAdminData(u?.role === "ADMIN")]);
  }, [resolveUser, loadFavorites, loadAdminData]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await loadCatalog();
      await syncUser();
      if (alive) setReady(true);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void syncUser();
      }
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [loadCatalog, syncUser]);

  const refresh = useCallback(async () => {
    await loadCatalog();
    await loadAdminData(isAdmin);
  }, [loadCatalog, loadAdminData, isAdmin]);

  // ---------- helpers ----------
  const guardAdmin = () => {
    if (!isAdmin) { toast.error("Ação restrita a administradores."); return false; }
    return true;
  };
  const handle = async (error: { message: string } | null, okMsg?: string) => {
    if (error) { toast.error(error.message); return false; }
    if (okMsg) toast.success(okMsg);
    await refresh();
    return true;
  };

  const value: StoreCtx = useMemo(() => ({
    ready,
    user,
    isAdmin,

    login: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) return { ok: false, error: error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message };
      await syncUser();
      return { ok: true };
    },
    signup: async (name, email, password) => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: isBrowser ? window.location.origin : undefined,
          data: { full_name: name },
        },
      });
      if (error) {
        const msg = error.message.includes("already registered")
          ? "Este e-mail já está cadastrado."
          : error.message;
        return { ok: false, error: msg };
      }
      if (!data.session) return { ok: true, needsConfirmation: true };
      await syncUser();
      return { ok: true };
    },
    resetPassword: async (email) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: isBrowser ? `${window.location.origin}/redefinir-senha` : undefined,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    },
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setFavorites([]);
      setOrders([]);
      setCustomers([]);
    },

    products,
    addProduct: async p => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("products").insert({
        slug: p.slug || `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`,
        name: p.name, price: p.price, category_id: p.category || null, collection_id: p.collectionId || null,
        description: p.description, images: p.images, sizes: p.sizes, colors: p.colors,
        variants: JSON.parse(JSON.stringify(p.variants ?? [])),
        featured: !!p.featured, is_new: !!p.isNew, stock: p.stock,
      });
      await handle(error, "Produto criado.");
    },
    updateProduct: async p => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("products").update({
        name: p.name, price: p.price, category_id: p.category || null, collection_id: p.collectionId || null,
        description: p.description, images: p.images, sizes: p.sizes, colors: p.colors,
        variants: JSON.parse(JSON.stringify(p.variants ?? [])),
        featured: !!p.featured, is_new: !!p.isNew, stock: p.stock,
      }).eq("id", p.id);
      await handle(error, "Produto atualizado.");
    },
    removeProduct: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("products").delete().eq("id", id);
      await handle(error, "Produto removido.");
    },

    collections,
    addCollection: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("collections").insert({
        id: c.id, name: c.name, description: c.description, image: c.image, featured: !!c.featured,
        sort_order: collections.length + 1,
      });
      await handle(error, "Coleção criada.");
    },
    updateCollection: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("collections")
        .update({ name: c.name, description: c.description, image: c.image, featured: !!c.featured })
        .eq("id", c.id);
      await handle(error, "Coleção atualizada.");
    },
    removeCollection: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("collections").delete().eq("id", id);
      await handle(error, "Coleção removida.");
    },

    categories,
    updateCategory: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("categories").update({ name: c.name }).eq("id", c.id);
      await handle(error, "Categoria atualizada.");
    },
    addCategory: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("categories").insert({ id: c.id, name: c.name, sort_order: categories.length + 1 });
      await handle(error, "Categoria criada.");
    },
    removeCategory: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("categories").delete().eq("id", id);
      await handle(error, "Categoria removida.");
    },

    banners,
    addBanner: async b => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("banners").insert({
        title: b.title, subtitle: b.subtitle, image: b.image, cta: b.cta, href: b.href, sort_order: b.order,
      });
      await handle(error, "Banner criado.");
    },
    updateBanner: async b => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("banners")
        .update({ title: b.title, subtitle: b.subtitle, image: b.image, cta: b.cta, href: b.href, sort_order: b.order })
        .eq("id", b.id);
      await handle(error, "Banner atualizado.");
    },
    removeBanner: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("banners").delete().eq("id", id);
      await handle(error, "Banner removido.");
    },

    coupons,
    updateCoupon: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("coupons")
        .update({ code: c.code.toUpperCase(), discount: c.discount, active: c.active })
        .eq("id", c.id);
      await handle(error, "Cupom atualizado.");
    },
    addCoupon: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("coupons").insert({ code: c.code, discount: c.discount, active: c.active });
      await handle(error, "Cupom criado.");
    },
    removeCoupon: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      await handle(error, "Cupom removido.");
    },
    findCoupon: code => coupons.find(c => c.active && c.code.toUpperCase() === code.trim().toUpperCase()),

    orders,
    updateOrderStatus: async (id, status) => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      await handle(error, "Status atualizado.");
    },
    createOrder: async input => {
      const { error } = await supabase.from("orders").insert({
        user_id: user?.id ?? null,
        customer_name: input.name,
        customer_phone: input.phone,
        customer_email: input.email ?? user?.email ?? null,
        items: input.items,
        subtotal: input.subtotal,
        discount: input.discount,
        total: input.total,
        coupon_code: input.couponCode ?? null,
      });
      if (error) return { ok: false, error: error.message };
      if (isAdmin) await loadAdminData(true);
      return { ok: true };
    },
    customers,

    favorites,
    toggleFavorite: async id => {
      if (!user) {
        toast.error("Entre na sua conta para salvar favoritos.");
        return;
      }
      if (favorites.includes(id)) {
        setFavorites(prev => prev.filter(x => x !== id));
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", id);
        if (error) { toast.error(error.message); await loadFavorites(user.id); }
      } else {
        setFavorites(prev => [...prev, id]);
        const { error } = await supabase.from("favorites").insert({ user_id: user.id, product_id: id });
        if (error) { toast.error(error.message); await loadFavorites(user.id); }
      }
    },

    cart,
    addToCart: item => setCart(prev => {
      const idx = prev.findIndex(x => x.productId === item.productId && x.size === item.size && x.color === item.color);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + item.quantity };
        return copy;
      }
      return [...prev, item];
    }),
    updateCartQty: (idx, qty) => setCart(prev => prev.map((x, i) => i === idx ? { ...x, quantity: Math.max(1, qty) } : x)),
    removeFromCart: idx => setCart(prev => prev.filter((_, i) => i !== idx)),
    clearCart: () => setCart([]),
    cartOpen, setCartOpen,

    content,
    saveContent: async c => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("site_content").upsert({
        id: c.id, title: c.title, body: c.body, sort_order: c.order, updated_at: new Date().toISOString(),
      });
      await handle(error, "Conteúdo salvo.");
    },
    removeContent: async id => {
      if (!guardAdmin()) return;
      const { error } = await supabase.from("site_content").delete().eq("id", id);
      await handle(error, "Conteúdo removido.");
    },

    updateProfile: async ({ name, phone }) => {
      if (!user) return { ok: false, error: "Sessão expirada." };
      const { error } = await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
      if (error) return { ok: false, error: error.message };
      await supabase.auth.updateUser({ data: { full_name: name } });
      setUser(prev => (prev ? { ...prev, name } : prev));
      return { ok: true };
    },

    settings,
    updateSettings: s => {
      setSettings(prev => {
        const next = { ...prev, ...s };
        if (isAdmin) {
          if (settingsTimer.current) clearTimeout(settingsTimer.current);
          settingsTimer.current = setTimeout(() => {
            void supabase.from("site_settings").update({
              store_name: next.storeName,
              whatsapp: next.whatsapp,
              instagram: next.instagram,
              logo: next.logo,
              primary_color: next.primaryColor,
              instagram_feed: next.instagramFeed,
              hero_banner_id: next.heroBannerId ?? null,
              featured_collection_ids: next.featuredCollectionIds,
              featured_product_ids: next.featuredProductIds,
            }).eq("id", true).then(({ error }) => {
              if (error) toast.error(error.message);
            });
          }, 600);
        }
        return next;
      });
    },
    saveSettingsNow: async () => {
      if (!isAdmin) return;
      if (settingsTimer.current) clearTimeout(settingsTimer.current);
      const { error } = await supabase.from("site_settings").update({
        store_name: settings.storeName,
        whatsapp: settings.whatsapp,
        instagram: settings.instagram,
        logo: settings.logo,
        primary_color: settings.primaryColor,
        hero_banner_id: settings.heroBannerId ?? null,
        featured_collection_ids: settings.featuredCollectionIds,
        featured_product_ids: settings.featuredProductIds,
        instagram_feed: settings.instagramFeed,
      }).eq("id", true);
      if (error) toast.error(error.message);
      else toast.success("Configurações salvas.");
    },
    refresh,
  }), [
    ready, user, isAdmin, products, collections, categories, banners, coupons, orders, customers,
    favorites, cart, cartOpen, settings, content, refresh, syncUser, loadFavorites, loadAdminData,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function formatPrice(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
