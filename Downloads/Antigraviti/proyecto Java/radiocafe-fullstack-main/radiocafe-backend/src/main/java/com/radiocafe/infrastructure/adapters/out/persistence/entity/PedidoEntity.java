package com.radiocafe.infrastructure.adapters.out.persistence.entity;

import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.TipoEntrega;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long idPedido;

    @Column(name = "codigo_pedido", length = 30)
    private String codigoPedido;

    @Column(name = "id_usuario", nullable = false)
    private Long idUsuario;

    @Column(name = "nombre_cliente")
    private String nombreCliente;

    @Column(name = "telefono_cliente")
    private String telefonoCliente;

    @Column(name = "notas_pedido", columnDefinition = "TEXT")
    private String notasPedido;

    @Column(name = "pin_entrega", length = 10)
    private String pinEntrega;

    @Column(name = "metodo_pago", length = 30)
    private String metodoPago;

    @Column(name = "foto_evidencia_url", columnDefinition = "TEXT")
    private String fotoEvidenciaUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pedido", nullable = false, length = 30)
    private EstadoPedido estadoPedido;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entrega", nullable = false, length = 20)
    private TipoEntrega tipoEntrega;

    @Column(name = "direccion_entrega", columnDefinition = "TEXT")
    private String direccionEntrega;

    private Double latitud;
    private Double longitud;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "costo_envio", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoEnvio;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_pedido")
    private List<DetallePedidoEntity> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDateTime.now();
        }
        if (this.estadoPedido == null) {
            this.estadoPedido = EstadoPedido.PENDIENTE;
        }
        if (this.costoEnvio == null) {
            this.costoEnvio = BigDecimal.ZERO;
        }
        if (this.subtotal == null) {
            this.subtotal = BigDecimal.ZERO;
        }
        if (this.total == null) {
            this.total = this.subtotal.add(this.costoEnvio);
        }
    }
}
