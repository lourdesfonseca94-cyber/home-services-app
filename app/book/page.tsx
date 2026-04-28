"use client";

import { useState } from "react";

type FormState = {
  nombre: string;
  telefono: string;
  direccion: string;
  servicio: string;
  fecha: string;
  notas: string;
};

export default function BookPage() {
  const [form, setForm] = useState<FormState>({
    nombre: "", telefono: "", direccion: "", servicio: "", fecha: "", notas: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.nombre,
          phone: form.telefono,
          address: form.direccion,
          service: form.servicio,
          date: form.fecha,
          notes: form.notas,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || "Error al enviar la reserva.");
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error de red. Intenta de nuevo.");
      setStatus("error");
    }
  }

  return (
    <main
      className="book-main"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div
        className="book-card"
        style={{
          background: "white",
          padding: "50px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "600px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#16a34a", marginBottom: "12px" }}>
              ¡Reserva enviada!
            </h2>
            <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
              Recibimos tu solicitud. Te contactaremos pronto para confirmarte la cita.
            </p>
            <button
              onClick={() => {
                setStatus("idle");
                setForm({ nombre: "", telefono: "", direccion: "", servicio: "", fecha: "", notas: "" });
              }}
              style={{
                background: "#0546ed", color: "white", padding: "14px 32px",
                borderRadius: "8px", border: "none", fontWeight: "700",
                fontSize: "15px", cursor: "pointer",
              }}
            >
              Nueva reserva
            </button>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: "28px", marginBottom: "8px", textAlign: "center", fontWeight: "700" }}>
              Reservar Servicio
            </h1>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "32px", fontSize: "15px" }}>
              Completa el formulario y te contactamos pronto.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={labelStyle} htmlFor="nombre">Nombre completo</label>
                <input id="nombre" type="text" placeholder="Tu nombre" autoComplete="name"
                  value={form.nombre} onChange={set("nombre")} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="telefono">Teléfono</label>
                <input id="telefono" type="tel" placeholder="+507 6000-0000" autoComplete="tel"
                  inputMode="tel" value={form.telefono} onChange={set("telefono")} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="direccion">Dirección</label>
                <input id="direccion" type="text" placeholder="Tu dirección" autoComplete="street-address"
                  value={form.direccion} onChange={set("direccion")} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="servicio">Tipo de servicio</label>
                <select id="servicio" value={form.servicio} onChange={set("servicio")} required style={inputStyle}>
                  <option value="">Selecciona un servicio</option>
                  <option value="Corte de Césped">Corte de Césped</option>
                  <option value="Limpieza del Hogar">Limpieza del Hogar</option>
                  <option value="Poda de Árboles">Poda de Árboles</option>
                  <option value="Plomería">Plomería</option>
                  <option value="Electricidad">Electricidad</option>
                  <option value="Riego & Irrigación">Riego &amp; Irrigación</option>
                </select>
              </div>
              <div>
                <label style={labelStyle} htmlFor="fecha">Fecha preferida</label>
                <input id="fecha" type="date" value={form.fecha} onChange={set("fecha")} required
                  min={new Date().toISOString().split("T")[0]} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle} htmlFor="notas">Notas adicionales (opcional)</label>
                <textarea id="notas" placeholder="Ej: puerta verde, sin perros en el patio..."
                  rows={3} value={form.notas} onChange={set("notas")}
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {status === "error" && (
                <p style={{
                  color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontWeight: "600",
                }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  background: status === "loading" ? "#86efac" : "#16a34a",
                  color: "white", padding: "16px", borderRadius: "8px", border: "none",
                  fontWeight: "700", fontSize: "16px",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  marginTop: "8px", minHeight: "48px", width: "100%",
                  letterSpacing: "0.3px", transition: "background 0.2s",
                }}
              >
                {status === "loading" ? "Enviando…" : "Enviar Reserva"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "6px",
  letterSpacing: "0.2px",
};

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "8px",
  border: "1.5px solid #e5e7eb",
  /* 16px minimum — prevents iOS from zooming in on focus (Apple HIG) */
  fontSize: "16px",
  width: "100%",
  background: "#fafafa",
  color: "#111",
  outline: "none",
  transition: "border-color 0.15s",
  /* 48px tall for comfortable tapping */
  minHeight: "48px",
};
