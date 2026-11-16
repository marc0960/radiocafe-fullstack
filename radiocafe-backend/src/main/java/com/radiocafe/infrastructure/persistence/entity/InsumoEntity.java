package com.radiocafe.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "insumos")
public class InsumoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre; // Ej: "Café en Grano Villa Rica"

    @Column(nullable = false)
    private String unidadMedida; // Ej: "gramos", "ml", "unidades"

    @Column(nullable = false)
    private Double stockActual;

    public InsumoEntity() {}

    public InsumoEntity(String nombre, String unidadMedida, Double stockActual) {
        this.nombre = nombre;
        this.unidadMedida = unidadMedida;
        this.stockActual = stockActual;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public Double getStockActual() { return stockActual; }
    public void setStockActual(Double stockActual) { this.stockActual = stockActual; }
}