import { useState } from 'react';
import PhotoGrid from './components/PhotoGrid';
import UploadButton from './components/UploadButton';

function App() {
  // Estado para forzar el refresco de la galería cuando se sube una foto con éxito
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = (info) => {
    console.log("Imagen lista en Cloudinary:", info.secure_url);
    // Cambiamos la key para que el componente PhotoGrid se vuelva a montar/ejecutar
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#D4AF37]/30">

      {/* Header Estilo App Nativa */}
      <header className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              XV <span className="text-[#D4AF37]">SOFÍA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Galería en Vivo
            </p>
          </div>
          {/* Indicador visual de que es una zona segura */}
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
        </div>
      </header>

      {/* Contenedor de la Galería */}
      <main className="max-w-2xl mx-auto min-h-[calc(100vh-80px)]">
        <PhotoGrid key={refreshKey} />
      </main>

      {/* Footer / Botón de Acción */}
      <UploadButton onUploadSuccess={handleUploadSuccess} />

      {/* Gradiente sutil de fondo para profundidad UX */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.05),transparent)] pointer-events-none"></div>
    </div>
  );
}

export default App;