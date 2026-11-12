package com.radiocafe.infrastructure.config;

import com.radiocafe.domain.model.DetallePedido;
import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.Pedido;
import com.radiocafe.domain.model.TipoEntrega;
import com.radiocafe.domain.ports.out.OrderRepositoryPort;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final OrderRepositoryPort orderRepositoryPort;

    public DataInitializer(OrderRepositoryPort orderRepositoryPort) {
        this.orderRepositoryPort = orderRepositoryPort;
    }

    @Override
    public void run(String... args) throws Exception {
        if (orderRepositoryPort.obtenerTodos().isEmpty()) {
            // Pedido principal de prueba #RP-2048 (Coincide con el diseño de las capturas)
            Pedido pedido1 = new Pedido();
            pedido1.setCodigoPedido("RP-2048");
            pedido1.setIdUsuario(101L);
            pedido1.setNombreCliente("Lucía Méndez");
            pedido1.setTelefonoCliente("+52 55 4912 3840");
            pedido1.setDireccionEntrega("Av. Álvaro Obregón 148, Roma Norte, CDMX");
            pedido1.setLatitud(19.41740);
            pedido1.setLongitud(-99.16240);
            pedido1.setNotasPedido("Entregar en vaso térmico, poco azúcar");
            pedido1.setPinEntrega("1842");
            pedido1.setMetodoPago("EFECTIVO");
            pedido1.setEstadoPedido(EstadoPedido.LISTO); // Listo para recoger en barra
            pedido1.setTipoEntrega(TipoEntrega.DELIVERY);

            DetallePedido d1 = new DetallePedido(1L, "Capuchino Grande (Leche de Almendras)", 1, new BigDecimal("4.50"));
            DetallePedido d2 = new DetallePedido(2L, "Muffin de arándanos", 2, new BigDecimal("2.50"));
            DetallePedido d3 = new DetallePedido(3L, "Iced Caramel Latte 500ml", 1, new BigDecimal("3.00"));

            pedido1.setDetalles(List.of(d1, d2, d3));
            pedido1.setSubtotal(new BigDecimal("12.50"));
            pedido1.setCostoEnvio(BigDecimal.ZERO);
            pedido1.setTotal(new BigDecimal("12.50"));

            orderRepositoryPort.guardar(pedido1);

            // Pedido secundario de prueba #RP-2049
            Pedido pedido2 = new Pedido();
            pedido2.setCodigoPedido("RP-2049");
            pedido2.setIdUsuario(102L);
            pedido2.setNombreCliente("Carlos Mendoza");
            pedido2.setTelefonoCliente("+52 55 8821 9012");
            pedido2.setDireccionEntrega("Calle Colima 220, Roma Norte, CDMX");
            pedido2.setLatitud(19.41920);
            pedido2.setLongitud(-99.16010);
            pedido2.setNotasPedido("Timbre departamento 301");
            pedido2.setPinEntrega("5921");
            pedido2.setMetodoPago("EFECTIVO");
            pedido2.setEstadoPedido(EstadoPedido.LISTO);
            pedido2.setTipoEntrega(TipoEntrega.DELIVERY);

            DetallePedido d4 = new DetallePedido(4L, "Flat White Especial", 2, new BigDecimal("4.50"));
            DetallePedido d5 = new DetallePedido(5L, "Croissant Mantequilla", 1, new BigDecimal("3.50"));

            pedido2.setDetalles(List.of(d4, d5));
            pedido2.setSubtotal(new BigDecimal("12.50"));
            pedido2.setCostoEnvio(BigDecimal.ZERO);
            pedido2.setTotal(new BigDecimal("12.50"));

            orderRepositoryPort.guardar(pedido2);

            System.out.println(">>> Datos de prueba inicializados para Repartidor (Pedidos #RP-2048 y #RP-2049 creados)");
        }
    }
}
