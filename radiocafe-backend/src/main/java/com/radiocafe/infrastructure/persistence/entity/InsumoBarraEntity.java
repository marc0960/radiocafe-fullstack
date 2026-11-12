package com.radiocafe.infrastructure.persistence.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "insumos_barra")
public class InsumoBarraEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_insumo")
    private Long idInsumo;

    @Column(name = "tipo", nullable = false, length = 40)
    private String tipo; // TAMANO_VASO, LECHE, ENDULZANTE, EXTRA

    @Column(name = "nombre", nullable = false, length = 80)
    private String nombre;

    @Column(name = "precio_extra", precision = 10, scale = 2)
    private BigDecimal precioExtra = BigDecimal.ZERO;

    @Column(name = "disponible")
    private Boolean disponible = true;

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public InsumoBarraEntity() {}

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