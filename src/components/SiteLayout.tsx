import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

export function SiteLayout({ children, transparentNav = false }: { children: ReactNode; transparentNav?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transparentOnTop={transparentNav} />
      <main className={transparentNav ? "" : "pt-16 md:pt-20"}>{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
