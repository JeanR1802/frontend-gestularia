// app/_sites/[subdomain]/page.tsx

import React from "react";
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// --- Tus componentes de plantillas están perfectos, no necesitan cambios ---
// Puedes dejarlos aquí o moverlos a otro archivo e importarlos.
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
        {/* Aquí puedes añadir la lógica para mostrar productos si la tienes */}
         <p className="text-center text-gray-500">No hay productos disponibles.</p>
      </main>
    </div>
  );
}


// --- Página Pública Corregida ---
// Ahora la función espera 'subdomain' para coincidir con el nombre de la carpeta
export default async function PublicStorePage({ params }: { params: { subdomain: string } }) {
  
  // 1. Usamos 'subdomain' que viene de los params
  const slug = params.subdomain;

  // 2. Conexión directa y segura a Supabase desde el servidor
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 3. Buscamos en la tabla 'Store' donde la columna 'slug' coincida
  const { data: store, error } = await supabase
    .from('Store')
    .select('*')
    .eq('slug', slug) // Buscamos usando el subdominio que nos llegó
    .single();

  // 4. Si hay un error o no se encuentra, mostramos un 404
  if (error || !store) {
    notFound();
  }

  // 5. Tu lógica para mostrar la plantilla correcta se mantiene igual
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