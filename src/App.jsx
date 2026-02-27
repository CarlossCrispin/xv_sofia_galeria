import { useState, useEffect } from 'react';
import PhotoGrid from './components/PhotoGrid';
import UploadButton from './components/UploadButton';

function App() {
  const [photoCount, setPhotoCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header con Contador */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center px-6">
        <div className="flex-1"></div> {/* Espaciador para centrar el título */}

        <div className="text-center">
          <h1 className="text-3xl font-parisienne text-[#F8BBD0]">XV Sofía</h1>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-500">Galería Mágica</p>
        </div>

        {/* Contador de Imágenes con estilo UX Mobile [cite: 2026-01-12] */}
        <div className="flex-1 flex justify-end">
          <div className="bg-[#F8BBD0]/10 border border-[#F8BBD0]/30 rounded-full px-3 py-1 flex items-center gap-2">
            <span className="text-[#F8BBD0] font-bold text-sm">{photoCount}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Fotos</span>
          </div>
        </div>
      </header>

      <main className="pb-32">
        <PhotoGrid setPhotoCount={setPhotoCount} />
      </main>

      <UploadButton onUploadSuccess={() => window.location.reload()} />
    </div>
  );
}

export default App;