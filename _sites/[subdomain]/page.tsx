// app/_sites/[subdomain]/page.tsx (Archivo de prueba)

// Esta página no necesita ser async porque no se conecta a la base de datos
export default function PaginaDePrueba({ params }: { params: { subdomain: string } }) {
  
  // Si esta página se muestra, significa que el middleware y el routing funcionan.
  return (
    <div style={{
      display: 'grid',
      placeContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      fontSize: '2rem',
      backgroundColor: '#e0f7fa',
      textAlign: 'center'
    }}>
      <h1>✅ ¡El Routing Funciona!</h1>
      <p>Next.js ha recibido el subdominio:</p>
      <p style={{
        fontWeight: 'bold',
        color: '#00796b',
        border: '2px solid #00796b',
        padding: '1rem',
        marginTop: '1rem'
      }}>
        {params.subdomain}
      </p>
    </div>
  );
}