import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenidos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          La forma más sencilla de lanzar tu negocio online.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Iniciar Sesión
          </Link>
          <Link href="/register" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
