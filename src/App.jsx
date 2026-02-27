import { useState } from 'react';
import PhotoGrid from './components/PhotoGrid';
import UploadButton from './components/UploadButton';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [photoCount, setPhotoCount] = useState(0); // Estado para el chip

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#F5F5F5] font-sans selection:bg-[#F8BBD0]/30">

      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">

        

          <div className="text-center">
            <h1 className="text-2xl font-serif tracking-tight text-[#F5F5F5]">
              XV <span className="text-[#F8BBD0]">SOFÍA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Galería Mágica
            </p>
          </div>
          {/* Chip de Total de Fotos a la izquierda */}
          <div className="flex flex-col items-start leading-none shrink-0 min-w-[40px]">
            <span className="text-[#F8BBD0] font-bold text-lg">{photoCount}</span>
            <span className="text-[9px] uppercase tracking-tighter text-gray-500 font-bold">Fotos</span>
          </div>
          {/* Indicador "En Vivo" a la derecha */}
          <div className="flex items-center gap-2 justify-end min-w-[40px]">
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold hidden xs:block">Live</span>
            <div className="h-2 w-2 rounded-full bg-[#F8BBD0] animate-pulse shadow-[0_0_10px_#F8BBD0]"></div>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto min-h-[calc(100vh-80px)] px-4 py-8">
        {/* Pasamos setPhotoCount para actualizar el chip desde la grilla */}
        <PhotoGrid key={refreshKey} setPhotoCount={setPhotoCount} />
      </main>

      <UploadButton onUploadSuccess={handleUploadSuccess} />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(248,187,208,0.03),transparent)] pointer-events-none"></div>
    </div>
  );
}

export default App;