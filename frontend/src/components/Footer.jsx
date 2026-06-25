import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-slate-800 rounded-full text-base">🎈</span>
          <span className="text-lg font-bold font-comfortaa text-white">Events</span>
        </div>
        <p className="text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()}  Events. "Decoramos momentos que se convierten en recuerdos." Todos los derechos reservados.
        </p>
        <div className="flex gap-4 text-xs font-semibold">
          <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link to="/admin" className="hover:text-white transition-colors">Panel Administrativo</Link>
        </div>
      </div>
    </footer>
  );
}
