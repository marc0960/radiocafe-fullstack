package com.radiocafe.domain.model;

import java.math.BigDecimal;

public class Producto {

    private Long idProducto;
    private String nombre;
    private String descripcion;
    private String categoria;
    private BigDecimal precio;
    private String imagenUrl;
    private Boolean disponible;

    public Producto() {
        this.disponible = true;
    }

    public Producto(Long idProducto, String nombre, String descripcion, String categoria, BigDecimal precio, String imagenUrl, Boolean disponible) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.precio = precio;
        this.imagenUrl = imagenUrl;
        this.disponible = disponible != null ? disponible : true;
    }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}
