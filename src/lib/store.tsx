import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type {
  Product, Collection, Category, Banner, CartItem, Coupon, Order, Customer, Settings, User,
} from "./types";
import {
  seedProducts, seedCollections, seedCategories, seedBanners,
  seedCoupons, seedOrders, seedCustomers, defaultSettings,
} from "./mock-data";

// ------------ auth ------------
const ALLOWED = [
  { email: "arthur.contato9@gmail.com", password: "admin", role: "ADMIN" as const },
  { email: "mwiskowadmin@gmail.com", password: "admin", role: "ADMIN" as const },
];

const isBrowser = typeof window !== "undefined";
const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
};
const write = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

// ------------ context ------------
interface StoreCtx {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  removeProduct: (id: string) => void;

  collections: Collection[];
  addCollection: (c: Collection) => void;
  updateCollection: (c: Collection) => void;
  removeCollection: (id: string) => void;

  categories: Category[];
  addCategory: (c: Category) => void;
  removeCategory: (id: string) => void;

  banners: Banner[];
  addBanner: (b: Banner) => void;
  updateBanner: (b: Banner) => void;
  removeBanner: (id: string) => void;

  coupons: Coupon[];
  addCoupon: (c: Coupon) => void;
  removeCoupon: (id: string) => void;

  orders: Order[];
  customers: Customer[];

  favorites: string[];
  toggleFavorite: (id: string) => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (idx: number, qty: number) => void;
  removeFromCart: (idx: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [collections, setCollections] = useState<Collection[]>(seedCollections);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [banners, setBanners] = useState<Banner[]>(seedBanners);
  const [coupons, setCoupons] = useState<Coupon[]>(seedCoupons);
  const [orders] = useState<Order[]>(seedOrders);
  const [customers] = useState<Customer[]>(seedCustomers);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    setUser(read<User | null>("wk:user", null));
    setProducts(read("wk:products", seedProducts));
    setCollections(read("wk:collections", seedCollections));
    setCategories(read("wk:categories", seedCategories));
    setBanners(read("wk:banners", seedBanners));
    setCoupons(read("wk:coupons", seedCoupons));
    setFavorites(read("wk:favorites", []));
    setCart(read("wk:cart", []));
    setSettings(read("wk:settings", defaultSettings));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) write("wk:user", user); }, [user, hydrated]);
  useEffect(() => { if (hydrated) write("wk:products", products); }, [products, hydrated]);
  useEffect(() => { if (hydrated) write("wk:collections", collections); }, [collections, hydrated]);
  useEffect(() => { if (hydrated) write("wk:categories", categories); }, [categories, hydrated]);
  useEffect(() => { if (hydrated) write("wk:banners", banners); }, [banners, hydrated]);
  useEffect(() => { if (hydrated) write("wk:coupons", coupons); }, [coupons, hydrated]);
  useEffect(() => { if (hydrated) write("wk:favorites", favorites); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) write("wk:cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) write("wk:settings", settings); }, [settings, hydrated]);

  const value: StoreCtx = {
    user,
    login: (email, password) => {
      const found = ALLOWED.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!found) return { ok: false, error: "Credenciais inválidas para esta demonstração." };
      setUser({ email: found.email, role: found.role });
      return { ok: true };
    },
    logout: () => setUser(null),

    products,
    addProduct: p => setProducts(prev => [p, ...prev]),
    updateProduct: p => setProducts(prev => prev.map(x => x.id === p.id ? p : x)),
    removeProduct: id => setProducts(prev => prev.filter(x => x.id !== id)),

    collections,
    addCollection: c => setCollections(prev => [c, ...prev]),
    updateCollection: c => setCollections(prev => prev.map(x => x.id === c.id ? c : x)),
    removeCollection: id => setCollections(prev => prev.filter(x => x.id !== id)),

    categories,
    addCategory: c => setCategories(prev => [...prev, c]),
    removeCategory: id => setCategories(prev => prev.filter(x => x.id !== id)),

    banners,
    addBanner: b => setBanners(prev => [...prev, b].sort((a, b) => a.order - b.order)),
    updateBanner: b => setBanners(prev => prev.map(x => x.id === b.id ? b : x)),
    removeBanner: id => setBanners(prev => prev.filter(x => x.id !== id)),

    coupons,
    addCoupon: c => setCoupons(prev => [...prev, c]),
    removeCoupon: id => setCoupons(prev => prev.filter(x => x.id !== id)),

    orders,
    customers,

    favorites,
    toggleFavorite: id => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]),

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

    settings,
    updateSettings: s => setSettings(prev => ({ ...prev, ...s })),
  };

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
