import { useState } from 'react';
import PhotoGrid from './components/PhotoGrid';
import UploadButton from './components/UploadButton';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    // Fondo negro profundo y texto gris muy claro para suavidad
    <div className="min-h-screen bg-[#000000] text-[#F5F5F5] font-sans selection:bg-[#F8BBD0]/30">

      {/* Header Estilo App Nativa con desenfoque y acento Rosa Palo */}
      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 p-5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            {/* Título Serif elegante como la invitación */}
            <h1 className="text-2xl font-serif tracking-tight text-[#F5F5F5]">
              XV <span className="text-[#F8BBD0]">SOFÍA</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
              Galería de Recuerdos Mágicos
            </p>
          </div>
          {/* Indicador visual rosa suave */}
          <div className="h-2 w-2 rounded-full bg-[#F8BBD0] animate-pulse shadow-[0_0_10px_#F8BBD0]"></div>
        </div>
      </header>

      {/* Contenedor de la Galería Responsiva */}
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-80px)] px-4 py-8">
        <PhotoGrid key={refreshKey} />
      </main>

      {/* Botón de Acción Flotante */}
      <UploadButton onUploadSuccess={handleUploadSuccess} />

      {/* Gradiente sutil de fondo rosa para profundidad */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(248,187,208,0.03),transparent)] pointer-events-none"></div>
    </div>
  );
}

export default App;