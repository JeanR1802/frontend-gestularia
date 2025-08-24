// app/_sites/[subdomain]/page.tsx

import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation'; // Importamos notFound

// Define cómo se ven los datos de una tienda.
// ¡Asegúrate de que coincida con tu tabla en Supabase!
type TiendaData = {
  id: number;
  nombre_tienda: string;
  color_tema: string;
  slug: string; // La columna con el identificador del subdominio
  // ... más campos
};

// --- LA MAGIA DEL APP ROUTER ---
// La página ahora es una función "async" que recibe "params"
export default async function PaginaTienda({ params }: { params: { subdomain: string } }) {
  // 1. Obtenemos el subdominio de los parámetros de la URL
  const { subdomain } = params;

  // 2. Conexión a Supabase
  // REEMPLAZA con tu URL y tu Anon Key.
  // Es recomendable usar variables de entorno (process.env)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'TU_URL_DE_SUPABASE';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'TU_ANON_KEY_DE_SUPABASE';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 3. Buscamos en la base de datos
  // CAMBIA 'tiendas' por el nombre de tu tabla.
  // CAMBIA 'slug' por el nombre de tu columna para el subdominio.
  const { data: tienda, error } = await supabase
    .from('tiendas')         // <-- NOMBRE DE TU TABLA
    .select('*')
    .eq('slug', subdomain)   // <-- NOMBRE DE TU COLUMNA
    .single();

  // Si hubo un error o no se encontró la tienda, llamamos a la función notFound()
  // que automáticamente mostrará la página 404 de Next.js.
  if (error || !tienda) {
    notFound();
  }

  // 4. Si encontramos la tienda, renderizamos el HTML
  return (
    <div style={{ backgroundColor: tienda.color_tema, minHeight: '100vh', padding: '2rem' }}>
      <h1>Bienvenido a {tienda.nombre_tienda}</h1>
      <p>Este sitio pertenece al subdominio: {tienda.slug}</p>
      {/* Aquí construyes el resto de la página de la tienda */}
    </div>
  );
}