package com.radiocafe.web.controller;

import com.radiocafe.infrastructure.persistence.entity.DetallePedidoEntity;
import com.radiocafe.infrastructure.persistence.entity.PedidoEntity;
import com.radiocafe.infrastructure.persistence.repository.PedidoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final PedidoRepository pedidoRepository;

    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    // 1. Cliente envía su pedido ("Confirmar y Pagar")
    @PostMapping
    public ResponseEntity<PedidoEntity> crearPedido(@RequestBody PedidoEntity pedido) {
        if (pedido.getItems() != null) {
            for (DetallePedidoEntity item : pedido.getItems()) {
                item.setPedido(pedido);
            }
        }
        pedido.setEstado("PENDIENTE");
        PedidoEntity guardado = pedidoRepository.save(pedido);
        return ResponseEntity.ok(guardado);
    }

    // 2. Bartender consulta los pedidos activos en cola
    @GetMapping("/bartender")
    public ResponseEntity<List<PedidoEntity>> obtenerPedidosBartender() {
        return ResponseEntity.ok(
            pedidoRepository.findByEstadoInOrderByFechaCreacionAsc(List.of("PENDIENTE", "PREPARANDO"))
        );
    }

    // 3. Administrador consulta todas las ventas confirmadas
    @GetMapping("/admin")
    public ResponseEntity<List<PedidoEntity>> obtenerHistorialAdmin() {
        return ResponseEntity.ok(pedidoRepository.findAllByOrderByFechaCreacionDesc());
    }

    // 4. Bartender cambia estado ("PREPARANDO" -> "LISTO" -> "ENTREGADO")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoEntity> actualizarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        return pedidoRepository.findById(id)
                .map(pedido -> {
                    pedido.setEstado(body.get("estado"));
                    return ResponseEntity.ok(pedidoRepository.save(pedido));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}