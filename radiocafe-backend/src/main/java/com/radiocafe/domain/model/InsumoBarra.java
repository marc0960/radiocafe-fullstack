package com.radiocafe.domain.model;

import java.math.BigDecimal;

public class InsumoBarra {
    private Long idInsumo;
    private String tipo; // TAMANO_VASO, LECHE, ENDULZANTE, EXTRA
    private String nombre;
    private BigDecimal precioExtra;
    private boolean disponible;

    public InsumoBarra() {}

    public Long getIdInsumo() { return idInsumo; }
    public void setIdInsumo(Long idInsumo) { this.idInsumo = idInsumo; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public BigDecimal getPrecioExtra() { return precioExtra; }
    public void setPrecioExtra(BigDecimal precioExtra) { this.precioExtra = precioExtra; }

    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}