import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>

        {/* Navigation Bar */}

        <nav
  className="nav-wrapper"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "15px 40px",
    position: "absolute",
    width: "100%",
    zIndex: 1000,
    color: "white"
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
    marginLeft: "-30px"
  }}
/>

          {/* Menu */}

          <div className="nav-menu" style={{ display: "flex", gap: "30px" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>Inicio</a>
            <a href="/book" style={{ color: "white", textDecoration: "none" }}>Reservar</a>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>Servicios</a>
            <a href="#" style={{ color: "white", textDecoration: "none" }}>Contacto</a>
          </div>

        </nav>

        {children}

        {/* WhatsApp Floating Button */}

        <a
          href="https://wa.me/50761234567?text=Hola%20quiero%20información%20sobre%20sus%20servicios"
          target="_blank"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#25D366",
            color: "white",
            padding: "15px 20px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          WhatsApp
        </a>

      </body>
    </html>
  );
}