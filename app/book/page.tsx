export default function BookPage() {
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
        <h1
          style={{
            fontSize: "28px",
            marginBottom: "8px",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          Reservar Servicio
        </h1>

        <p style={{ textAlign: "center", color: "#666", marginBottom: "32px", fontSize: "15px" }}>
          Completa el formulario y te contactamos pronto.
        </p>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Name */}
          <div>
            <label style={labelStyle} htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              autoComplete="name"
              style={inputStyle}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle} htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              placeholder="+507 6000-0000"
              autoComplete="tel"
              inputMode="tel"
              style={inputStyle}
            />
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle} htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              type="text"
              placeholder="Tu dirección"
              autoComplete="street-address"
              style={inputStyle}
            />
          </div>

          {/* Service */}
          <div>
            <label style={labelStyle} htmlFor="servicio">Tipo de servicio</label>
            <select id="servicio" style={inputStyle}>
              <option value="">Selecciona un servicio</option>
              <option value="cesped">Corte de Césped</option>
              <option value="patio">Limpieza de Patio</option>
              <option value="poda">Poda de Árboles</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle} htmlFor="fecha">Fecha preferida</label>
            <input
              id="fecha"
              type="date"
              style={inputStyle}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle} htmlFor="notas">Notas adicionales (opcional)</label>
            <textarea
              id="notas"
              placeholder="Ej: puerta verde, sin perros en el patio..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#16a34a",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "700",
              fontSize: "16px",
              cursor: "pointer",
              marginTop: "8px",
              /* 48px tall — Material minimum touch target */
              minHeight: "48px",
              width: "100%",
              letterSpacing: "0.3px",
            }}
          >
            Enviar Reserva
          </button>
        </form>
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
