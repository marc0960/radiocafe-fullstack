import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  Camera, 
  Check, 
  ShieldCheck, 
  Coffee, 
  Store, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Bell, 
  RotateCcw, 
  DollarSign, 
  CheckCircle2, 
  CornerUpRight, 
  Crosshair, 
  X, 
  Send,
  Power,
  ArrowLeft,
  Bike
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function DeliveryApp() {
  const navigate = useNavigate();

  // Estado de conexión del Repartidor: true = Activo (En línea), false = Inactivo
  const [isOnline, setIsOnline] = useState(true);

  // Paso actual del flujo de entrega: 1 = Recogida, 2 = En Ruta, 3 = Confirmar Entrega
  const [currentStep, setCurrentStep] = useState(1);

  // Estado del pedido (sincronizado con Backend con fallback de seguridad)
  const [order, setOrder] = useState({
    idPedido: 1,
    codigoPedido: 'RP-2048',
    nombreCliente: 'Lucía Méndez',
    telefonoCliente: '+52 55 4912 3840',
    direccionEntrega: 'Av. Álvaro Obregón 148, Roma Norte, CDMX',
    latitud: 19.41740,
    longitud: -99.16240,
    notasPedido: 'Entregar en vaso térmico, poco azúcar',
    pinEntrega: '1842',
    metodoPago: 'EFECTIVO',
    total: 12.50,
    estadoPedido: 'LISTO',
    detalles: [
      { idProducto: 1, nombreProducto: 'Capuchino Grande (Leche de Almendras)', cantidad: 1, subtotalLinea: 4.50 },
      { idProducto: 2, nombreProducto: 'Muffin de arándanos', cantidad: 2, subtotalLinea: 5.00 },
      { idProducto: 3, nombreProducto: 'Iced Caramel Latte 500ml', cantidad: 1, subtotalLinea: 3.00 }
    ]
  });

  // Datos para el Paso 3
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [photoEvidence, setPhotoEvidence] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Modal de Chat interactivo
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'cliente', text: '¡Hola! Por favor tocar el interfono 148A al llegar.' },
    { sender: 'repartidor', text: '¡Buenas tardes! Voy en camino con su pedido de RadioCafé.' }
  ]);
  const [inputChat, setInputChat] = useState('');

  // Cargar pedido desde Backend si está encendido
  useEffect(() => {
    fetch(`${API_BASE_URL}/orders/code/RP-2048`)
      .then(res => {
        if (!res.ok) throw new Error('Backend no respondió');
        return res.json();
      })
      .then(data => {
        if (data && data.codigoPedido) {
          setOrder(data);
          if (data.estadoPedido === 'EN_CAMINO') setCurrentStep(2);
          if (data.estadoPedido === 'ENTREGADO') {
            setCurrentStep(3);
            setIsFinished(true);
          }
        }
      })
      .catch(err => {
        console.log('Operando con datos iniciales sincronizados:', err.message);
      });
  }, []);

  // Sincronizar estado con el Backend
  const syncStateWithBackend = async (nuevoEstado) => {
    try {
      await fetch(`${API_BASE_URL}/orders/${order.idPedido || 1}/status?nuevoEstado=${nuevoEstado}`, {
        method: 'PATCH'
      });
    } catch (e) {
      console.warn('Backend local no disponible para patch, sincronizando interfaz.');
    }
  };

  // Paso 1 -> Paso 2
  const handleConfirmPickup = () => {
    syncStateWithBackend('EN_CAMINO');
    setOrder(prev => ({ ...prev, estadoPedido: 'EN_CAMINO' }));
    setCurrentStep(2);
  };

  // Paso 2 -> Paso 3
  const handleArrivedAtDestination = () => {
    setCurrentStep(3);
  };

  // Teclado PIN
  const handleKeyPress = (num) => {
    const nextEmptyIndex = pinDigits.findIndex(d => d === '');
    if (nextEmptyIndex !== -1) {
      const newDigits = [...pinDigits];
      newDigits[nextEmptyIndex] = num.toString();
      setPinDigits(newDigits);
    }
  };

  const handleDeleteDigit = () => {
    for (let i = pinDigits.length - 1; i >= 0; i--) {
      if (pinDigits[i] !== '') {
        const newDigits = [...pinDigits];
        newDigits[i] = '';
        setPinDigits(newDigits);
        break;
      }
    }
  };

  // Chat
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'repartidor', text: inputChat.trim() }]);
    setInputChat('');
  };

  // Abrir GPS en Google Maps nativo (Gratis sin consumo de API)
  const handleOpenNativeGoogleMaps = () => {
    const dest = encodeURIComponent(order.direccionEntrega || `${order.latitud},${order.longitud}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  // Llamar cliente
  const handleCallClient = () => {
    window.location.href = `tel:${order.telefonoCliente.replace(/\s+/g, '')}`;
  };

  // Subir / tomar foto evidencia
  const handleTakeEvidence = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoEvidence(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoEvidence('/assets/hero-coffe.jpg');
    }
  };

  // Finalizar entrega
  const handleFinalizeDelivery = async () => {
    setErrorMessage('');
    const fullPin = pinDigits.join('');

    if (fullPin.length < 4) {
      setErrorMessage('Ingresa los 4 dígitos del PIN de seguridad.');
      return;
    }

    if (fullPin !== (order.pinEntrega || '1842')) {
      setErrorMessage(`PIN incorrecto. Pídele el PIN a ${order.nombreCliente.split(' ')[0]} (Demo: ${order.pinEntrega || '1842'}).`);
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/orders/${order.idPedido || 1}/confirm-delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: fullPin,
          fotoEvidencia: photoEvidence || 'evidencia_bolsa_puerta.jpg'
        })
      });
    } catch (e) {
      console.warn('Backend local no disponible para confirmación.');
    }

    setIsFinished(true);
  };

  // Reiniciar flujo
  const handleResetFlow = () => {
    syncStateWithBackend('LISTO');
    setOrder(prev => ({ ...prev, estadoPedido: 'LISTO' }));
    setCurrentStep(1);
    setPinDigits(['', '', '', '']);
    setPhotoEvidence(null);
    setIsFinished(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#110E0C] text-neutral-100 flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white">
      
      {/* ========================================================
          NAVBAR PRINCIPAL (ADAPTADO TANTO PARA PC COMO PARA CELULAR)
         ======================================================== */}
      <header className="sticky top-0 z-30 bg-[#1A1614]/95 backdrop-blur-md border-b border-[#2D2622] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        
        {/* Lado izquierdo: Volver + Logo */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#26201D] hover:bg-[#342D29] text-neutral-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-[#3A322D] transition-all"
            title="Volver a la página principal"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">RadioCafé</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/40 flex items-center justify-center text-[#FF6B00]">
              <Bike size={18} />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="font-black text-lg tracking-tight text-white">ruta</span>
              <span className="text-[10px] font-black uppercase text-[#FF6B00] bg-[#FF6B00]/15 px-1.5 py-0.5 rounded tracking-wider border border-[#FF6B00]/30">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Interruptor Activo/Inactivo + Reinicio + Perfil */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* INTERRUPTOR ACTIVO / INACTIVO */}
          <div 
            onClick={() => setIsOnline(!isOnline)} 
            className="flex items-center space-x-2.5 cursor-pointer select-none bg-[#241E1B] hover:bg-[#2C2522] border border-[#382F2A] px-3 py-1.5 rounded-full transition-all"
            title={isOnline ? "Haz clic para ponerte Inactivo" : "Haz clic para ponerte Activo"}
          >
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#22C55E] animate-pulse' : 'bg-neutral-500'}`} />
                <span className={`text-xs font-bold ${isOnline ? 'text-[#22C55E]' : 'text-neutral-400'}`}>
                  {isOnline ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="text-[9px] text-neutral-500 hidden sm:block">
                {isOnline ? 'Recibiendo entregas' : 'Pausado'}
              </p>
            </div>

            {/* Switch deslizable */}
            <div className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${isOnline ? 'bg-[#22C55E]' : 'bg-neutral-700'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-xs ${isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Botón de reinicio para pruebas */}
          <button 
            onClick={handleResetFlow}
            className="p-2 rounded-xl bg-[#241E1B] hover:bg-[#2F2723] text-neutral-400 hover:text-white border border-[#382F2A] transition-all"
            title="Reiniciar flujo de demostración"
          >
            <RotateCcw size={15} />
          </button>

          {/* Avatar Repartidor */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#2C2420] border border-[#423732] flex items-center justify-center text-xs font-black text-[#FF6B00]">
              DR
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-bold text-white leading-tight">Daniel R.</p>
              <p className="text-[10px] text-neutral-400">Repartidor Oficial</p>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================
          SI EL REPARTIDOR ESTÁ "INACTIVO"
         ======================================================== */}
      {!isOnline ? (
        <main className="flex-1 max-w-xl mx-auto w-full p-6 sm:p-12 flex flex-col items-center justify-center text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-[#221B18] border border-[#3A2F2A] flex items-center justify-center text-neutral-500 mb-6 shadow-xl">
            <Power size={38} />
          </div>
          <span className="bg-neutral-800 text-neutral-400 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Modo Pausado
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Estás Inactivo</h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
            Tu estado actual no te permite recibir ni continuar con entregas en ruta. Activa tu estado arriba o presiona el botón inferior para comenzar a operar.
          </p>

          <button 
            onClick={() => setIsOnline(true)}
            className="mt-6 bg-[#22C55E] hover:bg-[#1EAE53] text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-lg shadow-[#22C55E]/20 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 size={16} />
            <span>Ponerse Activo ahora</span>
          </button>
        </main>
      ) : (

        /* ========================================================
            CUANDO ESTÁ "ACTIVO": CONTENIDO RESPONSIVE (PC + MÓVIL)
           ======================================================== */
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col space-y-6">

          {/* BARRA DE PROGRESO DE LA ENTREGA */}
          <section className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? 'bg-[#FF6B00]' : 'bg-neutral-800'}`} />
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? 'bg-[#FF6B00]' : 'bg-neutral-800'}`} />
              <div className={`h-1.5 rounded-full transition-all ${currentStep >= 3 ? 'bg-[#FF6B00]' : 'bg-neutral-800'}`} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-black text-[#FF6B00] tracking-wide uppercase">
                  {currentStep === 1 && '01 / 03 · Recogida en Cafetería'}
                  {currentStep === 2 && '02 / 03 · En Ruta hacia el Cliente'}
                  {currentStep >= 3 && '03 / 03 · En Destino (Confirmación)'}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {currentStep === 1 && 'Verifica los productos en barra antes de iniciar el viaje.'}
                  {currentStep === 2 && 'Sigue el trayecto o utiliza el GPS nativo hacia la dirección.'}
                  {currentStep >= 3 && 'Solicita el PIN al cliente y toma la foto de entrega.'}
                </p>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs sm:text-sm font-bold bg-[#26201C] text-neutral-300 px-3 py-1.5 rounded-xl border border-[#382F2A]">
                  #{order.codigoPedido || 'RP-2048'}
                </span>
              </div>
            </div>
          </section>

          {/* PANTALLA DE ÉXITO FINAL */}
          {isFinished ? (
            <div className="bg-[#191513] border border-[#2D2622] rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto w-full shadow-2xl animate-fadeIn space-y-6">
              <div className="w-20 h-20 bg-[#22C55E]/15 border-2 border-[#22C55E] text-[#22C55E] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#22C55E]/10">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <span className="bg-[#22C55E]/20 text-[#22C55E] font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Entrega Finalizada
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">¡Pedido Entregado con Éxito!</h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md mx-auto">
                  La orden de <strong className="text-white">{order.nombreCliente}</strong> ha sido verificada y registrada correctamente en la base de datos de RadioCafé.
                </p>
              </div>

              {/* Balance y Ganancias */}
              <div className="bg-[#211B18] border border-[#352B26] rounded-2xl p-5 text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-neutral-400">Total cobrado al cliente:</span>
                  <span className="font-black text-lg text-[#F59E0B]">${order.total?.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm border-t border-[#352B26] pt-2.5">
                  <span className="text-neutral-400">Ganancia repartidor (Tarifa base):</span>
                  <span className="font-bold text-[#22C55E]">+$3.50 USD</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-neutral-400">Propina sugerida:</span>
                  <span className="font-bold text-[#22C55E]">+$1.00 USD</span>
                </div>
              </div>

              <button 
                onClick={handleResetFlow}
                className="w-full bg-[#FF6B00] hover:bg-[#E05600] active:scale-[0.98] text-white font-extrabold py-3.5 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-[#FF6B00]/25 flex items-center justify-center space-x-2"
              >
                <span>Tomar Próxima Entrega</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (

            /* FLUJO PRINCIPAL DE 3 PASOS */
            <div>

              {/* ========================================================
                  PASO 1: RECOGIDA DEL PEDIDO ("Tu próxima entrega")
                 ======================================================== */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                  
                  {/* COLUMNA IZQUIERDA (7 cols en PC): Cafetería + Productos */}
                  <div className="lg:col-span-7 space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Tu próxima entrega</h1>

                    {/* Card Cafetería */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl bg-[#251E1A] flex items-center justify-center text-[#FF6B00] border border-[#3A2F2A]">
                          <Store size={22} />
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-white">Café de Especialidad · Roma</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">Colima 145 - Barra principal</p>
                        </div>
                      </div>
                      <span className="bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] text-xs font-black px-3 py-1 rounded-full">
                        • Listo
                      </span>
                    </div>

                    {/* Card Detalle de Productos */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <img 
                          src="/assets/hero-coffe.jpg" 
                          alt="Combo Café" 
                          className="w-full sm:w-28 h-28 rounded-2xl object-cover bg-neutral-800 shrink-0 border border-[#332A25]"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="flex-1">
                          <h4 className="font-extrabold text-sm sm:text-base text-white">
                            Combo Capuchino Grande + Muffin de Arándanos x2
                          </h4>
                          <div className="mt-2 space-y-1 text-xs text-neutral-300">
                            <p>• 1 × Capuchino (Leche de Almendras)</p>
                            <p>• 2 × Muffin de arándanos recién horneados</p>
                            <p>• 1 × Iced Caramel Latte 500ml</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#29221E] flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-xl border border-[#F59E0B]/20">
                          <span>👜</span>
                          <span>1 bolsa sellada y lista</span>
                        </span>
                        <span className="text-xs text-neutral-400">Cocina verificada</span>
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA (5 cols en PC): Cliente + Cobro + Acción */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Card Cliente */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 space-y-2.5 shadow-sm">
                      <p className="text-[10px] uppercase font-black tracking-wider text-neutral-500">ENTREGAR A</p>
                      <div className="flex items-start space-x-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-xs font-black text-[#F59E0B] shrink-0 mt-0.5">
                          LM
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{order.nombreCliente}</h4>
                          <p className="text-xs text-neutral-300 mt-0.5">{order.direccionEntrega}</p>
                          <p className="text-[11px] text-neutral-500 mt-1">Tel: {order.telefonoCliente}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Cobro en Efectivo */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-neutral-400 font-semibold">Cobrar en Efectivo:</p>
                        <p className="text-[11px] text-neutral-500">Importe total al entregar</p>
                      </div>
                      <span className="text-2xl sm:text-3xl font-black text-[#F59E0B]">${order.total?.toFixed(2)} USD</span>
                    </div>

                    {/* Card Nota del Pedido */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-3.5 flex items-start space-x-3 shadow-sm">
                      <span className="text-[#FF6B00] text-base mt-0.5">💬</span>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-neutral-500">NOTA DEL CLIENTE</p>
                        <p className="text-xs text-neutral-200 mt-0.5">{order.notasPedido}</p>
                      </div>
                    </div>

                    {/* Botón de Acción Principal */}
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-center space-x-1.5 text-xs text-[#22C55E] font-medium">
                        <CheckCircle2 size={14} />
                        <span>Verifica los 2 combos antes de salir</span>
                      </div>

                      <button 
                        onClick={handleConfirmPickup}
                        className="w-full bg-[#FF6B00] hover:bg-[#E05600] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#FF6B00]/25"
                      >
                        <span>Confirmar Recogida en Cafetería</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ========================================================
                  PASO 2: EN RUTA ("En camino a Lucía") + MAPA AMPLIO
                 ======================================================== */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                  
                  {/* COLUMNA IZQUIERDA / CENTRAL (7 cols en PC): Mapa Interactivo */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        En camino a {order.nombreCliente.split(' ')[0]}
                      </h1>
                      <span className="bg-[#FF6B00]/15 text-[#FF6B00] text-xs font-black px-3 py-1 rounded-full uppercase border border-[#FF6B00]/30">
                        • En Ruta
                      </span>
                    </div>

                    {/* Indicación de navegación (Turn-by-turn) */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 flex items-center space-x-3.5 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-[#251E1A] text-[#FF6B00] flex items-center justify-center shrink-0 border border-[#3A2F2A]">
                        <CornerUpRight size={22} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">En 200 m, gira a la derecha</h3>
                        <p className="text-xs text-neutral-400">Av. Álvaro Obregón (Roma Norte)</p>
                      </div>
                    </div>

                    {/* MAPA INTERACTIVO RESPONSIVE DARK THEME */}
                    <div className="relative w-full h-72 sm:h-96 bg-[#161210] rounded-2xl overflow-hidden border border-[#2D2622] select-none shadow-inner">
                      {/* Manzanas de ciudad estilo navegación nocturna */}
                      <div className="absolute inset-0 bg-[#14100E] opacity-90">
                        <div className="absolute top-6 left-6 w-32 h-24 bg-[#211B18] rounded-xl opacity-80" />
                        <div className="absolute top-6 left-44 w-36 h-24 bg-[#211B18] rounded-xl opacity-80" />
                        <div className="absolute top-6 right-6 w-36 h-24 bg-[#211B18] rounded-xl opacity-80" />
                        <div className="absolute bottom-8 left-6 w-32 h-28 bg-[#211B18] rounded-xl opacity-80" />
                        <div className="absolute bottom-8 left-44 w-36 h-28 bg-[#211B18] rounded-xl opacity-80" />
                        <div className="absolute bottom-8 right-6 w-36 h-28 bg-[#211B18] rounded-xl opacity-80" />

                        {/* Nombres de calles */}
                        <span className="absolute top-12 left-10 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Colima</span>
                        <span className="absolute top-12 left-48 text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Roma Norte</span>
                        <span className="absolute bottom-16 right-10 text-[9px] font-mono text-neutral-600 uppercase">Plaza Río de Janeiro</span>
                      </div>

                      {/* Trazado SVG de la ruta */}
                      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <line x1="50" y1="240" x2="550" y2="80" stroke="#332A25" strokeWidth="8" strokeDasharray="6 6" />
                        <path 
                          d="M 90 220 L 200 220 L 200 120 L 380 120 L 380 70" 
                          fill="none" 
                          stroke="#FF6B00" 
                          strokeWidth="6" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>

                      {/* Origen: Cafetería */}
                      <div className="absolute bottom-16 left-24 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1F1815] border-2 border-[#FF6B00] flex items-center justify-center text-[#FF6B00] shadow-xl">
                        <Coffee size={18} />
                      </div>

                      {/* Repartidor en Camino (Animación) */}
                      <div className="absolute top-28 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-12 h-12 rounded-full bg-[#FF6B00]/25 animate-ping" />
                          <div className="w-9 h-9 rounded-full bg-[#FF6B00] text-black border-2 border-white flex items-center justify-center font-black shadow-xl">
                            <Navigation size={16} className="rotate-45" />
                          </div>
                        </div>
                      </div>

                      {/* Destino: Cliente */}
                      <div className="absolute top-16 right-36 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-neutral-900 border-2 border-[#FF6B00] flex items-center justify-center shadow-xl">
                        <MapPin size={16} className="text-[#FF6B00]" />
                      </div>

                      {/* Botón de Recenter */}
                      <button 
                        onClick={handleOpenNativeGoogleMaps}
                        className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-[#201916]/90 border border-[#3A2F2A] text-neutral-300 hover:text-white transition-all shadow-md"
                        title="Centrar y ver en Google Maps"
                      >
                        <Crosshair size={18} />
                      </button>

                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-neutral-400 font-mono">
                        Escala 100 m
                      </div>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA (5 cols en PC): Métricas + Acciones + Botón */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Card Métricas de Viaje */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-white">6 min</span>
                        <span className="text-sm text-neutral-400">• 1.8 km de trayecto</span>
                      </div>

                      {/* Datos del cliente */}
                      <div className="flex items-start space-x-3.5 pt-3 border-t border-[#29221E]">
                        <div className="w-10 h-10 rounded-full bg-[#D97706]/20 border border-[#D97706]/40 flex items-center justify-center text-xs font-black text-[#F59E0B] shrink-0 mt-0.5">
                          LM
                        </div>
                        <div className="flex-1">
                          <h4 className="font-extrabold text-sm text-white">{order.nombreCliente}</h4>
                          <p className="text-xs text-neutral-300 mt-0.5">{order.direccionEntrega}</p>
                        </div>
                      </div>

                      {/* BOTONES RÁPIDOS: LLAMAR, CHAT, GPS (GRATIS) */}
                      <div className="grid grid-cols-3 gap-2.5 pt-2">
                        <button 
                          onClick={handleCallClient}
                          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#251E1A] hover:bg-[#302621] text-neutral-200 text-xs font-bold transition-all border border-[#3A2F2A]"
                        >
                          <Phone size={14} className="text-[#FF6B00]" />
                          <span>Llamar</span>
                        </button>

                        <button 
                          onClick={() => setShowChatModal(true)}
                          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#251E1A] hover:bg-[#302621] text-neutral-200 text-xs font-bold transition-all border border-[#3A2F2A]"
                        >
                          <MessageSquare size={14} className="text-[#FF6B00]" />
                          <span>Chat</span>
                        </button>

                        {/* GPS NATIVO GOOGLE MAPS SIN COBRO */}
                        <button 
                          onClick={handleOpenNativeGoogleMaps}
                          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-[#251E1A] hover:bg-[#302621] text-neutral-200 text-xs font-bold transition-all border border-[#3A2F2A]"
                          title="Abre la app de Google Maps en el celular gratis sin costo de API"
                        >
                          <Navigation size={14} className="text-[#FF6B00]" />
                          <span>GPS</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-[#29221E] flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Combo Capuchino + Muffin</span>
                        <span className="text-[#F59E0B] font-black">${order.total?.toFixed(2)} · Efectivo</span>
                      </div>
                    </div>

                    {/* Botón: Llegué a la dirección */}
                    <button 
                      onClick={handleArrivedAtDestination}
                      className="w-full bg-[#FF6B00] hover:bg-[#E05600] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#FF6B00]/25"
                    >
                      <MapPin size={18} />
                      <span>Llegué a la dirección</span>
                    </button>

                  </div>
                </div>
              )}

              {/* ========================================================
                  PASO 3: EN DESTINO ("Confirmar Entrega") + TECLADO NUMÉRICO
                 ======================================================== */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn max-w-4xl mx-auto">
                  
                  {/* COLUMNA IZQUIERDA (6 cols en PC): Foto de Evidencia + Resumen */}
                  <div className="lg:col-span-6 space-y-4">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Confirmar Entrega</h1>

                    {/* Card Foto de Evidencia */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-white">Foto de evidencia</p>
                        <span className="text-[10px] uppercase font-bold text-[#FF6B00] bg-[#FF6B00]/15 px-2 py-0.5 rounded tracking-wider border border-[#FF6B00]/30">
                          OBLIGATORIA
                        </span>
                      </div>

                      <label className="border-2 border-dashed border-[#3A2F2A] hover:border-[#FF6B00] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-[#14100E]">
                        <input 
                          type="file" 
                          accept="image/*" 
                          capture="environment" 
                          onChange={handleTakeEvidence}
                          className="hidden" 
                        />

                        {photoEvidence ? (
                          <div className="flex items-center space-x-4 w-full">
                            <img 
                              src={photoEvidence} 
                              alt="Evidencia" 
                              className="w-16 h-16 rounded-xl object-cover border border-[#3A2F2A]" 
                            />
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#22C55E] flex items-center space-x-1">
                                <Check size={14} />
                                <span>Foto capturada correctamente</span>
                              </p>
                              <p className="text-[11px] text-neutral-400 mt-0.5">Toca aquí si deseas cambiarla</p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5 py-3">
                            <div className="flex items-center justify-center space-x-2 text-[#FF6B00]">
                              <Camera size={22} />
                              <span className="text-xs sm:text-sm font-bold">Tomar foto de la entrega</span>
                            </div>
                            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
                              Incluye la bolsa y el lugar de entrega. Evita rostros y datos personales.
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Mini Resumen Cliente y Cobro */}
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-4 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-extrabold text-sm text-white">{order.nombreCliente}</p>
                        <p className="text-xs text-[#F59E0B] font-semibold mt-0.5">• Cobro en efectivo</p>
                      </div>
                      <span className="text-2xl font-black text-[#F59E0B]">${order.total?.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {/* COLUMNA DERECHA (6 cols en PC): PIN de Seguridad + Teclado Táctil */}
                  <div className="lg:col-span-6 space-y-4">
                    
                    <div className="bg-[#191513] border border-[#2D2622] rounded-2xl p-5 space-y-3.5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-white">PIN de seguridad</p>
                        <span className="text-xs font-bold text-[#F59E0B] flex items-center space-x-1">
                          <ShieldCheck size={14} />
                          <span>4 dígitos</span>
                        </span>
                      </div>

                      {/* 4 Cajitas para los dígitos del PIN */}
                      <div className="grid grid-cols-4 gap-3 py-1">
                        {[0, 1, 2, 3].map((idx) => (
                          <div 
                            key={idx}
                            className={`h-12 rounded-xl border flex items-center justify-center text-xl font-black transition-all ${
                              pinDigits[idx] 
                                ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-white' 
                                : 'border-[#382F2A] bg-[#14100E] text-neutral-600'
                            }`}
                          >
                            {pinDigits[idx] || (idx === pinDigits.findIndex(d => d === '') ? '|' : '—')}
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-neutral-400 text-center">
                        Pídele el código de 4 dígitos a {order.nombreCliente.split(' ')[0]} al entregar su pedido.
                      </p>

                      {/* Mensaje de error si falla PIN */}
                      {errorMessage && (
                        <div className="bg-red-950/40 border border-red-800 text-red-300 text-xs p-3 rounded-xl flex items-center space-x-2">
                          <AlertCircle size={15} className="shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* TECLADO NUMÉRICO TÁCTIL (COMODIDAD EN CELULAR O CLICK EN PC) */}
                      <div className="grid grid-cols-3 gap-2.5 pt-1 select-none">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <button 
                            key={num}
                            type="button"
                            onClick={() => handleKeyPress(num)}
                            className="h-11 rounded-xl bg-[#221B18] hover:bg-[#2E2420] active:bg-[#FF6B00] active:text-white text-neutral-200 font-bold text-base transition-colors flex items-center justify-center shadow-xs"
                          >
                            {num}
                          </button>
                        ))}

                        <div className="h-11" />
                        <button 
                          type="button"
                          onClick={() => handleKeyPress(0)}
                          className="h-11 rounded-xl bg-[#221B18] hover:bg-[#2E2420] active:bg-[#FF6B00] active:text-white text-neutral-200 font-bold text-base transition-colors flex items-center justify-center shadow-xs"
                        >
                          0
                        </button>
                        <button 
                          type="button"
                          onClick={handleDeleteDigit}
                          className="h-11 rounded-xl bg-[#221B18] hover:bg-[#2E2420] active:bg-neutral-800 text-neutral-400 font-bold text-sm transition-colors flex items-center justify-center"
                          title="Borrar dígito"
                        >
                          ⌫
                        </button>
                      </div>

                      {/* Recordatorio de cobro */}
                      <div className="text-center text-xs text-neutral-400 flex items-center justify-center space-x-1 pt-1">
                        <DollarSign size={13} className="text-[#F59E0B]" />
                        <span>Recuerda cobrar <strong className="text-white">${order.total?.toFixed(2)} en efectivo</strong></span>
                      </div>

                      {/* Botón Finalizar Entrega */}
                      <button 
                        onClick={handleFinalizeDelivery}
                        className="w-full bg-[#FF6B00] hover:bg-[#E05600] active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#FF6B00]/25 mt-2"
                      >
                        <span className="font-mono tracking-widest">»</span>
                        <span>Confirmar y Finalizar Entrega</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      )}

      {/* MODAL DE CHAT RÁPIDO CON EL CLIENTE */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#1A1513] border border-[#2D2622] rounded-3xl w-full max-w-md flex flex-col h-[480px] shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-4 border-b border-[#29221E] flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white">Chat con {order.nombreCliente}</h3>
                <p className="text-xs text-[#22C55E]">En línea • Pedido #{order.codigoPedido}</p>
              </div>
              <button onClick={() => setShowChatModal(false)} className="p-1.5 text-neutral-400 hover:text-white rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
              {chatMessages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.sender === 'repartidor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'repartidor' 
                      ? 'bg-[#FF6B00] text-white rounded-tr-xs' 
                      : 'bg-[#251E1B] text-neutral-200 rounded-tl-xs border border-[#3A2F2A]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Mensajes rápidos sugeridos */}
            <div className="px-3 py-2 flex space-x-2 overflow-x-auto border-t border-[#29221E]">
              {['¡Ya voy llegando!', 'Estoy afuera en la puerta', 'Tocaré el interfono'].map((quick, qIdx) => (
                <button 
                  key={qIdx}
                  onClick={() => setChatMessages(prev => [...prev, { sender: 'repartidor', text: quick }])}
                  className="shrink-0 text-xs bg-[#241E1B] hover:bg-[#2E2622] text-neutral-300 px-3 py-1 rounded-full border border-[#3A2F2A] transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="p-3 border-t border-[#29221E] flex items-center space-x-2">
              <input 
                type="text" 
                placeholder="Escribe un mensaje al cliente..."
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                className="flex-1 bg-[#201A17] border border-[#352B26] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-[#FF6B00]" 
              />
              <button type="submit" className="p-2.5 rounded-xl bg-[#FF6B00] text-white hover:bg-[#E05600] transition-colors">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
