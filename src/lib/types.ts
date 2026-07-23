export type Role = "ADMIN" | "USER";

export interface User {
  email: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  collectionId?: string;
  description: string;
  images: string[];
  sizes: string[];
  colors: string[];
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

export interface Order {
  id: string;
  customer: string;
  total: number;
  status: "Pendente" | "Pago" | "Enviado" | "Entregue";
  date: string;
  items: number;
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
  heroBannerId?: string;
  featuredCollectionIds: string[];
  featuredProductIds: string[];
}
