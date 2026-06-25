import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ShieldCheck, UserCheck } from 'lucide-react';

export default function AboutUs() {
  const pillars = [
    {
      icon: <Heart className="text-pastel-pink-dark" size={20} />,
      title: 'Mucho Cariño',
      desc: 'Cada decoración la diseñamos y armamos como si fuera para nuestra propia familia.'
    },
    {
      icon: <Sparkles className="text-pastel-yellow-dark" size={20} />,
      title: 'Creatividad',
      desc: 'Diseños temáticos únicos adaptados a lo que tus niños y tú imaginen.'
    },
    {
      icon: <ShieldCheck className="text-pastel-blue-dark" size={20} />,
      title: 'Confianza y Puntualidad',
      desc: 'Llegamos a tiempo para que tú solo te preocupes por disfrutar de la fiesta.'
    },
    {
      icon: <UserCheck className="text-pastel-green-dark" size={20} />,
      title: 'Atención Cercana',
      desc: 'Trato directo de familia a familia. Nos adaptamos a tu presupuesto.'
    }
  ];

  return (
    <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-pastel-yellow-light/50 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDuration: '9s' }} />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-pastel-blue-light/50 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Collage of details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl shadow-lg border-4 border-white hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                <img
                  src="/images/decoracion_babyshower.png"
                  alt="Montaje de globos"
                  className="object-cover h-52 w-full"
                />
              </div>
              <div className="glass-pink p-6 rounded-3xl border border-pink-200/50 text-center hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                <span className="text-4xl block animate-bounce" style={{ animationDuration: '3s' }}>🏡</span>
                <h4 className="font-bold text-slate-800 mt-3 font-comfortaa">Negocio Local</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Nacimos y crecemos en nuestra comunidad.</p>
              </div>
            </div>
            <div className="space-y-6 pt-10">
              <div className="glass-blue p-6 rounded-3xl border border-blue-200/50 text-center hover:scale-[1.02] transition-transform duration-300 shadow-sm">
                <span className="text-4xl block animate-bounce" style={{ animationDuration: '3.5s' }}>🥳</span>
                <h4 className="font-bold text-slate-800 mt-3 font-comfortaa">+100 Fiestas</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">Momentos felices y recuerdos inolvidables.</p>
              </div>
              <div className="overflow-hidden rounded-3xl shadow-lg border-4 border-white hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                <img
                  src="/images/decoracion_bautizo.png"
                  alt="Mobiliario cilindros"
                  className="object-cover h-52 w-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xs font-extrabold text-pastel-pink-dark tracking-widest uppercase bg-pink-50 border border-pink-200/30 px-3 py-1 rounded-full inline-block">¿Quiénes Somos?</h2>
              <h3 className="text-3xl sm:text-4xl font-bold font-comfortaa text-slate-800 leading-tight">
                Nuestra historia de esfuerzo y dedicación
              </h3>
            </div>
            
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Somos un emprendimiento local dedicado a crear decoraciones únicas para eventos familiares. 
              Nos apasiona ayudar a nuestros clientes a celebrar momentos importantes con creatividad, 
              dedicación y mucho cariño. 
            </p>
            <p className="text-slate-600 leading-relaxed text-sm">
              Lo que comenzó como una pequeña idea en casa para decorar los cumpleaños de nuestros propios hijos, 
              hoy se ha convertido en un proyecto familiar estructurado y confiable. Creemos que cada detalle cuenta y que 
              no se necesita un gran presupuesto para tener una celebración mágica y memorable.
            </p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {pillars.map((p, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 bg-slate-50/50 hover:bg-slate-100/70 border border-slate-100 hover:border-slate-200/60 rounded-2xl transition-all duration-300 hover:shadow-sm">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100/50 flex-shrink-0">{p.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm font-comfortaa">{p.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
