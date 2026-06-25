import React from 'react';
import { motion } from 'framer-motion';
import { Cake, Sparkles, Baby, Milestone, Layout, Box, Flower } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Decoraciones Infantiles y Temáticas',
      desc: 'Tus personajes favoritos adaptados en sets mágicos con globos, paneles e iluminación.',
      icon: <Sparkles size={24} className="text-pastel-blue-dark" />,
      color: 'bg-pastel-blue-light border-pastel-blue',
      glow: 'glow-blue',
      badge: '¡El favorito!'
    },
    {
      title: 'Cumpleaños',
      desc: 'Decoramos cumpleaños de todas las edades con temáticas alegres y personalizadas.',
      icon: <Cake size={24} className="text-pastel-yellow-dark" />,
      color: 'bg-pastel-yellow-light border-pastel-yellow',
      glow: 'glow-yellow',
    },
    {
      title: 'Baby Shower',
      desc: 'Escenarios tiernos con osos, nubes y globos en tonos pastel para dar la bienvenida al bebé.',
      icon: <Baby size={24} className="text-pastel-pink-dark" />,
      color: 'bg-pastel-pink-light border-pastel-pink',
      glow: 'glow-pink',
    },
    {
      title: 'Bautizos y Primeras Comuniones',
      desc: 'Altares y fondos decorativos elegantes con flores, cruz y colores sobrios/blancos.',
      icon: <Milestone size={24} className="text-pastel-green-dark" />,
      color: 'bg-pastel-green-light border-pastel-green',
      glow: 'glow-green',
    },
    {
      title: 'Fondos Decorativos',
      desc: 'Estructuras circulares, cuadradas y paneles de madera o metal listos para decorar.',
      icon: <Layout size={24} className="text-pastel-purple-dark" />,
      color: 'bg-pastel-purple-light border-pastel-purple',
      glow: 'glow-purple',
    },
    {
      title: 'Alquiler de Mobiliario',
      desc: 'Mesas rectangulares, juegos de cilindros decorativos en colores y sillas para tus invitados.',
      icon: <Box size={24} className="text-pastel-blue-dark" />,
      color: 'bg-pastel-blue-light border-pastel-blue',
      glow: 'glow-blue',
    },
    {
      title: 'Centros de Mesa y Detalles',
      desc: 'Diseños florales, globos y arreglos personalizados que le dan el toque final a tus mesas.',
      icon: <Flower size={24} className="text-pastel-yellow-dark" />,
      color: 'bg-pastel-yellow-light border-pastel-yellow',
      glow: 'glow-yellow',
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-pastel-pink-light/40 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '9s' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pastel-yellow-light/40 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '7s', animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-extrabold text-pastel-pink-dark tracking-widest uppercase bg-pink-50 border border-pink-200/30 px-3 py-1 rounded-full inline-block">Nuestros Servicios</h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-comfortaa text-slate-800">
            Todo lo necesario para tu fiesta
          </h3>
          <p className="text-slate-600 text-sm">
            Ofrecemos servicios de decoración integral y alquiler de mobiliario individual para adaptarnos exactamente a lo que necesitas.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={`relative p-8 rounded-3xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 ${service.glow} cursor-pointer group`}
            >
              {service.badge && (
                <span className="absolute top-4 right-4 text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1 bg-pastel-pink-dark text-white rounded-full shadow-sm animate-pulse">
                  {service.badge}
                </span>
              )}
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${service.color} border transition-transform duration-300 group-hover:scale-110`}>
                  {service.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800 font-comfortaa">{service.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{service.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consultar tarifas</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const trigger = document.getElementById('sofi-trigger');
                    if (trigger) trigger.click();
                  }}
                  className="text-xs text-pastel-blue-dark font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Cotizar con Sofi <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
