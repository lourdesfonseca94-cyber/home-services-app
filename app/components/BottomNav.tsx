"use client";

import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", icon: "🏠", label: "Inicio" },
  { href: "#servicios", icon: "🔍", label: "Buscar" },
  { href: "/book", icon: "📅", label: "Reservar" },
  {
    href: "https://wa.me/50761234567?text=Hola%20quiero%20información%20sobre%20sus%20servicios",
    icon: "💬",
    label: "Chat",
    external: true,
  },
  { href: "#contacto", icon: "⚙️", label: "Ajustes" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {tabs.map(({ href, icon, label, external }) => {
        const isActive = !external && pathname === href;
        return (
          <a
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`bottom-nav-item${isActive ? " active" : ""}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </a>
        );
      })}
    </nav>
  );
}
