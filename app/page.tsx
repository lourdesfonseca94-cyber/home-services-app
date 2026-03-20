export default function Home() {
  return (
    <main style={{ fontFamily: "Arial", margin: 0 }}>

      {/* HERO */}

      <section
        style={{
          backgroundImage: "url('/man-cutting-grass-with-lawn-mover-back-yard.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          position: "relative"
        }}
      >

        {/* DARK OVERLAY */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)"
          }}
        />

        {/* HERO CONTENT */}

        <div className="hero-content" style={{ position: "relative", zIndex: 2, maxWidth: "900px" }}>

          <p className="hero-subtitle" style={{ fontSize: "22px", marginBottom: "15px" }}>
            Rápido, Económico y Sin Complicaciones
          </p>

          <h1
            className="hero-title"
            style={{
              fontSize: "70px",
              lineHeight: "1.1",
              textAlign: "center"
            }}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              Servicios de Corte de Césped
            </span>

            <br />

            <span className="hero-title-sub" style={{ fontSize: "60px" }}>
              al Alcance de tu Mano
            </span>
          </h1>

        </div>

      </section>


      {/* MOBILE CATEGORY ICONS */}

      <section className="category-section">
        <div className="category-bar">
          {[
            { icon: "🌿", label: "Jardín" },
            { icon: "🧹", label: "Limpieza" },
            { icon: "🪚", label: "Poda" },
            { icon: "💧", label: "Riego" },
            { icon: "➕", label: "Más" },
          ].map(({ icon, label }) => (
            <a key={label} href="/book" className="category-item">
              <div className="category-icon-circle">{icon}</div>
              <span className="category-label">{label}</span>
            </a>
          ))}
        </div>
      </section>


      {/* OPTIONS SECTION */}

<section
  className="options-section"
  style={{
    marginTop: "-80px",
    marginBottom: "-80px",
    padding: "0 40px",
    display: "flex",
    justifyContent: "center",
    position: "relative",
    zIndex: 5
  }}
