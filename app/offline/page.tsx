"use client";

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#f9f5ff", fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "32px 24px", textAlign: "center",
    }}>
      <img src="/todoclean-logo.png" alt="TodoClean" style={{ height: "60px", objectFit: "contain", marginBottom: "32px", opacity: 0.6 }} />
      <div style={{ fontSize: "56px", marginBottom: "16px" }}>📡</div>
      <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#2b2a51", marginBottom: "12px" }}>
        Sin conexion
      </h1>
      <p style={{ color: "#585781", fontSize: "15px", lineHeight: "1.6", maxWidth: "280px", marginBottom: "32px" }}>
        Revisa tu conexion a internet e intentalo de nuevo.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: "#0546ed", color: "white", border: "none",
          borderRadius: "50px", padding: "14px 32px",
          fontWeight: "700", fontSize: "15px", cursor: "pointer",
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
