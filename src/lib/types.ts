export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

export interface ProductVariant {
  id: string;
  name: string;
  hex: string;
  images: string[];
  primaryImage?: string;
}

export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  category: string;
  collectionId?: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  isNew?: boolean;
  stock: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: string;
  href?: string;
  order: number;
}

export interface CartItem {
  productId: string;
  size: string;
  color: string;
  quantity: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  active: boolean;
}

export type OrderStatus = "Pendente" | "Pago" | "Enviado" | "Entregue" | "Cancelado";

export interface Order {
  id: string;
  customer: string;
  phone?: string;
  email?: string;
  total: number;
  status: OrderStatus;
  date: string;
  items: number;
  lines?: { name: string; size: string; color: string; quantity: number; price: number }[];
  couponCode?: string | null;
  subtotal?: number;
  discount?: number;
  userId?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
}

export interface Settings {
  storeName: string;
  whatsapp: string;
  instagram: string;
  logo: string;
  primaryColor: string;
  instagramFeed: string[];
  heroBannerId?: string;
  featuredCollectionIds: string[];
  featuredProductIds: string[];
}

export interface SiteContent {
  id: string;
  title: string;
  body: string;
  order: number;
}
