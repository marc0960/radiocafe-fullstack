package com.radiocafe.domain.model;

import java.math.BigDecimal;

public class Producto {
    private Long idProducto;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String categoria;
    private boolean esPersonalizable;
    private String formatoEnvase;
    private Integer stock;
    private boolean esMasVendido;
    private String etiquetaMl;
    private String imagenUrl;

    public Producto() {}

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public boolean isEsPersonalizable() { return esPersonalizable; }
    public void setEsPersonalizable(boolean esPersonalizable) { this.esPersonalizable = esPersonalizable; }

    public String getFormatoEnvase() { return formatoEnvase; }
    public void setFormatoEnvase(String formatoEnvase) { this.formatoEnvase = formatoEnvase; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public boolean isEsMasVendido() { return esMasVendido; }
    public void setEsMasVendido(boolean esMasVendido) { this.esMasVendido = esMasVendido; }

    public String getEtiquetaMl() { return etiquetaMl; }
    public void setEtiquetaMl(String etiquetaMl) { this.etiquetaMl = etiquetaMl; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}