import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Phone, RefreshCw } from 'lucide-react';

export default function SofiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    evento: '',
    fecha_evento: '',
    invitados: '',
    ciudad: '',
    presupuesto: '',
    decoracion: '',
  });

  const chatEndRef = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Initial message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: 'sofi',
          text: 'Hola 👋 Soy Sofi. Estoy aquí para ayudarte a encontrar la decoración perfecta para tu celebración. ¿Qué tipo de evento deseas realizar?'
        }
      ]);
    }
  }, [isOpen]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender, text }]);
  };

  const handleSelectOption = (value, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    addMessage('user', value);

    setTimeout(() => {
      triggerNextStep(value, fieldName);
    }, 600);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const value = inputValue.trim();
    setInputValue('');
    addMessage('user', value);

    let fieldName = '';
    if (step === 1) fieldName = 'nombre';
    else if (step === 2) fieldName = 'fecha_evento';
    else if (step === 3) fieldName = 'ciudad';
    else if (step === 4) fieldName = 'invitados';
    else if (step === 5) fieldName = 'decoracion';
    else if (step === 6) fieldName = 'presupuesto';
    else if (step === 7) fieldName = 'telefono';

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    setTimeout(() => {
      triggerNextStep(value, fieldName);
    }, 600);
  };

  const triggerNextStep = (lastValue, lastField) => {
    const nextStep = step + 1;
    setStep(nextStep);

    if (nextStep === 1) {
      addMessage('sofi', '¡Excelente elección! ¿Cuál es tu nombre? 😊');
    } else if (nextStep === 2) {
      addMessage('sofi', `¡Mucho gusto, ${lastValue}! ¿Para qué fecha tienes planeado tu evento? 📅`);
    } else if (nextStep === 3) {
      addMessage('sofi', '¿En qué ciudad se realizará? (Ofrecemos servicio en Valledupar y alrededores) 📍');
    } else if (nextStep === 4) {
      addMessage('sofi', '¿Aproximadamente cuántos invitados asistirás? 👥');
    } else if (nextStep === 5) {
      addMessage('sofi', '¿Tienes alguna temática o decoración deseada en mente? (Ej. Paw Patrol, Selva, Globo aerostático, o cuéntanos tu idea) 🎈');
    } else if (nextStep === 6) {
      addMessage('sofi', '¿Cuál es tu presupuesto aproximado para la decoración? 💰');
    } else if (nextStep === 7) {
      addMessage('sofi', 'Por último, déjanos tu número de teléfono de contacto para coordinar los detalles. 📱');
    } else if (nextStep === 8) {
      finishConversation();
    }
  };

  const finishConversation = async () => {
    addMessage('sofi', '¡Perfecto! Estoy procesando tu cotización...');

    // Extract guests number
    let numericGuests = 30;
    if (formData.invitados.includes('30 a 60')) numericGuests = 45;
    else if (formData.invitados.includes('60 a 100')) numericGuests = 80;
    else if (formData.invitados.includes('Más de 100')) numericGuests = 120;
    else if (formData.invitados.includes('Menos de 30')) numericGuests = 20;
    else {
      const match = formData.invitados.match(/\d+/);
      if (match) numericGuests = parseInt(match[0]);
    }

    const requestData = {
      nombre: formData.nombre,
      telefono: formData.telefono,
      evento: formData.evento,
      fecha_evento: formData.fecha_evento,
      invitados: numericGuests,
      ciudad: formData.ciudad,
      presupuesto: formData.presupuesto,
    };

    // Save to database
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/cotizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
    } catch (err) {
      console.warn('Backend server offline. Reserving via WhatsApp.', err);
    }

    setTimeout(() => {
      addMessage('sofi', '✨ ¡Todo listo! Aquí tienes el resumen de tu solicitud:');
      addMessage('sofi', 'SUMMARY_CARD');
    }, 1000);
  };

  const handleWhatsAppSend = () => {
    const message = `Hola, me gustaría solicitar una cotización.
Nombre: ${formData.nombre}
Evento: ${formData.evento}
Temática: ${formData.decoracion || 'Por definir'}
Fecha: ${formData.fecha_evento}
Invitados: ${formData.invitados}
Ciudad: ${formData.ciudad}
Muchas gracias.`;

    const phone = '573018922819'; // Business placeholder
    const encodedText = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const resetChat = () => {
    setStep(0);
    setMessages([]);
    setFormData({
      nombre: '',
      telefono: '',
      evento: '',
      fecha_evento: '',
      invitados: '',
      ciudad: '',
      presupuesto: '',
      decoracion: '',
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="sofi-trigger"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-pastel-pink-dark text-white rounded-full shadow-lg hover:shadow-pink-300/40 hover:shadow-2xl hover:scale-108 transition-all cursor-pointer flex items-center justify-center focus:outline-none animate-float"
        style={{ animationDuration: '4s' }}
      >
        <span className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full shadow border border-white animate-bounce">
          Sofi 🎈
        </span>
        <MessageSquare size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md h-[580px] rounded-3xl glass shadow-2xl flex flex-col overflow-hidden border border-pink-100/60 animate-scaleUp"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-pastel-pink via-pastel-purple to-pastel-blue flex items-center justify-between border-b border-pink-100/40">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md relative text-2xl border border-slate-100">
                  🎈
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 font-comfortaa text-sm sm:text-base tracking-tight">Sofi</h3>
                  <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Asistente Virtual • En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white/40 rounded-full transition-colors focus:outline-none cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/60">
              {messages.map((msg) => {
                if (msg.text === 'SUMMARY_CARD') {
                  return (
                    <div
                      key={msg.id}
                      className="glass-pink p-5 rounded-3xl border border-pink-200/50 shadow-md space-y-4 animate-scaleUp"
                    >
                      <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-pink-200/30 pb-2 text-sm sm:text-base font-comfortaa">
                        <span>📋</span> Resumen de Cotización
                      </h4>
                      <div className="text-xs sm:text-sm space-y-2 text-slate-700 font-medium">
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Nombre:</span>
                          <span className="font-bold text-slate-800">{formData.nombre}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Evento:</span>
                          <span className="font-bold text-slate-800">{formData.evento}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Temática:</span>
                          <span className="font-bold text-slate-800">{formData.decoracion || 'Por definir'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Fecha:</span>
                          <span className="font-bold text-slate-800">{formData.fecha_evento}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Invitados:</span>
                          <span className="font-bold text-slate-800">{formData.invitados}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Ciudad:</span>
                          <span className="font-bold text-slate-800">{formData.ciudad}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/50 pb-1">
                          <span className="text-slate-400 text-xs">Presupuesto:</span>
                          <span className="font-bold text-slate-800">{formData.presupuesto}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-400 text-xs">Teléfono:</span>
                          <span className="font-bold text-slate-800">{formData.telefono}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-pink-200/30 flex flex-col gap-2">
                        <button
                          onClick={handleWhatsAppSend}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] hover:scale-102 hover:shadow-lg text-white rounded-2xl font-bold text-sm shadow transition-all cursor-pointer"
                        >
                          <Phone size={16} />
                          Enviar por WhatsApp
                        </button>

                        <button
                          onClick={resetChat}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-100 hover:bg-slate-200 hover:scale-102 text-slate-600 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-slate-200/50"
                        >
                          <RefreshCw size={12} />
                          Cotizar otro evento
                        </button>
                      </div>
                    </div>
                  );
                }

                const isSofi = msg.sender === 'sofi';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isSofi ? 'justify-start' : 'justify-end'} animate-scaleUp`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isSofi
                          ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100 font-medium'
                          : 'bg-gradient-to-r from-pastel-pink-dark to-pink-600 text-white rounded-tr-none font-semibold'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input & Options Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              {/* Step 0: Event Selector */}
              {step === 0 && messages.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center py-2 animate-fadeIn">
                  {['Cumpleaños Infantil', 'Baby Shower', 'Bautizo', 'Primera Comunión', 'Fiesta Infantil', 'Otro'].map((evt) => (
                    <button
                      key={evt}
                      onClick={() => handleSelectOption(evt, 'evento')}
                      className="px-4 py-2 bg-pastel-blue-light/70 hover:bg-pastel-blue text-pastel-blue-dark hover:text-sky-900 border border-sky-200/50 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
                    >
                      {evt}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: City Selector */}
              {step === 3 && (
                <div className="flex flex-wrap gap-2 justify-center py-2 animate-fadeIn">
                  {['Valledupar', 'La Paz', 'Codazzi', 'San Diego', 'Otro'].map((city) => (
                    <button
                      key={city}
                      onClick={() => handleSelectOption(city, 'ciudad')}
                      className="px-4 py-2 bg-pastel-green-light/70 hover:bg-pastel-green text-pastel-green-dark hover:text-emerald-900 border border-emerald-200/50 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
                    >
                      📍 {city}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Guests Selector */}
              {step === 4 && (
                <div className="flex flex-wrap gap-2 justify-center py-2 animate-fadeIn">
                  {['Menos de 30', '30 a 60', '60 a 100', 'Más de 100'].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleSelectOption(num, 'invitados')}
                      className="px-4 py-2 bg-pastel-yellow-light/70 hover:bg-pastel-yellow text-pastel-yellow-dark hover:text-yellow-900 border border-yellow-200/50 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
                    >
                      👥 {num}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 6: Budget Selector */}
              {step === 6 && (
                <div className="flex flex-wrap gap-2 justify-center py-2 animate-fadeIn">
                  {['$150.000 - $300.000', '$300.000 - $600.000', '$600.000 - $1.000.000', 'Más de $1.000.000'].map((budget) => (
                    <button
                      key={budget}
                      onClick={() => handleSelectOption(budget, 'presupuesto')}
                      className="px-4 py-2 bg-pastel-purple-light/70 hover:bg-pastel-purple text-pastel-purple-dark hover:text-purple-900 border border-purple-200/50 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer hover:scale-105"
                    >
                      💰 {budget}
                    </button>
                  ))}
                </div>
              )}

              {/* Standard text input form */}
              {step > 0 && step !== 3 && step !== 4 && step !== 6 && step < 8 && (
                <form onSubmit={handleInputSubmit} className="flex gap-2 items-center animate-fadeIn">
                  <input
                    type={step === 2 ? 'date' : step === 7 ? 'tel' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      step === 1 ? 'Escribe tu nombre...' :
                        step === 2 ? '' :
                          step === 5 ? 'Ej: Paw Patrol con globos azules...' :
                            step === 7 ? 'Ej: 3018922819...' :
                              'Escribe tu respuesta...'
                    }
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-pastel-pink-dark bg-slate-50 focus:bg-white transition-all font-medium"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-pastel-pink-dark hover:bg-pink-600 text-white rounded-full shadow-sm hover:shadow hover:scale-105 transition-all focus:outline-none flex items-center justify-center cursor-pointer"
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}

              {/* End of conversation message */}
              {step >= 8 && (
                <div className="text-center text-xs text-slate-400 font-extrabold uppercase tracking-wider py-1.5 animate-pulse">
                  ¡Gracias por cotizar con nosotros! 💖
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
