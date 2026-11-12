package com.radiocafe.infrastructure.adapters.in.web;

import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.Pedido;
import com.radiocafe.domain.ports.in.CreateOrderUseCase;
import com.radiocafe.domain.ports.in.ManageOrderStateUseCase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final CreateOrderUseCase createOrderUseCase;
    private final ManageOrderStateUseCase manageOrderStateUseCase;

    public OrderController(CreateOrderUseCase createOrderUseCase, ManageOrderStateUseCase manageOrderStateUseCase) {
        this.createOrderUseCase = createOrderUseCase;
        this.manageOrderStateUseCase = manageOrderStateUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodos(@RequestParam(required = false) EstadoPedido estado) {
        if (estado != null) {
            return ResponseEntity.ok(manageOrderStateUseCase.obtenerPorEstado(estado));
        }
        return ResponseEntity.ok(manageOrderStateUseCase.obtenerTodos());
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<Pedido> obtenerPorId(@PathVariable Long idPedido) {
        return manageOrderStateUseCase.buscarPorId(idPedido)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{codigoPedido}")
    public ResponseEntity<Pedido> obtenerPorCodigo(@PathVariable String codigoPedido) {
        return manageOrderStateUseCase.buscarPorCodigo(codigoPedido)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevoPedido = createOrderUseCase.crearPedido(pedido);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @PatchMapping("/{idPedido}/status")
    public ResponseEntity<Pedido> cambiarEstado(
            @PathVariable Long idPedido,
            @RequestParam EstadoPedido nuevoEstado) {
        Pedido pedidoActualizado = manageOrderStateUseCase.cambiarEstadoPedido(idPedido, nuevoEstado);
        return ResponseEntity.ok(pedidoActualizado);
    }

    @PostMapping("/{idPedido}/confirm-delivery")
    public ResponseEntity<?> confirmarEntrega(
            @PathVariable Long idPedido,
            @RequestBody Map<String, String> payload) {
        try {
            String pin = payload.get("pin");
            String fotoEvidencia = payload.get("fotoEvidencia");
            Pedido entregado = manageOrderStateUseCase.confirmarEntrega(idPedido, pin, fotoEvidencia);
            return ResponseEntity.ok(entregado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
