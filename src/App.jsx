import { useState } from 'react';
import PhotoGrid from './components/PhotoGrid';
import UploadButton from './components/UploadButton';

function App() {
  const [photoCount, setPhotoCount] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 p-4 flex justify-between items-center px-5">

        {/* IZQUIERDA: Contador de Fotos */}
        <div className="flex-1 flex flex-col items-start leading-none">
          <span className="text-[#F8BBD0] font-bold text-xl">{photoCount}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-tighter font-semibold">Fotos</span>
        </div>

        {/* CENTRO: Título */}
        <div className="text-center shrink-0">
          <h1 className="text-3xl font-parisienne text-[#F8BBD0]">XV Sofía</h1>
        </div>

        {/* DERECHA: Pulso En Vivo [cite: 2026-01-12] */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">En vivo</span>
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-black"></span>
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