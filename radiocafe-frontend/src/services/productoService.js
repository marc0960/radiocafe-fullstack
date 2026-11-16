const API_URL = "http://localhost:8080/api/productos";

export async function obtenerProductos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al cargar el catálogo");
  return res.json();
}

export async function crearProductoConImagen({ nombre, descripcion, precio, categoria, imagenFile }) {
  const formData = new FormData();
  formData.append("nombre", nombre);
  formData.append("descripcion", descripcion);
  formData.append("precio", precio);
  formData.append("categoria", categoria);
  if (imagenFile) {
    formData.append("imagen", imagenFile);
  }

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al guardar el producto");
  return res.json();
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar el producto");
}