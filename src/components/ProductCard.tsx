import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { useStore, formatPrice } from "@/lib/store";
import { coverImages } from "@/lib/product-variants";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { favorites, toggleFavorite } = useStore();
  const isFav = favorites.includes(product.id);
  const imgs = coverImages(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/produto/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={imgs[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
          {imgs[1] && (
            <img
              src={imgs[1]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              loading="lazy"
            />
          )}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur text-[10px] uppercase tracking-[0.22em] px-2 py-1">
              Novo
            </span>
          )}
          <button
            aria-label="Favoritar"
            onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-accent text-accent" : ""}`} />
          </button>
        </div>
        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium">{product.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground capitalize">{product.category}</p>
          </div>
          <p className="text-sm">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
