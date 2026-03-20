import "./globals.css";
import NavBar from "./components/NavBar";
import BottomNav from "./components/BottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>

        {/* Navigation Bar */}
        <NavBar />

        {children}

        {/* WhatsApp Floating Button — desktop only */}
        <a
          href="https://wa.me/50761234567?text=Hola%20quiero%20información%20sobre%20sus%20servicios"
          target="_blank"
          className="whatsapp-fab"
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
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
          WhatsApp
        </a>

        {/* Bottom Navigation — mobile only */}
        <BottomNav />

      </body>
    </html>
  );
}
