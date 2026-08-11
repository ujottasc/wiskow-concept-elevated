import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Wiskow Concept" },
      { name: "description", content: "Painel administrativo Wiskow Concept." },
      { property: "og:title", content: "Admin — Wiskow Concept" },
      { property: "og:description", content: "Painel administrativo." },
    ],
  }),
  component: AdminLayout,
});
