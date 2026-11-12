const API_BASE_URL = "http://localhost:8080/api/insumos-barra";

/**
 * Obtiene únicamente los insumos disponibles en barra y los agrupa por tipo.
 */
export async function obtenerInsumosDisponiblesAgrupados() {
  const response = await fetch(`${API_BASE_URL}/disponibles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al cargar insumos (${response.status})`);
  }

  const lista = await response.json();

  return {
    tamanosVaso: lista.filter((item) => item.tipo === "TAMANO_VASO"),
    leches: lista.filter((item) => item.tipo === "LECHE"),
    endulzantes: lista.filter((item) => item.tipo === "ENDULZANTE"),
    extras: lista.filter((item) => item.tipo === "EXTRA"),
  };
}