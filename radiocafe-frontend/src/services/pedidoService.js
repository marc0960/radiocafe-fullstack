const API_PEDIDOS = "http://localhost:8080/api/pedidos";

export async function enviarPedido(pedidoData) {
  const res = await fetch(API_PEDIDOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedidoData),
  });
  if (!res.ok) throw new Error("No se pudo registrar el pedido");
  return res.json();
}

export async function obtenerColaBartender() {
  const res = await fetch(`${API_PEDIDOS}/bartender`);
  if (!res.ok) throw new Error("Error cargando cola de bartender");
  return res.json();
}

export async function obtenerVentasAdmin() {
  const res = await fetch(`${API_PEDIDOS}/admin`);
  if (!res.ok) throw new Error("Error cargando ventas");
  return res.json();
}

export async function cambiarEstadoPedido(id, estado) {
  const res = await fetch(`${API_PEDIDOS}/${id}/estado`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw new Error("Error actualizando estado");
  return res.json();
}