>

        <div
          className="options-container"
          style={{
            display: "flex",
            maxWidth: "1200px",
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            background: "white",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35)"
          }}
        >

          {/* GREEN BOX */}

          <div
            className="options-green"
            style={{
              background: "#16a34a",
              color: "white",
              padding: "60px 40px",
              width: "35%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
          >

            <p style={{ fontSize: "20px" }}>
              Tu Jardín
            </p>

            <h2 style={{ fontSize: "60px", margin: "10px 0" }}>
              SIMPLE
            </h2>

            <p style={{ fontSize: "20px" }}>
              Sin contratos obligatorios
            </p>

          </div>


          {/* CONTRACTOR */}

          <div
            className="options-col"
            style={{
              background: "#f5f5f5",
              padding: "50px",
              width: "32%"
            }}
          >

            <h3 style={{ fontSize: "26px", marginBottom: "20px" }}>
              ¿Quieres cortar césped y ganar dinero?
            </h3>

            <ul style={{ lineHeight: "1.8" }}>
              <li>Trabaja en tu propio horario</li>
              <li>No se requiere experiencia</li>
              <li>Pagos rápidos</li>
              <li>Clientes listos para ti</li>
            </ul>

            <a
              href="#"
              style={{
                display: "inline-block",
                marginTop: "20px",
                background: "#16a34a",
                color: "white",
                padding: "12px 25px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Registrarme como Contratista
            </a>

          </div>


          {/* CUSTOMER */}

          <div
            className="options-col"
            style={{
              background: "#f5f5f5",
              padding: "50px",
              width: "33%"
            }}
          >

            <h3 style={{ fontSize: "26px", marginBottom: "20px" }}>
              ¿Quieres que corten tu césped?
            </h3>

            <ul style={{ lineHeight: "1.8" }}>
              <li>Servicio bajo demanda</li>
              <li>Precios accesibles</li>
              <li>Sin complicaciones</li>
              <li>Resultados profesionales</li>
            </ul>

            <a
              href="/book"
              style={{
                display: "inline-block",
                marginTop: "20px",
                background: "#16a34a",
                color: "white",
                padding: "12px 25px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Reservar Servicio
            </a>

          </div>

        </div>

      </section>



      {/* HOW IT WORKS */}

      <section
        className="section-padded"
        style={{
          backgroundImage: "url('/publicgrass-bg.jpg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "120px 40px",
          textAlign: "center",
          color: "white",
          position: "relative"
        }}
      >

        {/* OVERLAY */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)"
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>

          <h2 className="section-h2" style={{ fontSize: "42px", marginBottom: "15px" }}>
            Cuidado del Césped Simplificado
          </h2>

          <p style={{ fontSize: "20px", marginBottom: "60px" }}>
            Solicita el servicio, aprueba el trabajo y disfruta tu jardín sin complicaciones.
          </p>


          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              flexWrap: "wrap"
            }}
          >

            {/* CARD 1 */}

<div
className="how-card"
style={{
background: "white",
color: "#222",
padding: "40px",
borderRadius: "10px",
width: "300px",
minHeight: "260px",
textAlign: "center"
}}
>

<img
src="/step1.png.png"
style={{
width: "160px",
marginBottom: "25px"
}}
/>

<h3
style={{
fontSize: "28px",
fontWeight: "700",
marginBottom: "15px"
}}
>
Solicita el Servicio
</h3>

<p
style={{
fontSize: "16px",
lineHeight: "1.6",
color: "#666",
marginBottom: "25px"
}}
>
Simplemente ingresa tu dirección y solicita el corte de césped en pocos pasos. Sin contratos ni complicaciones.
</p>

<a
href="/book"
style={{
display: "inline-block",
background: "#16a34a",
color: "white",
padding: "12px 28px",
borderRadius: "6px",
textDecoration: "none",
fontWeight: "bold",
fontSize: "14px"
}}
>
COMENZAR
</a>

</div>



            {/* CARD 2 */}

<div
className="how-card"
style={{
background: "white",
color: "#222",
padding: "40px",
borderRadius: "10px",
width: "300px",
minHeight: "260px",
textAlign: "center"
}}
>

<img
src="/step2.png.png"
style={{
width: "160px",
marginBottom: "25px"
}}
/>

<h3
style={{
fontSize: "28px",
fontWeight: "700",
marginBottom: "15px"
}}
>
Aprueba el Trabajo
</h3>

<p
style={{
fontSize: "16px",
lineHeight: "1.6",
color: "#666",
marginBottom: "25px"
}}
>
Un profesional llegará a cortar tu césped. Podrás revisar el resultado y aprobar el trabajo fácilmente desde la plataforma.
</p>

<a
href="/book"
style={{
display: "inline-block",
background: "#16a34a",
color: "white",
padding: "12px 28px",
borderRadius: "6px",
textDecoration: "none",
fontWeight: "bold",
fontSize: "14px"
}}
>
PROGRAMAR SERVICIO
</a>

</div>



            {/* CARD 3 */}

            <div
              className="how-card"
              style={{
                background: "white",
                color: "#222",
                padding: "40px",
                borderRadius: "10px",
                width: "300px",
                textAlign: "center"
              }}
            >

              <img src="/step3.png.png" style={{ width: "160px", marginBottom: "25px" }} />

              <h3 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "15px" }}>
                Disfruta tu Jardín
              </h3>

              <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#666", marginBottom: "25px" }}>
                Relájate y disfruta de un césped perfectamente cuidado sin esfuerzo.
              </p>

              <a href="/book" style={{
                display: "inline-block",
                background: "#16a34a",
                color: "white",
                padding: "12px 28px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold"
              }}>
                RESERVAR AHORA
              </a>

            </div>

          </div>

        </div>

      </section>

{/* TESTIMONIALS */}

<section
className="section-padded"
style={{
padding: "120px 40px",
textAlign: "center",
background: "#f5f5f5"
}}
>

<h2
className="section-h2"
style={{
fontSize: "42px",
marginBottom: "60px",
lineHeight: "1.3"
}}
>
Mira lo que nuestros clientes felices dicen sobre{" "}
<span style={{ color: "#16a34a" }}>
Green Leaf Services
</span>
</h2>


<div
style={{
display: "flex",
justifyContent: "center",
gap: "40px",
flexWrap: "wrap"
}}
>

{/* REVIEW 1 */}

<div
className="review-card"
style={{
background: "white",
padding: "40px",
borderRadius: "10px",
width: "320px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
}}
>

<div style={{ color: "#16a34a", fontSize: "20px", marginBottom: "15px" }}>
★★★★★
</div>

<p style={{ color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>
"Este servicio me salvó los fines de semana. Reservar fue muy fácil y mi jardín siempre queda perfecto. ¡Lo recomiendo totalmente!"
</p>

<strong>Carlos M.</strong>

</div>


{/* REVIEW 2 */}

<div
className="review-card"
style={{
background: "white",
padding: "40px",
borderRadius: "10px",
width: "320px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
}}
>

<div style={{ color: "#16a34a", fontSize: "20px", marginBottom: "15px" }}>
★★★★★
</div>

<p style={{ color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>
"No tengo tiempo para cortar el césped, pero ahora mi jardín siempre luce profesional cada semana. Excelente servicio."
</p>

<strong>María R.</strong>

</div>


{/* REVIEW 3 */}

<div
className="review-card"
style={{
background: "white",
padding: "40px",
borderRadius: "10px",
width: "320px",
boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
}}
>

<div style={{ color: "#16a34a", fontSize: "20px", marginBottom: "15px" }}>
★★★★★
</div>

<p style={{ color: "#444", lineHeight: "1.6", marginBottom: "20px" }}>
"El contratista siempre llega a tiempo y hace un trabajo excelente. Mi jardín nunca se ha visto mejor."
</p>

<strong>Jorge P.</strong>

</div>

</div>

</section>

{/* CONTRACTOR SECTION */}

<section
className="section-padded"
style={{
background: "#1f7a3a",
padding: "120px 40px",
color: "white",
textAlign: "center"
}}
>

<h2
className="section-h2"
style={{
fontSize: "44px",
marginBottom: "60px"
}}
>
¿Por Qué Convertirte en Contratista de Green Leaf Services?
</h2>


<div
style={{
display: "flex",
justifyContent: "center",
gap: "30px",
flexWrap: "wrap"
}}
>

{/* BOX 1 */}

<div
className="contractor-box"
style={{
width: "280px",
background: "#1f7a3a",
border: "1px solid rgba(255,255,255,0.15)",
borderRadius: "10px",
padding: "30px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
minHeight: "480px"
}}
>

<div style={{ position: "relative" }}>

<img
src="/lawnsection.jpg"
style={{
width: "100%",
borderRadius: "8px",
marginBottom: "20px"
}}
/>

<div
style={{
position: "absolute",
top: 0,
left: 0,
width: "100%",
height: "100%",
background: "rgba(0,60,120,0.65)",
borderRadius: "8px"
}}
/>

<div
style={{
position: "absolute",
top: "50%",
left: "50%",
transform: "translate(-50%, -50%)",
textAlign: "center"
}}
>

<p style={{ fontSize: "14px" }}>
CORTA CÉSPED
</p>

<h3 style={{ fontSize: "34px", margin: "10px 0" }}>
¡GANA DINERO!
</h3>

<p style={{ fontSize: "14px" }}>
¡Así de fácil!
</p>

</div>

</div>

<a
href="#"
style={{
display: "block",
background: "#16a34a",
padding: "15px",
marginTop: "auto",
borderRadius: "6px",
textDecoration: "none",
color: "white",
fontWeight: "bold"
}}
>
CONVIÉRTETE EN CONTRATISTA
</a>

</div>



{/* BOX 2 */}

<div
className="contractor-box"
style={{
width: "280px",
background: "#1f7a3a",
border: "1px solid rgba(255,255,255,0.15)",
borderRadius: "10px",
padding: "30px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
minHeight: "480px"
}}
>

<img
src="/lawnsection2.png"
style={{
width: "100%",
marginBottom: "20px"
}}
/>

<h3
style={{
fontSize: "24px",
fontWeight: "700",
marginBottom: "15px",
color: "white"
}}
>
Encuentra Trabajos Cercanos
</h3>

<p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
Obtén acceso inmediato a trabajos de jardinería cerca de ti. Nosotros te conectamos con clientes que necesitan ayuda.
</p>

<a
href="#"
style={{
background: "#0f3e6b",
padding: "12px 20px",
borderRadius: "6px",
display: "inline-block",
textDecoration: "none",
color: "white",
fontWeight: "bold"
}}
>
CORTA CÉSPED Y GANA DINERO
</a>

</div>



{/* BOX 3 */}

<div
className="contractor-box"
style={{
width: "280px",
background: "#1f7a3a",
border: "1px solid rgba(255,255,255,0.15)",
borderRadius: "10px",
padding: "30px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
minHeight: "480px"
}}
>

<img
src="/lawnsection3.png"
style={{
width: "100%",
marginBottom: "20px"
}}
/>

<h3
style={{
fontSize: "24px",
fontWeight: "700",
marginBottom: "15px",
color: "white"
}}
>
Corta y Sube Fotos
</h3>

<p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
Completa tantos trabajos como quieras según tu horario y sube fotos del resultado desde la app.
</p>

<a
href="#"
style={{
background: "#0f3e6b",
padding: "12px 20px",
borderRadius: "6px",
display: "inline-block",
textDecoration: "none",
color: "white",
fontWeight: "bold"
}}
>
TRABAJA A TU PROPIO HORARIO
</a>

</div>



{/* BOX 4 */}

<div
className="contractor-box"
style={{
width: "280px",
background: "#1f7a3a",
border: "1px solid rgba(255,255,255,0.15)",
borderRadius: "10px",
padding: "30px",
display: "flex",
flexDirection: "column",
justifyContent: "space-between",
minHeight: "480px"
}}
>

<img
src="/lawnsection4.png"
style={{
width: "100%",
marginBottom: "20px"
}}
/>

<h3
style={{
fontSize: "24px",
fontWeight: "700",
marginBottom: "15px",
color: "white"
}}
>
Recibe Pago Rápido
</h3>

<p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "20px" }}>
Una vez aprobado el trabajo, recibes tu pago rápidamente. Gana dinero haciendo lo que ya sabes hacer.
</p>

<a
href="#"
style={{
background: "#0f3e6b",
padding: "12px 20px",
borderRadius: "6px",
display: "inline-block",
textDecoration: "none",
color: "white",
fontWeight: "bold"
}}
>
EMPIEZA A GANAR HOY
</a>

</div>

</div>

</section>
    </main>
  );
}
