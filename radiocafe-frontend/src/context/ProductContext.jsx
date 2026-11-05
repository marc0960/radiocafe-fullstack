import React, { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

const initialProducts = [
  { id: 1, nombre: 'Flat White Doble', categoria: 'CAFE', precio: 4.50, desc: 'Doble shot de espresso de especialidad con leche texturizada.', estado: 'Disponible' },
  { id: 2, nombre: 'Cold Brew Radio', categoria: 'CAFE', precio: 5.00, desc: 'Extracción en frío de 18 hrs con notas cítricas y dulces.', estado: 'Disponible' },
  { id: 3, nombre: 'Croissant Mantequilla', categoria: 'PASTELERIA', precio: 3.50, desc: 'Clásico hojaldre francés recién horneado.', estado: 'Disponible' },
  { id: 4, nombre: 'Combo Desayuno Sintonía', categoria: 'COMBO', precio: 12.00, desc: 'Café a elección + Sandwich de jamón artesanal + Jugo natural.', estado: 'Disponible' },
  { id: 5, nombre: 'Bolsa Café en Grano 250g', categoria: 'CAFE', precio: 18.00, desc: 'Granos selección especial origen Villa Rica.', estado: 'Disponible' },
  { id: 6, nombre: 'Cheesecake Frutos Rojos', categoria: 'PASTELERIA', precio: 6.50, desc: 'Cremoso pastel con mermelada artesanal.', estado: 'Disponible' }
];

export const ProductProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => {
    const saved = localStorage.getItem('radiocafe_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('radiocafe_products', JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = (nuevo) => {
    setProductos((prev) => [nuevo, ...prev]);
  };

  const eliminarProducto = (id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ productos, agregarProducto, eliminarProducto }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);