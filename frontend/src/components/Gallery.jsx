import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Gallery() {
  const categories = ['Todos', 'Cumpleaños', 'Baby Shower', 'Grados', 'Bautizos', 'Mobiliario'];

  const demoItems = [
    {
      id: 1,
      src: '/images/decoracion_cumpleanos.png',
      title: 'Cumpleaños Infantil Selva Pastel',
      category: 'Cumpleaños',
      desc: 'Arco orgánico de globos con cilindros temáticos.'
    },
    {
      id: 2,
      src: '/images/decoracion_babyshower.png',
      title: 'Baby Shower Dulce Oso',
      category: 'Baby Shower',
      desc: 'Fondo de madera con nubes flotantes y peluches.'
    },
    {
      id: 3,
      src: '/images/decoracion_bautizo.png',
      title: 'Bautizo Eucalipto Elegante',
      category: 'Bautizos',
      desc: 'Aro dorado con flores naturales y mesas cilíndricas.'
    },
    {
      id: 4,
      src: '/images/decoracion_cumpleanos.png',
      title: 'Mobiliario Cilindros y Fondos',
      category: 'Mobiliario',
      desc: 'Juego de cilindros de colores pastel con paneles listos para personalizar.'
    },
    {
      id: 5,
      src: '/images/decoracion_babyshower.png',
      title: 'Baby Shower Nubes de Ensueño',
      category: 'Baby Shower',
      desc: 'Montaje orgánico de globos rosados, blancos y lila.'
    },
    {
      id: 6,
      src: '/images/decoracion_bautizo.png',
      title: 'Primera Comunión Calidez y Luz',
      category: 'Bautizos',
      desc: 'Fondo sobrio con velas decorativas y detalles en dorado.'
    },
    {
      id: 7,
      src: '/images/decoracion_gradosos.png',
      title: 'Cumpleaños Infantil Selva Pastel',
      category: 'Grados',
      desc: 'Arco orgánico de globos con cilindros temáticos.'
    }
  ];

  const [galleryItems, setGalleryItems] = useState(demoItems);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeImageIdx, setActiveImageIdx] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_URL}/api/galeria`);
      if (!res.ok) throw new Error('Error al obtener galería');
      const data = await res.json();
      if (data && data.length > 0) {
        setGalleryItems(data);
      }
    } catch (err) {
      console.warn('API offline o error. Usando galería demo estática local.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'Todos'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index) => {
    setActiveImageIdx(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setActiveImageIdx(null);
    setIsZoomed(false);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setActiveImageIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setActiveImageIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  const activeItem = activeImageIdx !== null ? filteredItems[activeImageIdx] : null;

  return (
    <section id="galeria" className="py-24 bg-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pastel-blue-light/40 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pastel-pink-light/40 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-xs font-extrabold text-pastel-pink-dark tracking-widest uppercase bg-pink-50 border border-pink-200/30 px-3 py-1 rounded-full inline-block">Nuestra Galería</h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-comfortaa text-slate-800">
            Trabajos reales hechos con amor
          </h3>
          <p className="text-slate-600 text-sm">
            Cada foto representa un evento real armado por nosotros. Filtra por categoría para ver ejemplos de lo que podemos crear para ti.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-pastel-blue-dark via-pastel-purple-dark to-pastel-pink-dark text-white shadow-md shadow-purple-100/50 scale-105'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 border border-slate-200/40 hover:scale-102'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-pastel-blue-dark" size={36} />
            <p className="text-sm text-slate-500 font-medium">Cargando fotos de la galería...</p>
          </div>
        ) : (
          /* Gallery Grid */
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl shadow-sm hover:shadow-xl border border-slate-100/60 bg-slate-50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden relative">
                    <img
                      src={item.src}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Glass Overlay on hover */}
                    <div className="absolute inset-0 bg-slate-900/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-4 bg-white/20 backdrop-blur-md rounded-full shadow-lg text-white scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/30">
                        <ZoomIn size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="p-5 bg-white border-t border-slate-50">
                    <span className="text-[10px] font-extrabold text-pastel-pink-dark uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-2 font-comfortaa">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state if category has no items */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">No hay fotos en esta categoría por el momento.</p>
          </div>
        )}

        {/* Lightbox / Modal */}
        <AnimatePresence>
          {activeItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
            >
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-4 text-white z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
                  className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors focus:outline-none cursor-pointer"
                  title={isZoomed ? "Reducir zoom" : "Ampliar zoom"}
                >
                  {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors focus:outline-none cursor-pointer"
                  title="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Left */}
              <button
                onClick={handlePrev}
                className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all z-10 focus:outline-none cursor-pointer hover:scale-105"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Image Container */}
              <div className="max-w-4xl max-h-[70vh] w-full flex items-center justify-center overflow-hidden p-2">
                <motion.img
                  key={activeItem.id}
                  src={activeItem.src}
                  alt={activeItem.title}
                  animate={{ scale: isZoomed ? 1.5 : 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
                  className={`max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border-4 border-white/10 cursor-pointer ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                />
              </div>

              {/* Image Details Footer */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white px-6 py-4 rounded-3xl glass border border-white/15 max-w-xl w-[calc(100%-3rem)] shadow-xl">
                <span className="text-[10px] uppercase font-extrabold text-pastel-pink-dark tracking-widest bg-pink-100/90 px-3 py-1 rounded-full">
                  {activeItem.category}
                </span>
                <h4 className="text-base sm:text-lg font-bold mt-3.5 font-comfortaa">{activeItem.title}</h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-medium">{activeItem.desc}</p>
                <p className="text-[10px] text-slate-400 mt-3 font-bold">
                  {activeImageIdx + 1} de {filteredItems.length}
                </p>
              </div>

              {/* Navigation Right */}
              <button
                onClick={handleNext}
                className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-all z-10 focus:outline-none cursor-pointer hover:scale-105"
              >
                <ChevronRight size={24} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
