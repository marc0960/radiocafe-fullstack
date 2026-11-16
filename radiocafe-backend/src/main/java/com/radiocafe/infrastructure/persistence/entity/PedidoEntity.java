package com.radiocafe.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos_rc")
public class PedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clienteNombre = "Cliente RadioCafé";

    @Column(nullable = false)
    private String tipoEntrega; // "DELIVERY" o "EN_LOCAL"

    private String direccionEntrega;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String estado = "PENDIENTE"; // PENDIENTE, PREPARANDO, LISTO, ENTREGADO

    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<DetallePedidoEntity> items = new ArrayList<>();

    public void agregarItem(DetallePedidoEntity item) {
        items.add(item);
        item.setPedido(this);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public String getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(String tipoEntrega) { this.tipoEntrega = tipoEntrega; }

    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<DetallePedidoEntity> getItems() { return items; }
    public void setItems(List<DetallePedidoEntity> items) { this.items = items; }
}