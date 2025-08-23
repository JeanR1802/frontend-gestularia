"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- Tipo de Tienda ---
type Store = {
  id: string;
  name: string;
  slug: string;
  status: string;
};

// --- Componente StoreCard ---
function StoreCard({ store }: { store: Store }) {
  const isBuilt = store.status === "BUILT";
  return (
    <div className="p-6 bg-white border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">{store.name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Estado:{" "}
        <span
          className={`font-semibold ${
            isBuilt ? "text-green-600" : "text-yellow-600"
          }`}
        >
          {isBuilt ? "Publicada" : "No Construida"}
        </span>
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Link
          href="/dashboard/editor"
          className="block w-full text-center py-2 text-white rounded-lg bg-indigo-600 hover:bg-indigo-700"
        >
          {isBuilt ? "Editar Tienda" : "Construir Tienda"}
        </Link>
        {isBuilt && (
          <Link
            href={`https://backendg-seven.vercel.app/tiendas/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Visitar Tienda
          </Link>
        )}
      </div>
    </div>
  );
}

// --- Componente CreateStoreForm ---
function CreateStoreForm({ onStoreCreated }: { onStoreCreated: (newStore: Store) => void }) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión primero.");
      return;
    }

    try {
      const response = await fetch("https://backendg-seven.vercel.app/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newStore = await response.json();
        onStoreCreated(newStore);
      } else {
        const err = await response.json();
        alert(err.error || "Error al crear la tienda.");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Crea tu primera tienda</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de tu Tienda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-4"
          required
        />
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Generar Tienda
        </button>
      </form>
    </div>
  );
}

// --- Componente Principal DashboardPage ---
export default function DashboardPage() {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchStore = async () => {
      try {
        const response = await fetch("https://backendg-seven.vercel.app/api/store", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStore(data);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          console.error("Error al obtener la tienda", response.statusText);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
      setIsLoading(false);
    };

    fetchStore();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">Cargando...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mi Dashboard</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="text-sm text-gray-600 hover:underline"
          >
            Cerrar Sesión
          </button>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        {store ? (
          <StoreCard store={store} />
        ) : (
          <CreateStoreForm onStoreCreated={(newStore) => setStore(newStore)} />
        )}
      </main>
    </div>
  );
}
