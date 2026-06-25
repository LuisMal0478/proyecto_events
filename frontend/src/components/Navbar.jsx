import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 glass rounded-2xl sm:rounded-full shadow-md transition-all duration-300 border border-white/50 hover:border-pastel-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="p-2 bg-pink-100 rounded-full text-lg group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                🎈
              </span>
              <span className="text-xl sm:text-2xl font-bold font-comfortaa tracking-wide bg-gradient-to-r from-pastel-blue-dark via-pastel-purple-dark to-pastel-pink-dark bg-clip-text text-transparent">
                Events
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => handleNavClick('inicio')} className="relative text-slate-600 hover:text-pastel-blue-dark font-semibold transition-colors cursor-pointer group py-1">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pastel-blue-dark transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleNavClick('nosotros')} className="relative text-slate-600 hover:text-pastel-blue-dark font-semibold transition-colors cursor-pointer group py-1">
              Nosotros
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pastel-blue-dark transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleNavClick('servicios')} className="relative text-slate-600 hover:text-pastel-blue-dark font-semibold transition-colors cursor-pointer group py-1">
              Servicios
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pastel-blue-dark transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleNavClick('galeria')} className="relative text-slate-600 hover:text-pastel-blue-dark font-semibold transition-colors cursor-pointer group py-1">
              Galería
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pastel-blue-dark transition-all duration-300 group-hover:w-full" />
            </button>
            <button onClick={() => handleNavClick('contacto')} className="relative text-slate-600 hover:text-pastel-blue-dark font-semibold transition-colors cursor-pointer group py-1">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pastel-blue-dark transition-all duration-300 group-hover:w-full" />
            </button>
            <Link to="/admin" className="text-xs px-3.5 py-1.8 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold transition-all border border-slate-200/50">
              Panel Admin
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById('sofi-trigger');
                if (element) element.click();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-pastel-pink-dark hover:bg-pink-600 text-white rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageSquare size={16} />
              Cotizar
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/admin" className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-semibold border border-slate-200/50">
              Admin
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-100/50 rounded-b-2xl px-4 py-3">
          <div className="flex flex-col gap-1 text-center">
            <button
              onClick={() => handleNavClick('inicio')}
              className="block w-full px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-pastel-blue-light hover:text-pastel-blue-dark transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('nosotros')}
              className="block w-full px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-pastel-blue-light hover:text-pastel-blue-dark transition-colors cursor-pointer"
            >
              Nosotros
            </button>
            <button
              onClick={() => handleNavClick('servicios')}
              className="block w-full px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-pastel-blue-light hover:text-pastel-blue-dark transition-colors cursor-pointer"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick('galeria')}
              className="block w-full px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-pastel-blue-light hover:text-pastel-blue-dark transition-colors cursor-pointer"
            >
              Galería
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="block w-full px-3 py-2.5 rounded-xl text-base font-semibold text-slate-700 hover:bg-pastel-blue-light hover:text-pastel-blue-dark transition-colors cursor-pointer"
            >
              Contacto
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                const element = document.getElementById('sofi-trigger');
                if (element) element.click();
              }}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-pastel-pink-dark hover:bg-pink-600 text-white rounded-full font-bold shadow transition-colors cursor-pointer"
            >
              <MessageSquare size={16} />
              Cotizar con Sofi
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
