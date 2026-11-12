import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Truck, Store, LogOut, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import ModalPersonalizarBebida from '../components/ModalPersonalizarBebida';

export default function ClientCatalog() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { productos } = useProducts();

  const [cart, setCart] = useState([]);
  const [tipoEntrega, setTipoEntrega] = useState('DELIVERY');
  const [direccion, setDireccion] = useState('');
  const [bebidaSeleccionada, setBebidaSeleccionada] = useState(null);

  // Detecta si un producto es bebida personalizable según su categoría y nombre
  const esBebidaPersonalizable = (product) => {
    const cat = (product.categoria || '').toUpperCase();
    const nom = (product.nombre || '').toUpperCase();
    if (nom.includes('BOLSA') || nom.includes('GRANO')) return false;
    return (
      cat.includes('CAF') ||
      cat.includes('BEBIDA') ||
      cat.includes('ESPRESSO') ||
      cat.includes('FRÍO') ||
      cat.includes('FRIO') ||
      cat.includes('CALIENTE') ||
      cat.includes('INFUSI')
    );
  };

  // Agrega un producto directo (aperitivos/postres) o ya personalizado desde la vista de bebida
  const addToCart = (product, personalizacion = '', precioFinal = null, qty = 1) => {
    const precioUnitario = precioFinal !== null ? Number(precioFinal) : Number(product.precio);
    const idBase = product.id ? product.id : product.idProducto;
    const cartItemId = `${idBase}-${personalizacion}`;

    const existing = cart.find((item) => item.cartItemId === cartItemId);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, cantidad: item.cantidad + qty }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          cartItemId,
          precio: precioUnitario,
          cantidad: qty,
          personalizacion,
        },
      ]);
    }
  };

  const handleAgregarPersonalizado = (itemPersonalizado) => {
    addToCart(
      {
        id: itemPersonalizado.idProducto,
        nombre: itemPersonalizado.nombre,
        precio: itemPersonalizado.precioUnitario,
      },
      itemPersonalizado.personalizacion,
      itemPersonalizado.precioUnitario,
      itemPersonalizado.cantidad
    );
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(
      cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.cantidad + delta;
          return newQty > 0 ? { ...item, cantidad: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const costoEnvio = tipoEntrega === 'DELIVERY' ? (subtotal >= 50.0 ? 0.0 : 5.0) : 0.0;
  const total = subtotal + costoEnvio;

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2C221E]">
      <header className="bg-[#E05600] text-white px-8 py-4 flex items-center justify-between shadow-md sticky top-0 z-20">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/assets/logo-radiocafe.png"
            alt="RadioCafé"
            className="w-9 h-9 rounded-full object-contain bg-black/20"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="font-extrabold text-xl tracking-wider uppercase">RadioCafé</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-1.5 text-xs font-bold bg-black/20 hover:bg-black/40 px-3.5 py-2 rounded-full transition-all"
        >
          <LogOut size={14} />
          <span>Cerrar Sesión</span>
        </button>
      </header>

      {bebidaSeleccionada ? (
        <ModalPersonalizarBebida
          producto={bebidaSeleccionada}
          abierto={true}
          onCerrar={() => setBebidaSeleccionada(null)}
          onAgregarAlCarrito={handleAgregarPersonalizado}
        />
      ) : (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-black font-serif text-[#2C221E]">Menú de Especialidad</h1>
              <p className="text-sm text-neutral-500">
                Selecciona tus cafés y aperitivos favoritos para tu orden.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productos.map((p) => {
                const esBebida = esBebidaPersonalizable(p);
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#E05600] transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="bg-orange-100 text-[#E05600] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                          {p.categoria}
                        </span>
                        <span className="font-black text-base text-[#E05600]">
                          S/ {Number(p.precio).toFixed(2)}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-neutral-800 group-hover:text-[#E05600] transition-colors">
                        {p.nombre}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                        {p.desc || 'Producto fresco preparado al momento.'}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        esBebida ? setBebidaSeleccionada(p) : addToCart(p)
                      }
                      className="mt-4 w-full bg-neutral-900 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-[#E05600] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow"
                    >
                      {esBebida ? (
                        <>
                          <SlidersHorizontal size={14} />
                          <span>Personalizar Bebida</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Agregar al Pedido</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-lg h-fit sticky top-24 space-y-6">
            <div className="flex items-center space-x-2 border-b border-neutral-100 pb-4">
              <ShoppingCart size={20} className="text-[#E05600]" />
              <h2 className="font-black text-lg text-neutral-900">Tu Pedido</h2>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">
                Tipo de Entrega
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoEntrega('DELIVERY')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
                    tipoEntrega === 'DELIVERY'
                      ? 'bg-[#E05600] text-white border-[#E05600] shadow-sm'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <Truck size={14} />
                  <span>Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTipoEntrega('PICKUP')}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1 border transition-all ${
                    tipoEntrega === 'PICKUP'
                      ? 'bg-[#E05600] text-white border-[#E05600] shadow-sm'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <Store size={14} />
                  <span>En Local</span>
                </button>
              </div>
            </div>

            {tipoEntrega === 'DELIVERY' && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 ${
                  subtotal >= 50.0
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-orange-50 text-[#E05600] border border-orange-200'
                }`}
              >
                <Truck size={16} className="shrink-0" />
                <span>
                  {subtotal >= 50.0
                    ? '¡Felicidades! Tienes ENVÍO GRATIS.'
                    : `Agrega S/ ${(50.0 - subtotal).toFixed(2)} más para obtener Envío Gratis.`}
                </span>
              </div>
            )}

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <p className="text-center text-xs text-neutral-400 py-6">
                  Tu carrito está vacío.
                </p>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between text-xs bg-neutral-50 p-2.5 rounded-xl border border-neutral-100"
                  >
                    <div className="flex-1 pr-2">
                      <p className="font-bold text-neutral-800">{item.nombre}</p>
                      {item.personalizacion && (
                        <p className="text-[11px] text-[#E05600] mt-0.5 leading-snug">
                          {item.personalizacion}
                        </p>
                      )}
                      <p className="text-neutral-500 mt-0.5">
                        S/ {item.precio.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, -1)}
                        className="p-1 hover:bg-neutral-200 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold px-1">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="p-1 hover:bg-neutral-200 rounded"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {tipoEntrega === 'DELIVERY' && (
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-500 mb-1">
                  Dirección de Entrega
                </label>
                <input
                  type="text"
                  placeholder="Calle / Av. y Número de departamento"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#E05600]"
                />
              </div>
            )}

            <div className="border-t border-neutral-100 pt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold">S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Costo de Envío:</span>
                <span className="font-semibold">
                  {costoEnvio === 0 ? 'GRATIS' : `S/ ${costoEnvio.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 border-t pt-2">
                <span>Total a Pagar:</span>
                <span className="text-[#E05600]">S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() =>
                alert('¡Pedido confirmado! Tu orden ha sido enviada a cocina.')
              }
              className="w-full bg-[#E05600] disabled:bg-neutral-300 text-white py-3 rounded-xl font-bold text-xs hover:bg-[#C04800] hover:shadow-lg transition-all shadow-md"
            >
              Confirmar y Pagar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}