-- 1. USUARIOS (Incluyendo Bartender y Admin)
INSERT INTO usuarios (nombre, email, password_hash, rol, es_cliente_verificado) VALUES
('Admin RadioCafe', 'admin@radiocafe.pe', '$2a$10$dummyhashadmin1234567890', 'ADMIN', TRUE),
('Carlos Barista', 'barra@radiocafe.pe', '$2a$10$dummyhashbarista123456', 'BARTENDER', TRUE),
('Valeria Creadora', 'valeria.art@gmail.com', '$2a$10$dummyhashuser1234567890', 'CREADOR', TRUE),
('Mateo Dev', 'mateo.it@gmail.com', '$2a$10$dummyhashuser0987654321', 'CLIENTE', FALSE);

-- 2. INSUMOS DE BARRA (Controlados por Admin/Bartender)
INSERT INTO insumos_barra (tipo, nombre, precio_extra, disponible) VALUES
-- Tamaños de vaso
('TAMANO_VASO', 'Tall (12 oz)', 0.00, TRUE),
('TAMANO_VASO', 'Grande (16 oz)', 2.00, TRUE),
('TAMANO_VASO', 'Venti (20 oz)', 3.50, TRUE),
-- Tipos de leche
('LECHE', 'Sin Leche / Solo Agua', 0.00, TRUE),
('LECHE', 'Leche Entera', 0.00, TRUE),
('LECHE', 'Leche Deslactosada', 0.00, TRUE),
('LECHE', 'Leche Light / Descremada', 0.00, TRUE),
('LECHE', 'Leche de Avena', 2.50, TRUE),
('LECHE', 'Leche de Almendras', 2.50, TRUE),
('LECHE', 'Leche de Soya', 2.00, TRUE),
-- Nivel y tipo de azúcar / endulzante
('ENDULZANTE', 'Sin Azúcar (0%)', 0.00, TRUE),
('ENDULZANTE', 'Azúcar Rubia (50% - Poco dulce)', 0.00, TRUE),
('ENDULZANTE', 'Azúcar Rubia (100% - Normal)', 0.00, TRUE),
('ENDULZANTE', 'Azúcar Blanca', 0.00, TRUE),
('ENDULZANTE', 'Stevia Natural', 0.00, TRUE),
('ENDULZANTE', 'Panela Orgánica', 0.50, TRUE),
('ENDULZANTE', 'Miel de Abeja', 1.00, TRUE),
-- Extras opcionales
('EXTRA', 'Shot Extra de Espresso', 3.00, TRUE),
('EXTRA', 'Crema Batida', 2.00, TRUE),
('EXTRA', 'Salsa de Caramelo', 1.50, TRUE);

-- 3. PRODUCTOS (Personalizables vs Directos)
INSERT INTO productos (nombre, descripcion, precio, categoria, es_personalizable, formato_envase, stock, es_mas_vendido, etiqueta_ml, imagen_url) VALUES
('Latte Kappu Art', 'Doble shot de espresso con leche texturizada y arte latte exclusivo.', 12.00, 'CAFE', TRUE, 'Vaso Tall / Grande / Venti', 80, TRUE, 'FAVORITO_CREADORES', 'https://images.unsplash.com/photo-1541167760496-1628856ab772'),
('Cappuccino Clásico', 'Espresso intenso con leche vaporizada y espuma densa espolvoreada con cacao.', 11.50, 'CAFE', TRUE, 'Vaso Tall / Grande / Venti', 80, TRUE, 'TOP_VENTAS', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d'),
('Americano de Especialidad', 'Doble espresso suavizado con agua purificada caliente o con hielo.', 9.00, 'CAFE', TRUE, 'Vaso Tall / Grande / Venti', 100, FALSE, 'ESTANDAR', 'https://images.unsplash.com/photo-1551030173-122aabc4489c'),
('Caramel Frappuccino', 'Bebida licuada con café, hielo frappé, leche, jarabe y hilos de caramelo.', 15.50, 'FRAPPUCCINO', TRUE, 'Vaso Domo Tall / Grande / Venti', 60, TRUE, 'TOP_VENTAS', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735'),
('Infusión Andina (Muña & Hierba Luisa)', 'Hierbas aromáticas seleccionadas servidas en vaso térmico desechable tipo taza.', 8.50, 'INFUSION', TRUE, 'Vaso térmico desechable 12/16 oz', 90, FALSE, 'RECOMENDADO_ML', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574'),
('Refresco de Maracuyá & Hierbabuena', 'Pulpa fresca de maracuyá con hojas de hierbabuena y opción de toque cremoso.', 10.50, 'REFRESCO', TRUE, 'Vaso frío 12/16 oz', 70, FALSE, 'RECOMENDADO_ML', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd'),
('Cheesecake de Maracuyá', 'Base crocante de galleta con crema suave y reducción natural de maracuyá.', 14.00, 'POSTRES', FALSE, 'Porción en plato', 35, TRUE, 'TOP_VENTAS', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad');