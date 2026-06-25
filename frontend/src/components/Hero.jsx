import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';

export default function Hero() {
  const handleQuoteClick = () => {
    const trigger = document.getElementById('sofi-trigger');
    if (trigger) trigger.click();
  };

  const handleGalleryClick = () => {
    const gallery = document.getElementById('galeria');
    if (gallery) gallery.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="inicio" className="relative min-h-screen pt-24 sm:pt-28 flex items-center overflow-hidden bg-gradient-to-br from-pastel-blue-light/60 via-white to-pastel-pink-light/60">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-[5%] w-80 h-80 bg-pastel-yellow-light/80 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-[5%] w-[450px] h-[450px] bg-pastel-blue-light/80 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-pastel-purple-light/50 rounded-full filter blur-3xl animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col text-center lg:text-left space-y-6 max-w-xl mx-auto lg:mx-0"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 self-center lg:self-start px-4 py-1.5 bg-white/80 backdrop-blur border border-pink-200/60 text-pastel-pink-dark rounded-full text-xs font-bold shadow-sm animate-float" style={{ animationDuration: '5s' }}>
              <span>🌟</span> Emprendimiento Familiar
            </div>
 
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-comfortaa leading-tight text-slate-800 tracking-tight">
              Hacemos de tu celebración un{' '}
              <span className="bg-gradient-to-r from-pastel-blue-dark via-pastel-purple-dark to-pastel-pink-dark bg-clip-text text-transparent block sm:inline">
                momento especial
              </span>
            </h1>
 
            {/* Subtitle */}
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Decoraciones temáticas, alquiler de mobiliario y detalles únicos para cumpleaños, baby showers y eventos familiares.
            </p>
 
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={handleQuoteClick}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-pastel-pink-dark hover:bg-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-pink-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <MessageSquare size={20} />
                Cotizar Evento
              </button>
              <button
                onClick={handleGalleryClick}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/80 border border-slate-200 hover:border-pastel-blue text-slate-700 hover:text-pastel-blue-dark rounded-full font-bold hover:shadow-md hover:-translate-y-1 transition-all duration-300 backdrop-blur cursor-pointer"
              >
                <ImageIcon size={20} />
                Ver Trabajos
              </button>
            </div>
          </motion.div>
 
          {/* Right Visual Column (Collage/Slider) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Collage Box */}
            <div className="grid grid-cols-12 gap-4 w-full max-w-lg">
              {/* Main Image */}
              <div className="col-span-8 overflow-hidden rounded-3xl shadow-xl border-[6px] border-white hover:scale-[1.03] hover:-rotate-1 transition-all duration-500 -rotate-2 cursor-pointer">
                <img
                  src="/images/decoracion_cumpleanos.png"
                  alt="Decoración de Cumpleaños Infantil"
                  className="w-full h-72 object-cover"
                />
              </div>
              
              {/* Small Top Right */}
              <div className="col-span-4 overflow-hidden rounded-3xl shadow-lg border-[6px] border-white hover:scale-[1.03] hover:rotate-2 transition-all duration-500 rotate-1 cursor-pointer self-end">
                <img
                  src="/images/decoracion_babyshower.png"
                  alt="Decoración Baby Shower"
                  className="w-full h-36 object-cover"
                />
              </div>
 
              {/* Small Bottom Left */}
              <div className="col-span-4 overflow-hidden rounded-3xl shadow-lg border-[6px] border-white hover:scale-[1.03] hover:-rotate-2 transition-all duration-500 rotate-2 cursor-pointer">
                <img
                  src="/images/decoracion_bautizo.png"
                  alt="Decoración de Bautizo"
                  className="w-full h-36 object-cover"
                />
              </div>
 
              {/* Text Badge Card */}
              <div className="col-span-8 glass-pink p-5 rounded-3xl shadow-lg border border-pink-200/50 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                <div className="flex gap-3">
                  <span className="text-3xl">💝</span>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base font-comfortaa">Confianza y Cariño</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">Adaptamos nuestros diseños a tus sueños y presupuesto.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-pastel-pink-dark font-bold mt-4 pt-3 border-t border-pink-200/30">
                  <span className="flex items-center gap-1">✨ 100% Personalizado</span>
                  <span>⭐ Local</span>
                </div>
              </div>
            </div>
 
            {/* Little floating element */}
            <div className="absolute -top-6 -left-6 bg-yellow-100/90 backdrop-blur border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-xs font-bold shadow-md animate-bounce cursor-default">
              🎈 ¡Nuevas temáticas 2026!
            </div>
          </motion.div>
 
        </div>
      </div>
    </section>
  );
}
