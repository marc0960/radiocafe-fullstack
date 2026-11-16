import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
const API_PEDIDOS = 'http://localhost:8080/api/pedidos';

export const OrderProvider = ({ children }) => {
  const [pedidosBartender, setPedidosBartender] = useState([]);
  const [ventasAdmin, setVentasAdmin] = useState([]);
  const [cargando, setCargando] = useState(false);

  // 1. Cliente envía pedido ("Confirmar y Pagar") -> PostgreSQL
  const registrarPedido = async ({ clienteNombre = 'Cliente RadioCafé', tipoEntrega, direccionEntrega = '', total, items }) => {
    const payload = {
      clienteNombre,
      tipoEntrega, // "DELIVERY" o "EN_LOCAL"
      direccionEntrega,
      total,
      items: items.map((item) => ({
        productoNombre: item.nombre,
        categoria: item.categoria || 'GENERAL',
        cantidad: item.cantidad || 1,
        precioUnitario: item.precio,
        especificaciones: item.especificaciones || item.personalizacion || '',
      })),
    };

    const res = await fetch(API_PEDIDOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Error al registrar el pedido en PostgreSQL');
    const creado = await res.json();
    await cargarPedidosBartender();
    await cargarVentasAdmin();
    return creado;
  };

  // 2. Bartender consulta pedidos pendientes/en preparación
  const cargarPedidosBartender = async () => {
    try {
      const res = await fetch(`${API_PEDIDOS}/bartender`);
      if (res.ok) {
        const data = await res.json();
        setPedidosBartender(data);
      }
    } catch (error) {
      console.error('Error cargando cola del bartender:', error);
    }
  };

  // 3. Administrador consulta todas las compras confirmadas
  const cargarVentasAdmin = async () => {
    try {
      const res = await fetch(`${API_PEDIDOS}/admin`);
      if (res.ok) {
        const data = await res.json();
        setVentasAdmin(data);
      }
    } catch (error) {
      console.error('Error cargando ventas para admin:', error);
    }
  };

  // 4. Bartender actualiza estado ("PREPARANDO" -> "LISTO")
  const actualizarEstadoPedido = async (id, nuevoEstado) => {
    setCargando(true);
    try {
      const res = await fetch(`${API_PEDIDOS}/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) {
        await cargarPedidosBartender();
        await cargarVentasAdmin();
      }
    } catch (error) {
      console.error('Error cambiando estado del pedido:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidosBartender();
    cargarVentasAdmin();
    const intervalo = setInterval(() => {
      cargarPedidosBartender();
    }, 4000); // Polling cada 4 segundos para recibir pedidos nuevos al instante
    return () => clearInterval(intervalo);
  }, []);

  return (
    <OrderContext.Provider
      value={{
        pedidosBartender,
        ventasAdmin,
        cargando,
        registrarPedido,
        cargarPedidosBartender,
        cargarVentasAdmin,
        actualizarEstadoPedido,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);