export default function BookPage() {
  return (
    <main
      style={{
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div
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
            fontSize: "36px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Reservar Servicio
        </h1>

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <input type="text" placeholder="Nombre" style={inputStyle} />

          <input type="tel" placeholder="Teléfono" style={inputStyle} />

          <input type="text" placeholder="Dirección" style={inputStyle} />

          <select style={inputStyle}>
            <option>Corte de Césped</option>
            <option>Limpieza de Patio</option>
            <option>Poda de Árboles</option>
          </select>

          <input type="date" style={inputStyle} />

          <textarea
            placeholder="Notas adicionales"
            rows={4}
            style={inputStyle}
          />

          <button
            style={{
              background: "#16a34a",
              color: "white",
              padding: "15px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Enviar Reserva
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle = {
  padding: "14px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "15px",
  width: "100%",
};