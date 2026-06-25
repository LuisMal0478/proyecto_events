import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';

const FacebookIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Contact() {
  const contactDetails = [
    {
      icon: <Phone className="text-pastel-blue-dark" size={24} />,
      label: 'WhatsApp',
      value: '+57 3018922819',
      link: 'https://wa.me/573018922819',
      glow: 'glow-blue'
    },
    {
      icon: <InstagramIcon className="text-pastel-pink-dark" />,
      label: 'Instagram',
      value: '@evenets_valledupar',
      link: 'https://instagram.com',
      glow: 'glow-pink'
    },
    {
      icon: <FacebookIcon className="text-pastel-blue-dark" />,
      label: 'Facebook',
      value: 'Evenets Alquiler y Decoración',
      link: 'https://facebook.com',
      glow: 'glow-blue'
    },
    {
      icon: <MapPin className="text-pastel-green-dark" size={24} />,
      label: 'Ubicación',
      value: 'Valledupar, Colombia',
      link: 'https://maps.google.com',
      glow: 'glow-green'
    },
    {
      icon: <Clock className="text-pastel-yellow-dark" size={24} />,
      label: 'Horario de Atención',
      value: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
      link: null,
      glow: 'glow-yellow'
    }
  ];

  return (
    <section id="contacto" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-pastel-pink-light/30 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pastel-blue-light/30 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '10s', animationDelay: '1.5s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-extrabold text-pastel-pink-dark tracking-widest uppercase bg-pink-50 border border-pink-200/30 px-3 py-1 rounded-full inline-block">Contacto</h2>
          <h3 className="text-3xl sm:text-4xl font-bold font-comfortaa text-slate-800">
            ¡Hablemos de tu próximo evento!
          </h3>
          <p className="text-slate-600 text-sm">
            Estamos disponibles para responder tus dudas y coordinar la decoración de tus sueños. Escríbenos por cualquiera de nuestros medios.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactDetails.map((item, idx) => {
            const isLink = !!item.link;
            const CardComponent = isLink ? 'a' : 'div';
            const extraProps = isLink ? { href: item.link, target: '_blank', rel: 'noreferrer' } : {};

            return (
              <CardComponent
                key={idx}
                {...extraProps}
                className={`p-8 bg-white rounded-3xl border border-slate-100/60 shadow-sm flex items-start gap-4 transition-all duration-300 ${item.glow} group ${
                  isLink ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-slate-200' : ''
                }`}
              >
                <div className="p-3.5 bg-slate-50 group-hover:bg-white rounded-2xl shadow-sm border border-slate-100/30 transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{item.label}</h4>
                  <p className="font-bold text-slate-800 text-sm sm:text-base mt-2 font-comfortaa break-words">{item.value}</p>
                  {isLink && (
                    <span className="text-xs text-pastel-blue-dark hover:underline font-extrabold mt-3.5 flex items-center gap-1 transition-colors">
                      Escribir o ir <span className="group-hover:translate-x-1 transition-transform duration-200">&rarr;</span>
                    </span>
                  )}
                </div>
              </CardComponent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
