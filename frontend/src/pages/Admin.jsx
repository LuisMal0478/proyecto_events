import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Search, CheckCircle, Circle, Trash2, 
  MapPin, Phone, Loader2, AlertCircle, RefreshCw, Plus, Image as ImageIcon, Sparkles, Lock
} from 'lucide-react';

export default function Admin() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('adminToken') !== null;
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Navigation State
  const [activeTab, setActiveTab] = useState('cotizaciones'); // 'cotizaciones' o 'galeria'
  
  // States for Requests (Cotizaciones)
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const [errorQuotes, setErrorQuotes] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos'); 
  const [eventFilter, setEventFilter] = useState('todos');

  // States for Gallery Management
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [errorGallery, setErrorGallery] = useState(null);
  
  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    desc: '',
    category: 'Cumpleaños'
  });
  const [imageBase64, setImageBase64] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // --- LOGIN/LOGOUT HANDLERS ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Usuario o contraseña incorrectos.');
      }
      const data = await res.json();
      sessionStorage.setItem('adminToken', data.access_token);
      setIsLoggedIn(true);
      setUsernameInput('');
      setPasswordInput('');
    } catch (err) {
      setLoginError(err.message || 'Error al conectar con el servidor.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  // --- API FETCH: COTIZACIONES ---
  const fetchCotizaciones = async () => {
    if (!isLoggedIn) return;
    setLoadingQuotes(true);
    setErrorQuotes(null);
    try {
      let url = `${API_URL}/api/cotizaciones`;
      const params = [];
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      if (statusFilter === 'atendidos') params.push('atendido=true');
      if (statusFilter === 'pendientes') params.push('atendido=false');
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Error al obtener datos del servidor');
      const data = await res.json();
      
      let finalData = data;
      if (eventFilter !== 'todos') {
        finalData = data.filter(item => item.evento === eventFilter);
      }
      setCotizaciones(finalData);
    } catch (err) {
      console.warn('Backend offline. Cargando cotizaciones locales demo.', err);
      setErrorQuotes('Servidor backend offline. Usando datos locales de demostración.');
      loadMockQuotes();
    } finally {
      setLoadingQuotes(false);
    }
  };

  const loadMockQuotes = () => {
    const mockData = [
      {
        id: 101,
        nombre: 'María Camila Ortega',
        telefono: '3157894512',
        evento: 'Cumpleaños Infantil',
        fecha_evento: '2026-07-15',
        invitados: 40,
        ciudad: 'Valledupar',
        presupuesto: '$300.000 - $600.000',
        fecha_registro: '2026-06-24T10:15:30Z',
        atendido: false
      },
      {
        id: 102,
        nombre: 'Juan Sebastian Gnecco',
        telefono: '3004561234',
        evento: 'Baby Shower',
        fecha_evento: '2026-08-02',
        invitados: 60,
        ciudad: 'La Paz',
        presupuesto: '$600.000 - $1.000.000',
        fecha_registro: '2026-06-23T14:45:00Z',
        atendido: true
      },
      {
        id: 103,
        nombre: 'Clarisa Maestre',
        telefono: '3189012345',
        evento: 'Bautizo',
        fecha_evento: '2026-09-12',
        invitados: 30,
        ciudad: 'Valledupar',
        presupuesto: '$150.000 - $300.000',
        fecha_registro: '2026-06-22T09:30:12Z',
        atendido: false
      }
    ];

    let filtered = [...mockData];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.nombre.toLowerCase().includes(s) || 
        item.telefono.includes(s) || 
        item.evento.toLowerCase().includes(s) ||
        item.ciudad.toLowerCase().includes(s)
      );
    }
    if (statusFilter === 'atendidos') {
      filtered = filtered.filter(item => item.atendido);
    } else if (statusFilter === 'pendientes') {
      filtered = filtered.filter(item => !item.atendido);
    }
    if (eventFilter !== 'todos') {
      filtered = filtered.filter(item => item.evento === eventFilter);
    }
    setCotizaciones(filtered);
  };

  // --- API FETCH: GALERIA ---
  const fetchGalleryItems = async () => {
    if (!isLoggedIn) return;
    setLoadingGallery(true);
    setErrorGallery(null);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/galeria`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (!res.ok) throw new Error('Error al obtener galería del servidor');
      const data = await res.json();
      setGalleryItems(data);
    } catch (err) {
      console.warn('Backend offline. Cargando galería local demo.', err);
      setErrorGallery('Servidor backend offline. Cargando fotos estáticas de demostración.');
      loadMockGallery();
    } finally {
      setLoadingGallery(false);
    }
  };

  const loadMockGallery = () => {
    setGalleryItems([
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
      }
    ]);
  };

  // Run fetches based on selected tab and login state
  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'cotizaciones') {
        fetchCotizaciones();
      } else {
        fetchGalleryItems();
      }
    }
  }, [activeTab, searchTerm, statusFilter, eventFilter, isLoggedIn]);

  // --- HANDLERS: COTIZACIONES ---
  const handleToggleAtendido = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/cotizaciones/${id}/atendido`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ atendido: !currentStatus })
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        fetchCotizaciones();
      } else {
        throw new Error('Error en actualización backend');
      }
    } catch (err) {
      setCotizaciones(prev => prev.map(item => 
        item.id === id ? { ...item, atendido: !currentStatus } : item
      ));
    }
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta cotización?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/cotizaciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        fetchCotizaciones();
      } else {
        throw new Error('Error en eliminación backend');
      }
    } catch (err) {
      setCotizaciones(prev => prev.filter(item => item.id !== id));
    }
  };

  // --- HANDLERS: GALERIA ---
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen seleccionada supera el límite recomendado de 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryItem = async (e) => {
    e.preventDefault();
    if (!imageBase64) {
      alert('Por favor selecciona una imagen para subir.');
      return;
    }

    setAddingItem(true);
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/galeria`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          src: imageBase64,
          title: galleryForm.title,
          category: galleryForm.category,
          desc: galleryForm.desc
        })
      });

      if (res.status === 401) {
        handleLogout();
        return;
      }

      if (!res.ok) throw new Error('Error al añadir imagen a la base de datos');

      setGalleryForm({ title: '', desc: '', category: 'Cumpleaños' });
      setImageBase64('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      fetchGalleryItems();
      alert('¡Imagen añadida a la galería con éxito!');
    } catch (err) {
      console.error(err);
      alert('No se pudo guardar la imagen en el servidor. Guardando localmente en la demo.');
      
      const newLocalItem = {
        id: Date.now(),
        src: imageBase64,
        title: galleryForm.title,
        category: galleryForm.category,
        desc: galleryForm.desc
      };
      setGalleryItems(prev => [newLocalItem, ...prev]);

      setGalleryForm({ title: '', desc: '', category: 'Cumpleaños' });
      setImageBase64('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta imagen de la galería?')) return;
    try {
      const token = sessionStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/galeria/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      if (res.ok) {
        fetchGalleryItems();
      } else {
        throw new Error('Error al eliminar en servidor');
      }
    } catch (err) {
      setGalleryItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // --- RENDER: LOGIN SCREEN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-blue-light/60 via-white to-pastel-pink-light/60 font-quicksand p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pastel-yellow-light/80 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pastel-pink-light/80 rounded-full filter blur-3xl opacity-60 animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pastel-blue-light/70 rounded-full filter blur-3xl opacity-50 animate-float" style={{ animationDuration: '7s', animationDelay: '1s' }} />

        <div className="glass p-10 rounded-[32px] shadow-2xl border border-white/55 max-w-md w-full relative z-10 space-y-8 backdrop-blur-xl">
          <div className="text-center space-y-3 flex flex-col items-center">
            <Link to="/" className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 px-4 py-2 rounded-full text-xs font-bold transition-all mb-2 border border-slate-250/30">
              <ArrowLeft size={12} /> Volver al Inicio
            </Link>
            <div className="w-14 h-14 bg-gradient-to-tr from-pastel-pink-dark to-pink-400 text-white rounded-full flex items-center justify-center shadow-lg mb-1 animate-float" style={{ animationDuration: '5s' }}>
              <Lock size={22} />
            </div>
            <h2 className="text-3xl font-extrabold font-comfortaa text-slate-800 tracking-tight">Panel Admin</h2>
            <p className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Ingresa tus credenciales de acceso</p>
          </div>

          {loginError && (
            <div className="p-4 bg-red-50/80 border border-red-200/50 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2 animate-scaleUp">
              <AlertCircle className="flex-shrink-0" size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 text-xs font-bold">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block pl-1">Usuario</label>
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-pastel-pink-dark focus:bg-white bg-slate-50/60 font-semibold transition-all text-slate-700"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold block pl-1">Contraseña</label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3.5 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-pastel-pink-dark focus:bg-white bg-slate-50/60 font-semibold transition-all text-slate-700"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-pastel-pink-dark hover:bg-pink-600 text-white rounded-full font-bold shadow-lg hover:shadow-pink-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer mt-4"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDER: ADMIN DASHBOARD (AUTHENTICATED) ---
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex flex-col font-quicksand">
      {/* Top Header */}
      <header className="glass shadow-sm fixed top-0 w-full z-20 border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2.5 hover:bg-slate-100/80 rounded-full text-slate-500 hover:text-slate-800 transition-colors border border-slate-200/10">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-base sm:text-lg font-bold font-comfortaa flex items-center gap-2 text-slate-800">
              <span>🛠️</span> Panel de Administración
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => activeTab === 'cotizaciones' ? fetchCotizaciones() : fetchGalleryItems()}
              className="px-4 py-2 hover:bg-slate-100 text-slate-600 rounded-full hover:text-slate-800 border border-slate-200/40 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="Sincronizar datos"
            >
              <RefreshCw size={12} className="text-pastel-blue-dark" />
              Sincronizar
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-full text-xs font-bold transition-all border border-red-200/20 cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 gap-1 max-w-md border border-slate-200/50">
          <button
            onClick={() => setActiveTab('cotizaciones')}
            className={`flex-1 py-2.5 text-center font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
              activeTab === 'cotizaciones'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📋 Cotizaciones
          </button>
          <button
            onClick={() => setActiveTab('galeria')}
            className={`flex-1 py-2.5 text-center font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer ${
              activeTab === 'galeria'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            🖼️ Galería
          </button>
        </div>

        {/* TAB 1: COTIZACIONES */}
        {activeTab === 'cotizaciones' && (
          <div className="space-y-6">
            {errorQuotes && (
              <div className="p-4 bg-yellow-50/80 border border-yellow-200/50 text-yellow-800 rounded-2xl flex items-start gap-3">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-sm">Modo Demo Local Activo</p>
                  <p className="text-xs text-yellow-700 mt-0.5">{errorQuotes}</p>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100/60 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="relative md:col-span-6 flex items-center">
                  <Search className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, teléfono, ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-pastel-pink-dark focus:bg-white text-sm bg-slate-50/60 transition-all font-semibold"
                  />
                </div>

                <div className="relative md:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-pastel-pink-dark focus:bg-white text-sm bg-slate-50/60 transition-all font-bold text-slate-600"
                  >
                    <option value="todos">Todos los Estados</option>
                    <option value="pendientes">Pendientes</option>
                    <option value="atendidos">Atendidos</option>
                  </select>
                </div>

                <div className="relative md:col-span-3">
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-pastel-pink-dark focus:bg-white text-sm bg-slate-50/60 transition-all font-bold text-slate-600"
                  >
                    <option value="todos">Todos los Eventos</option>
                    {['Cumpleaños Infantil', 'Baby Shower', 'Bautizo', 'Primera Comunión', 'Fiesta Infantil', 'Otro'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {loadingQuotes ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-pastel-blue-dark" size={40} />
                <p className="text-sm font-semibold text-slate-500">Cargando cotizaciones...</p>
              </div>
            ) : cotizaciones.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-500 font-medium">No se encontraron cotizaciones con los filtros actuales.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Desktop view */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-4 px-6">Cliente</th>
                        <th className="py-4 px-6">Evento / Temática</th>
                        <th className="py-4 px-4 text-center">Invitados</th>
                        <th className="py-4 px-4">Ciudad</th>
                        <th className="py-4 px-4">Presupuesto</th>
                        <th className="py-4 px-4">Fecha Evento</th>
                        <th className="py-4 px-4">Fecha Registro</th>
                        <th className="py-4 px-4 text-center">Estado</th>
                        <th className="py-4 px-6 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {cotizaciones.map((cot) => (
                        <tr key={cot.id} className={`hover:bg-slate-50/50 transition-colors ${cot.atendido ? 'bg-slate-50/20' : ''}`}>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-800">{cot.nombre}</div>
                            <a 
                              href={`https://wa.me/${cot.telefono.replace(/\s+/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1 text-xs text-pastel-blue-dark font-bold mt-0.5 hover:underline"
                            >
                              <Phone size={12} /> {cot.telefono}
                            </a>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-semibold text-slate-700">{cot.evento}</div>
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-slate-600">{cot.invitados}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                              <MapPin size={12} /> {cot.ciudad}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-semibold text-slate-600 text-xs">{cot.presupuesto}</td>
                          <td className="py-4 px-4 font-medium text-slate-600">{cot.fecha_evento}</td>
                          <td className="py-4 px-4 text-xs text-slate-400">{formatDate(cot.fecha_registro)}</td>
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleToggleAtendido(cot.id, cot.atendido)}
                              className={`p-1 rounded-full transition-all focus:outline-none ${
                                cot.atendido ? 'text-green-500 hover:text-green-600' : 'text-slate-300 hover:text-slate-400'
                              }`}
                            >
                              {cot.atendido ? <CheckCircle size={22} /> : <Circle size={22} />}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleDeleteQuote(cot.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all focus:outline-none"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view */}
                <div className="block lg:hidden divide-y divide-slate-100">
                  {cotizaciones.map((cot) => (
                    <div key={cot.id} className={`p-4 hover:bg-slate-50 transition-colors space-y-4 ${cot.atendido ? 'bg-slate-50/20' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-800">{cot.nombre}</div>
                          <a 
                            href={`https://wa.me/${cot.telefono.replace(/\s+/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-pastel-blue-dark font-bold mt-1"
                          >
                            <Phone size={12} /> {cot.telefono}
                          </a>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleAtendido(cot.id, cot.atendido)}
                            className={`p-1.5 rounded-full ${cot.atendido ? 'text-green-500' : 'text-slate-300'}`}
                          >
                            {cot.atendido ? <CheckCircle size={22} /> : <Circle size={22} />}
                          </button>
                          <button onClick={() => handleDeleteQuote(cot.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Evento</span>
                          <span className="font-bold text-slate-700">{cot.evento}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Fecha Evento</span>
                          <span className="font-bold text-slate-700">{cot.fecha_evento}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Invitados</span>
                          <span className="font-bold text-slate-700">{cot.invitados} personas</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Presupuesto</span>
                          <span className="font-bold text-slate-700">{cot.presupuesto}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Ciudad</span>
                          <span className="font-bold text-slate-700">{cot.ciudad}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block uppercase font-bold text-[9px] tracking-wider">Registro</span>
                          <span className="text-slate-500">{formatDate(cot.fecha_registro)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GESTIONAR GALERIA */}
        {activeTab === 'galeria' && (
          <div className="space-y-6">
            {errorGallery && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl flex items-start gap-3">
                <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-bold text-sm">Modo Demo Local Activo</p>
                  <p className="text-xs text-yellow-700 mt-0.5">{errorGallery}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Add image form */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 font-comfortaa text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Plus className="text-pastel-pink-dark" size={20} />
                  Agregar Nueva Foto
                </h3>
                
                <form onSubmit={handleAddGalleryItem} className="space-y-4 text-sm">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Imagen</label>
                    <div className="relative group border-2 border-dashed border-slate-200 hover:border-pastel-pink rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-pink-50/20 transition-all flex flex-col items-center justify-center min-h-[120px]">
                      {imageBase64 ? (
                        <div className="w-full flex flex-col items-center gap-2">
                          <img src={imageBase64} alt="Previsualizar" className="h-20 max-w-full object-contain rounded-md" />
                          <span className="text-[10px] text-pastel-pink-dark font-bold hover:underline" onClick={() => setImageBase64('')}>Quitar</span>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="text-slate-400 group-hover:scale-110 transition-transform mb-2" size={28} />
                          <span className="text-xs font-semibold text-slate-500">Seleccionar imagen o soltar aquí</span>
                          <span className="text-[10px] text-slate-400 mt-1">Límite recomendado: 2 MB</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        ref={fileInputRef}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required={!imageBase64}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Título de la Decoración</label>
                    <input
                      type="text"
                      placeholder="Ej: Arcoíris de Globos Pastel"
                      value={galleryForm.title}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-pastel-blue-dark bg-slate-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Categoría</label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-pastel-blue-dark bg-slate-50"
                    >
                      <option value="Cumpleaños">Cumpleaños</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Bautizos">Bautizos</option>
                      <option value="Mobiliario">Mobiliario</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Descripción / Detalles</label>
                    <textarea
                      placeholder="Ej: Decoración con aro circular de metal, cilindros blancos y globos en tonos lila, rosa y amarillo."
                      value={galleryForm.desc}
                      onChange={(e) => setGalleryForm(prev => ({ ...prev, desc: e.target.value }))}
                      rows="3"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-pastel-blue-dark bg-slate-50"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addingItem}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-pastel-pink-dark hover:bg-pink-600 disabled:bg-slate-300 text-white rounded-full font-bold shadow transition-all cursor-pointer"
                  >
                    {addingItem ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> Subiendo...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} /> Agregar a Galería
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Gallery Grid List */}
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-slate-800 font-comfortaa text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ImageIcon className="text-pastel-pink-dark" size={20} />
                  Imágenes Activas en Galería ({galleryItems.length})
                </h3>

                {loadingGallery ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="animate-spin text-pastel-blue-dark" size={32} />
                    <p className="text-sm text-slate-500 font-medium">Cargando fotos de la galería...</p>
                  </div>
                ) : galleryItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-medium">No hay fotos en la galería. Agrega la primera en el formulario.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <img 
                          src={item.src} 
                          alt={item.title} 
                          className="w-20 h-20 object-cover rounded-xl border border-slate-200" 
                        />
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-pastel-pink-dark bg-pink-100/50 px-2 py-0.5 rounded-full inline-block">
                              {item.category}
                            </span>
                            <h4 className="font-bold text-slate-800 text-xs mt-1 line-clamp-1">{item.title}</h4>
                            <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{item.desc}</p>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="self-start text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-1 hover:underline mt-2 focus:outline-none"
                          >
                            <Trash2 size={10} /> Eliminar foto
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
