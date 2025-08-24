// app/_sites/[subdomain]/page.tsx

// ¡IMPORTANTE! Hemos quitado el "use client"; esta página ahora se renderiza en el servidor.
import React from "react";
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// --- Tus componentes de plantillas no necesitan cambios ---
// Puedes dejarlos en este archivo o moverlos a su propio archivo e importarlos.
function MaintenancePage({ storeName }: { storeName: string }) { /* ... tu código ... */ }
function TemplateModerno({ store }: { store: any }) { /* ... tu código ... */ }

// --- Página Pública (Versión Servidor) ---
// La página es una función async que recibe los params del subdominio
export default async function PublicStorePage({ params }: { params: { subdomain: string } }) {
  const slug = params.subdomain; // El subdominio viene directamente de la carpeta [subdomain]

  // --- Conexión directa a Supabase (más eficiente) ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: store, error } = await supabase
    .from('tiendas') // Asegúrate que el nombre de la tabla sea correcto
    .select('*')
    .eq('slug', slug) // Y que la columna del slug sea correcta
    .single();

  // Si no se encuentra la tienda, muestra un 404
  if (error || !store) {
    // console.error('Error o tienda no encontrada para el slug:', slug, error);
    notFound();
  }

  // Tu lógica para mostrar mantenimiento o la plantilla correcta se mantiene igual. ¡Es perfecta!
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

// ... aquí abajo puedes pegar el código de tus componentes MaintenancePage y TemplateModerno ...
// function MaintenancePage({ storeName }: { storeName: string }) { ... }
// function TemplateModerno({ store }: { store: any }) { ... }