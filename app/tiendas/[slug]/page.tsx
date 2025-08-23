// Componente para mostrar cuando la tienda está en mantenimiento
function MaintenancePage({ storeName }: { storeName: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <h1 className="text-4xl font-bold">🛠️ {storeName} 🛠️</h1>
        <p className="text-gray-600 mt-4 text-lg">
          Nuestra tienda está temporalmente en mantenimiento. <br />
          ¡Volveremos pronto!
        </p>
      </div>
    </div>
  );
}

// Función que se ejecuta en el servidor para buscar los datos de la tienda
async function getStoreData(slug: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/tiendas/${slug}`, {
      cache: 'no-store', // Asegura que siempre busquemos los datos más recientes
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching store data:", error);
    return null;
  }
}

// --- COMPONENTES DE PLANTILLA ---
// Estos son componentes simples que representan diferentes estilos de tienda.

function TemplateModerno({ store }: { store: any }) {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header className="text-center py-16 px-4" style={{ backgroundColor: store.primaryColor, color: 'white' }}>
        <h1 className="text-5xl font-extrabold">{store.heroTitle}</h1>
        <p className="mt-4 text-lg">{store.heroDescription}</p>
      </header>
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.products.map((product: any) => (
            <div key={product.id} className="border rounded-lg shadow-lg text-center p-6 transition-transform hover:scale-105">
              <img src={product.imageUrl || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-2xl font-bold mt-2" style={{ color: store.primaryColor }}>${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// --- PÁGINA PÚBLICA PRINCIPAL ---
export default async function PublicStorePage({ params }: { params: { slug: string } }) {
  const store = await getStoreData(params.slug);

  // Caso 1: La tienda no se encuentra o no está publicada
  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-4xl font-bold">Tienda no disponible</h1>
          <p className="text-gray-600 mt-2">Esta tienda no existe o aún no ha sido publicada.</p>
        </div>
      </div>
    );
  }
  
  // Caso 2: La tienda está en modo mantenimiento
  if (store.isMaintenanceMode) { 
    return <MaintenancePage storeName={store.name} />; 
  }

  // Caso 3: Renderizar la plantilla correcta
  switch (store.template) {
    case 'moderno':
      return <TemplateModerno store={store} />;
    // En el futuro, podrías añadir más plantillas aquí
    // case 'minimalista':
    //   return <TemplateMinimalista store={store} />;
    default:
      return <TemplateModerno store={store} />; // Usamos 'moderno' como plantilla por defecto
  }
}
