"use client";

import { useState } from "react";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="nav-wrapper"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          position: "absolute",
          width: "100%",
          zIndex: 1000,
          color: "white",
        }}
      >
        {/* Logo */}
        <img
          className="nav-logo"
          src="/logo.png"
          style={{
            height: "230px",
            objectFit: "contain",
            marginTop: "-60px",
            marginLeft: "-30px",
          }}
        />

        {/* Desktop Menu */}
        <div className="nav-menu-desktop" style={{ display: "flex", gap: "30px" }}>
          <a href="/" style={{ color: "white", textDecoration: "none" }}>Inicio</a>
          <a href="/book" style={{ color: "white", textDecoration: "none" }}>Reservar</a>
          <a href="#servicios" style={{ color: "white", textDecoration: "none" }}>Servicios</a>
          <a href="#contacto" style={{ color: "white", textDecoration: "none" }}>Contacto</a>
        </div>

        {/* Hamburger Button — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          style={{
            display: "none",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "8px",
            color: "white",
            fontSize: "22px",
            padding: "6px 12px",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          className="nav-mobile-dropdown"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "36px",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "28px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>

          {[
            { href: "/", label: "🏠  Inicio" },
            { href: "/book", label: "📅  Reservar" },
            { href: "#servicios", label: "🌿  Servicios" },
            { href: "#contacto", label: "💬  Contacto" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "28px",
                fontWeight: "600",
                letterSpacing: "0.5px",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
