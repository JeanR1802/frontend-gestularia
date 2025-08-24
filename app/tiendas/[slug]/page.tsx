// app/tiendas/[slug]/page.tsx
import React from "react";

// --- Evitamos usar "use client" para SSR dinámico ---
export const dynamic = "force-dynamic";

// --- Componente de mantenimiento ---
function MaintenancePage({ storeName }: { storeName: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen text-center bg-gray-50">
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

// --- Plantilla moderno ---
function TemplateModerno({ store }: { store: any }) {
  const primaryColor = store.primaryColor || "#0f172a";
  const heroTitle = store.heroTitle || store.name || "Bienvenidos a la tienda";
  const heroDescription = store.heroDescription || "Nuestros productos destacados";

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        className="text-center py-16 px-4"
        style={{ backgroundColor: primaryColor, color: "white" }}
      >
        <h1 className="text-5xl font-extrabold">{heroTitle}</h1>
        <p className="mt-4 text-lg">{heroDescription}</p>
      </header>
      <main className="container mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Nuestros Productos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.products?.length > 0 ? (
            store.products.map((product: any) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-lg text-center p-6 transition-transform hover:scale-105"
              >
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-2xl font-bold mt-2" style={{ color: primaryColor }}>
                  ${product.price?.toFixed(2) || "0.00"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Función para obtener datos del backend ---
async function getStoreData(slug: string) {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.gestularia.com";
    const res = await fetch(`${API_BASE}/api/tiendas/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching store data:", error);
    return null;
  }
}

// --- Función para extraer subdominio ---
function getSlugFromHost(host: string) {
  const mainDomain = "gestularia.com";
  if (!host.endsWith(mainDomain)) return null;
  const subdomain = host.replace(`.${mainDomain}`, "");
  return subdomain === "www" || subdomain === "" ? null : subdomain;
}

// --- Página pública ---
interface PublicStorePageProps {
  params: { slug: string };
  headers: () => Headers;
}

export default async function PublicStorePage({ params, headers }: PublicStorePageProps) {
  const host = headers().get("host") || params.slug;
  const slug = getSlugFromHost(host) || params.slug;

  const store = await getStoreData(slug);

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <div>
          <h1 className="text-4xl font-bold">Tienda no disponible</h1>
          <p className="text-gray-600 mt-2">
            Esta tienda no existe o aún no ha sido publicada.
          </p>
        </div>
      </div>
    );
  }

  if (store.isMaintenanceMode) {
    return <MaintenancePage storeName={store.name} />;
  }

  switch (store.template) {
    case "moderno":
      return <TemplateModerno store={store} />;
    default:
      return <TemplateModerno store={store} />;
  }
}
