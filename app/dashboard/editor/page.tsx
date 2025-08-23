"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Tipos de datos
type Product = { 
  id: string; 
  name: string; 
  price: number; 
  imageUrl?: string; 
};

type Store = { 
  id: string; 
  name: string; 
  status: string; 
  products: Product[]; 
  isMaintenanceMode: boolean;
  template?: string; 
  heroTitle?: string; 
  heroDescription?: string; 
  primaryColor?: string;
};

// Cambia esta URL por la de tu backend en producción
const API_BASE = "https://tu-backend.vercel.app/api";

// Componente Toggle de modo mantenimiento
function MaintenanceToggle({ store, onToggle }: { store: Store, onToggle: (updatedStore: Store) => void }) {
  const handleToggle = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/store/maintenance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ isMaintenanceMode: !store.isMaintenanceMode }),
    });
    if (response.ok) {
      onToggle(await response.json());
    } else {
      alert('No se pudo cambiar el modo mantenimiento.');
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="font-medium text-sm text-gray-700">Modo Mantenimiento</label>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.isMaintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${store.isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

// Página del editor
export default function EditorPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Formularios
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Editor visual
  const [template, setTemplate] = useState('moderno');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');

  // Carga inicial
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { 
      router.push('/login'); 
      return; 
    }

    const fetchStore = async () => {
      try {
        const response = await fetch(`${API_BASE}/store`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (response.ok) {
          const data: Store = await response.json();
          setStore(data);
          setTemplate(data.template || 'moderno');
          setHeroTitle(data.heroTitle || 'Bienvenidos a mi Tienda');
          setHeroDescription(data.heroDescription || 'Los mejores productos, a los mejores precios.');
          setPrimaryColor(data.primaryColor || '#0f172a');
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) { 
        console.error("Error fetching store:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchStore();
  }, [router]);
  
  // Guardar cambios de template
  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/store/template`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ template, heroTitle, heroDescription, primaryColor }),
    });
    if (response.ok) {
      alert('¡Cambios guardados!');
    } else {
      alert('Error al guardar los cambios.');
    }
  };

  // Subir imagen de producto
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    const apiKey = "5ce1f3fae30e233ec0e18cab9c9c7cb4"; // tu API Key ImgBB
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) setProductImageUrl(result.data.url);
      else throw new Error('Error al subir la imagen.');
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  // Añadir producto
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: productName, price: parseFloat(productPrice), imageUrl: productImageUrl, storeId: store.id }),
    });

    if (response.ok) {
      const newProduct = await response.json();
      setStore(prev => prev ? { ...prev, products: [...prev.products, newProduct] } : null);
      setProductName(''); 
      setProductPrice(''); 
      setProductImageUrl('');
    } else alert('Error al añadir el producto.');
  };

  // Eliminar producto
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      setStore(prev => prev ? { ...prev, products: prev.products.filter(p => p.id !== productId) } : null);
    } else {
      alert('Error al eliminar el producto.');
    }
  };

  // Publicar tienda
  const handlePublish = async () => {
    if (!store) return;
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE}/store/publish`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if(response.ok) {
      const updatedStore = await response.json();
      setStore(prev => prev ? { ...prev, ...updatedStore } : null);
      alert('¡Tienda publicada con éxito!');
    } else alert('Error al publicar la tienda.');
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Cargando...</div>;
  if (!store) return <div className="flex justify-center items-center min-h-screen">No se encontró la tienda.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 border-b pb-4">
        <div className="flex-grow">
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">&larr; Volver al Dashboard</Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-1">Editor de: {store.name}</h1>
        </div>
        {store.status === 'BUILT' && (
          <MaintenanceToggle 
            store={store} 
            onToggle={(updatedStore) => setStore(prev => prev ? { ...prev, ...updatedStore } : null)} 
          />
        )}
      </header>

      {/* Personalización */}
      <div className="my-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Personaliza tu Tienda</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título Principal</label>
            <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción Corta</label>
            <textarea value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="w-full p-2 border rounded mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Color Principal</label>
            <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 p-1 border rounded mt-1" />
          </div>
        </div>
        <button onClick={handleSaveChanges} className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Guardar Cambios</button>
      </div>

      {/* Añadir productos */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Añadir Productos</h2>
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
            <input type="text" placeholder="Ej: Camiseta de Algodón" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input type="number" step="0.01" placeholder="19.99" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {isUploading && <p className="text-sm text-blue-600 mt-2">Subiendo imagen...</p>}
            {productImageUrl && <img src={productImageUrl} alt="Vista previa" className="w-24 h-24 rounded object-cover mt-2"/>}
          </div>
          <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
            {isUploading ? 'Espere...' : 'Añadir Producto'}
          </button>
        </form>
      </div>

      {/* Lista de productos */}
      <div className="p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold mb-4">Mis Productos</h2>
         {store.products.length > 0 ? (
            <ul className="divide-y divide-gray-200">
                {store.products.map((product) => (
                    <li key={product.id} className="flex items-center justify-between py-3 gap-4">
                        <img src={product.imageUrl || 'https://via.placeholder.com/48'} alt={product.name} className="w-12 h-12 rounded object-cover"/>
                        <span className="flex-grow text-gray-800">{product.name}</span>
                        <span className="font-mono text-gray-600">${product.price.toFixed(2)}</span>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Quitar</button>
                    </li>
                ))}
            </ul>
         ) : <p className="text-gray-500 text-center py-4">Aún no has añadido ningún producto.</p>}
         {store.status !== 'BUILT' && (
            <div className="mt-6 border-t pt-6 text-center">
                <p className="text-gray-600 mb-4">Una vez que hayas personalizado tu tienda y añadido tus productos, puedes publicarla.</p>
                <button onClick={handlePublish} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">Publicar Tienda</button>
            </div>
         )}
      </div>
    </div>
  );
}
