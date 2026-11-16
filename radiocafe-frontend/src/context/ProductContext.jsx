import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();
const API_URL = 'http://localhost:8080/api/productos';

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);

  // Normaliza los campos de PostgreSQL para que tu diseño original siga funcionando igual
  const mapearProducto = (p) => ({
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    precio: Number(p.precio),
    desc: p.descripcion || 'Nuevo producto agregado por el Administrador.',
    imagenUrl: p.imagenUrl || null,
    insumosReceta: p.insumosReceta || '',
    estado: p.disponible === false ? 'Agotado' : 'Disponible',
  });

  const cargarProductos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      setProductos(data.map(mapearProducto));
    } catch (error) {
      console.error('Error conectando con PostgreSQL:', error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Soporta subida con imagen (FormData) y recetas de insumos de café
  const agregarProducto = async (nuevo) => {
    try {
      const formData = new FormData();
      formData.append('nombre', nuevo.nombre);
      formData.append('descripcion', nuevo.desc || nuevo.descripcion || 'Nuevo producto agregado por el Administrador.');
      formData.append('precio', nuevo.precio);
      formData.append('categoria', nuevo.categoria);

      if (nuevo.insumosReceta) {
        formData.append('insumosReceta', nuevo.insumosReceta);
      }
      if (nuevo.imagenFile) {
        formData.append('imagen', nuevo.imagenFile);
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al guardar producto en PostgreSQL');
      const creado = await res.json();
      setProductos((prev) => [mapearProducto(creado), ...prev]);
      return creado;
    } catch (error) {
      console.error('Error creando producto:', error);
      alert('No se pudo guardar el producto en la base de datos.');
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  return (
    <ProductContext.Provider value={{ productos, agregarProducto, eliminarProducto, cargarProductos }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);