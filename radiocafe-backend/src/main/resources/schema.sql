DROP TABLE IF EXISTS insumos_barra CASCADE;
DROP TABLE IF EXISTS obras_kappu CASCADE;
DROP TABLE IF EXISTS detalle_pedidos CASCADE;
DROP TABLE IF EXISTS pedidos CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(30) DEFAULT 'CLIENTE', -- 'CLIENTE', 'CREADOR', 'BARTENDER', 'ADMIN'
    es_cliente_verificado BOOLEAN DEFAULT FALSE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10, 2) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'CAFE', 'FRAPPUCCINO', 'INFUSION', 'REFRESCO', 'POSTRES', 'COMIDA'
    es_personalizable BOOLEAN DEFAULT FALSE, -- TRUE: abre el formulario desplegable abajo
    formato_envase VARCHAR(80), -- Ej: 'Vaso Tall/Grande/Venti', 'Vaso térmico desechable', 'Pocillo'
    stock INT DEFAULT 50,
    es_mas_vendido BOOLEAN DEFAULT FALSE,
    etiqueta_ml VARCHAR(60) DEFAULT 'ESTANDAR',
    imagen_url TEXT
);

-- Tabla administrada por Admin/Bartender (Activar/Desactivar insumos faltantes)
CREATE TABLE insumos_barra (
    id_insumo SERIAL PRIMARY KEY,
    tipo VARCHAR(40) NOT NULL, -- 'TAMANO_VASO', 'LECHE', 'ENDULZANTE', 'EXTRA'
    nombre VARCHAR(80) NOT NULL,
    precio_extra NUMERIC(10, 2) DEFAULT 0.00,
    disponible BOOLEAN DEFAULT TRUE -- FALSE cuando el bartender reporta que se acabó
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    numero_mesa INT,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(30) DEFAULT 'PENDIENTE',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalle_pedidos (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES productos(id_producto) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    personalizacion TEXT, -- Ej: 'Vaso: Grande | Leche: Avena | Azúcar: 50% Rubia | Extra: Crema batida'
    subtotal NUMERIC(10, 2) NOT NULL
);

CREATE TABLE obras_kappu (
    id_obra SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    archivo_url TEXT NOT NULL,
    votos INT DEFAULT 0,
    estado_moderacion VARCHAR(30) DEFAULT 'APROBADA',
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Procedimiento para que el Admin/Bartender cambie disponibilidad de un insumo al instante
CREATE OR REPLACE PROCEDURE sp_toggle_insumo_barra(
    p_id_insumo INT,
    p_disponible BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE insumos_barra
    SET disponible = p_disponible
    WHERE id_insumo = p_id_insumo;
END;
$$;