export default function BookPage() {
  return (
    <main style={{padding:"40px",fontFamily:"Arial"}}>
      
      <h1 style={{fontSize:"36px",marginBottom:"20px"}}>
        Book a Service
      </h1>

      <form style={{display:"flex",flexDirection:"column",gap:"15px",maxWidth:"400px"}}>

        <input placeholder="Your Name" />

        <input placeholder="Phone Number" />

        <input placeholder="Address" />

        <select>
          <option>House Cleaning</option>
          <option>Lawn Mowing</option>
        </select>

        <input type="date" />

        <button
          style={{
            background:"green",
            color:"white",
            padding:"12px",
            borderRadius:"8px",
            border:"none"
          }}
        >
          Submit Booking
        </button>

      </form>

    </main>
  );
}