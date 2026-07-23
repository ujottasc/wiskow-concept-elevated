import type { Product, Collection, Category, Banner, Coupon, Order, Customer, Settings } from "./types";

// TODO: Substituir por imagens oficiais da Wiskow Concept
const img = (id: string, w = 900, h = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const seedCategories: Category[] = [
  { id: "vestidos", name: "Vestidos" },
  { id: "blusas", name: "Blusas" },
  { id: "alfaiataria", name: "Alfaiataria" },
  { id: "tricot", name: "Tricot" },
  { id: "saias", name: "Saias" },
  { id: "acessorios", name: "Acessórios" },
];

export const seedCollections: Collection[] = [
  {
    id: "atelier-25",
    name: "Atelier 25",
    description: "Peças atemporais em linho, seda e cashmere. Cortes precisos, silhuetas fluidas.",
    image: img("photo-1490481651871-ab68de25d43d"),
    featured: true,
  },
  {
    id: "essenciais",
    name: "Essenciais",
    description: "A base do guarda-roupa Wiskow. Feminino, discreto, essencial.",
    image: img("photo-1483985988355-763728e1935b"),
    featured: true,
  },
  {
    id: "noite",
    name: "Coleção Noite",
    description: "Silhuetas esculpidas para momentos memoráveis.",
    image: img("photo-1469334031218-e382a71b716b"),
  },
  {
    id: "resort",
    name: "Resort",
    description: "Tecidos leves e cortes livres inspirados na luz do mediterrâneo.",
    image: img("photo-1441986300917-64674bd600d8"),
  },
];

export const seedProducts: Product[] = [
  {
    id: "p1",
    name: "Vestido Slip Seda",
    price: 890,
    category: "vestidos",
    collectionId: "atelier-25",
    description: "Vestido midi em pura seda com alças finas ajustáveis e viés no decote. Caimento fluido, silhueta na diagonal do corpo.",
    images: [img("photo-1595777457583-95e059d581b8"), img("photo-1490481651871-ab68de25d43d"), img("photo-1483985988355-763728e1935b")],
    sizes: ["PP", "P", "M", "G"],
    colors: ["Areia", "Preto", "Marfim"],
    featured: true,
    isNew: true,
    stock: 12,
  },
  {
    id: "p2",
    name: "Blazer Alfaiataria Oversized",
    price: 1290,
    category: "alfaiataria",
    collectionId: "essenciais",
    description: "Blazer estruturado em lã fria, ombros marcados e forro em cupro. Fechamento com dois botões forrados.",
    images: [img("photo-1594633312681-425c7b97ccd1"), img("photo-1551803091-e20673f15770")],
    sizes: ["P", "M", "G"],
    colors: ["Preto", "Camel"],
    featured: true,
    stock: 8,
  },
  {
    id: "p3",
    name: "Camisa Popeline Branca",
    price: 490,
    category: "blusas",
    collectionId: "essenciais",
    description: "Camisa clássica em popeline de algodão egípcio, punhos duplos e colarinho italiano.",
    images: [img("photo-1485462537746-965f33f7f6a7"), img("photo-1554568218-0f1715e72254")],
    sizes: ["PP", "P", "M", "G"],
    colors: ["Branco"],
    featured: true,
    stock: 20,
  },
  {
    id: "p4",
    name: "Tricot Cashmere Gola Alta",
    price: 1490,
    category: "tricot",
    collectionId: "atelier-25",
    description: "Tricot em 100% cashmere mongol, tricô fino gauge 12, gola alta e barra em canelado.",
    images: [img("photo-1583744946564-b52ac1c389c8"), img("photo-1434389677669-e08b4cac3105")],
    sizes: ["P", "M", "G"],
    colors: ["Off White", "Grafite"],
    isNew: true,
    stock: 6,
  },
  {
    id: "p5",
    name: "Saia Midi Plissada",
    price: 690,
    category: "saias",
    collectionId: "resort",
    description: "Saia midi em plissê sunray, cintura alta com elástico interno recoberto.",
    images: [img("photo-1583496661160-fb5886a13d4b"), img("photo-1585487000160-6ebcfceb0d03")],
    sizes: ["P", "M", "G"],
    colors: ["Rosé", "Preto"],
    stock: 10,
  },
  {
    id: "p6",
    name: "Vestido Longo Cetim",
    price: 1690,
    category: "vestidos",
    collectionId: "noite",
    description: "Vestido longo em cetim liso com fenda lateral e decote quadrado.",
    images: [img("photo-1566174053879-31528523f8ae"), img("photo-1515372039744-b8f02a3ae446")],
    sizes: ["P", "M", "G"],
    colors: ["Champagne", "Preto"],
    featured: true,
    isNew: true,
    stock: 4,
  },
  {
    id: "p7",
    name: "Calça Alfaiataria Fluida",
    price: 890,
    category: "alfaiataria",
    collectionId: "essenciais",
    description: "Calça de alfaiataria em tecido fluido, cintura alta e pregas frontais.",
    images: [img("photo-1509631179647-0177331693ae"), img("photo-1521572163474-6864f9cf17ab")],
    sizes: ["36", "38", "40", "42"],
    colors: ["Preto", "Grafite", "Areia"],
    stock: 15,
  },
  {
    id: "p8",
    name: "Blusa de Seda Manga Bufante",
    price: 790,
    category: "blusas",
    collectionId: "atelier-25",
    description: "Blusa em pura seda com mangas bufantes e punhos franzidos.",
    images: [img("photo-1564257577-4d0a17f0e7d5"), img("photo-1487222477894-8943e31ef7b2")],
    sizes: ["P", "M", "G"],
    colors: ["Marfim", "Rosé"],
    stock: 9,
  },
];

export const seedBanners: Banner[] = [
  {
    id: "b1",
    title: "Atelier 25",
    subtitle: "A nova coleção. Precisão em cada corte.",
    image: img("photo-1490481651871-ab68de25d43d", 1920, 1200),
    cta: "Descobrir",
    href: "/nova-colecao",
    order: 1,
  },
  {
    id: "b2",
    title: "Essenciais",
    subtitle: "O guarda-roupa que fica.",
    image: img("photo-1483985988355-763728e1935b", 1920, 1200),
    cta: "Ver coleção",
    href: "/colecoes",
    order: 2,
  },
];

export const seedCoupons: Coupon[] = [
  { id: "c1", code: "WISKOW10", discount: 10, active: true },
  { id: "c2", code: "PRIMEIRA", discount: 15, active: true },
];

export const seedOrders: Order[] = [
  { id: "o1", customer: "Marina Ribeiro", total: 2380, status: "Pago", date: "2025-11-14", items: 3 },
  { id: "o2", customer: "Camila Duarte", total: 890, status: "Enviado", date: "2025-11-12", items: 1 },
  { id: "o3", customer: "Julia Prado", total: 1490, status: "Pendente", date: "2025-11-10", items: 2 },
  { id: "o4", customer: "Beatriz Lemos", total: 3170, status: "Entregue", date: "2025-11-08", items: 4 },
  { id: "o5", customer: "Sofia Andrade", total: 690, status: "Pago", date: "2025-11-07", items: 1 },
];

export const seedCustomers: Customer[] = [
  { id: "cu1", name: "Marina Ribeiro", email: "marina@example.com", phone: "+55 51 9 9999-0001", orders: 4, spent: 5890 },
  { id: "cu2", name: "Camila Duarte", email: "camila@example.com", phone: "+55 51 9 9999-0002", orders: 2, spent: 2180 },
  { id: "cu3", name: "Julia Prado", email: "julia@example.com", phone: "+55 51 9 9999-0003", orders: 1, spent: 1490 },
  { id: "cu4", name: "Beatriz Lemos", email: "beatriz@example.com", phone: "+55 51 9 9999-0004", orders: 6, spent: 8710 },
];

export const defaultSettings: Settings = {
  storeName: "Wiskow Concept",
  whatsapp: "5551997593705",
  instagram: "wiskow.concept",
  logo: "",
  primaryColor: "#c48a8a",
  heroBannerId: "b1",
  featuredCollectionIds: ["atelier-25", "essenciais", "noite"],
  featuredProductIds: ["p1", "p2", "p6", "p4"],
};
