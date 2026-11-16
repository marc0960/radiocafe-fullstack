import React from 'react';
import BartenderTopbar from '../context/BartenderTopbar';
import { useOrders } from '../context/OrderContext';

export default function BartenderDashboard() {
  const { pedidosBartender, actualizarEstadoPedido, cargando } = useOrders();

  return (
    <div style={{ minHeight: '100vh', background: '#faf8f5', fontFamily: 'system-ui, sans-serif' }}>
      <BartenderTopbar totalActivos={pedidosBartender.length} />

      <main style={{ maxWidth: '1220px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '1.85rem', color: '#1a1a1a', margin: 0 }}>
            Comandas en Barra
          </h1>
          <p style={{ color: '#666', marginTop: '4px' }}>
            Revisa las especificaciones de preparación de café y los acompañamientos de panadería.
          </p>
        </div>

        {pedidosBartender.length === 0 ? (
          <div
            style={{
              background: '#fff',
              borderRadius: '18px',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              border: '1px solid #eee',
            }}
          >
            <h3 style={{ color: '#333', marginBottom: '6px' }}>No hay pedidos pendientes</h3>
            <p style={{ color: '#888', margin: 0 }}>
              Cuando un cliente confirme su compra, la comanda aparecerá aquí automáticamente.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {pedidosBartender.map((pedido) => {
              const esPendiente = pedido.estado === 'PENDIENTE';
              return (
                <div
                  key={pedido.id}
                  style={{
                    background: '#fff',
                    borderRadius: '18px',
                    padding: '1.4rem',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    borderTop: `6px solid ${esPendiente ? '#d95d1e' : '#f39c12'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Cabecera de la comanda */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#1a1a1a' }}>
                        Pedido #{pedido.id}
                      </strong>
                      <span
                        style={{
                          background: pedido.tipoEntrega === 'DELIVERY' ? '#fdebd0' : '#e8f8f5',
                          color: pedido.tipoEntrega === 'DELIVERY' ? '#b9770e' : '#117864',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {pedido.tipoEntrega === 'DELIVERY' ? 'DELIVERY' : 'EN LOCAL'}
                      </span>
                    </div>

                    {pedido.direccionEntrega && (
                      <div
                        style={{
                          background: '#f7f7f7',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '0.84rem',
                          color: '#555',
                          marginBottom: '1rem',
                        }}
                      >
                        Dirección: <strong>{pedido.direccionEntrega}</strong>
                      </div>
                    )}

                    {/* Lista de cafés, panes y combos */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
                      {pedido.items?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            borderBottom: '1px dashed #e5e5e5',
                            paddingBottom: '10px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '1rem', color: '#1a1a1a' }}>
                              {item.cantidad}x {item.productoNombre}
                            </strong>
                            <span
                              style={{
                                background: '#fff3e6',
                                color: '#d95d1e',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '10px',
                              }}
                            >
                              {item.categoria}
                            </span>
                          </div>

                          {item.especificaciones ? (
                            <div
                              style={{
                                marginTop: '6px',
                                background: '#fff6ee',
                                borderLeft: '3px solid #d95d1e',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.86rem',
                                color: '#873600',
                              }}
                            >
                              <strong>Especificaciones:</strong> {item.especificaciones}
                            </div>
                          ) : (
                            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#888' }}>
                              Sin notas adicionales (receta estándar)
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    disabled={cargando}
                    onClick={() =>
                      actualizarEstadoPedido(pedido.id, esPendiente ? 'PREPARANDO' : 'LISTO')
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: esPendiente ? '#1a1a1a' : '#27ae60',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                  >
                    {esPendiente ? 'Empezar Preparación' : 'Marcar como Listo'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}