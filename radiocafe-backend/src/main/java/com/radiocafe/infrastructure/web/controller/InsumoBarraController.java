package com.radiocafe.infrastructure.web.controller;

import com.radiocafe.infrastructure.persistence.entity.InsumoBarraEntity;
import com.radiocafe.infrastructure.persistence.repository.SpringDataInsumoBarraRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insumos-barra")

public class InsumoBarraController {

    private final SpringDataInsumoBarraRepository repository;

    public InsumoBarraController(SpringDataInsumoBarraRepository repository) {
        this.repository = repository;
    }

    // 1. Para Admin/Bartender: lista TODOS los insumos (disponibles y agotados)
    @GetMapping
    public ResponseEntity<List<InsumoBarraEntity>> listarTodos() {
        return ResponseEntity.ok(repository.findAllByOrderByTipoAscIdInsumoAsc());
    }

    // 2. Para Cliente: lista solo insumos disponibles en barra
    @GetMapping("/disponibles")
    public ResponseEntity<List<InsumoBarraEntity>> listarDisponibles() {
        return ResponseEntity.ok(repository.findByDisponibleTrueOrderByTipoAscIdInsumoAsc());
    }

    // 3. Para Admin/Bartender: activar o desactivar un insumo agotado en tiempo real
    @PatchMapping("/{id}/disponibilidad")
    public ResponseEntity<InsumoBarraEntity> cambiarDisponibilidad(
            @PathVariable Long id,
            @RequestParam boolean disponible) {
        return repository.findById(id)
                .map(insumo -> {
                    insumo.setDisponible(disponible);
                    return ResponseEntity.ok(repository.save(insumo));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Para Admin: registrar un nuevo insumo de barra (nueva leche, jarabe o extra)
    @PostMapping
    public ResponseEntity<InsumoBarraEntity> crearInsumo(@RequestBody InsumoBarraEntity nuevo) {
        return ResponseEntity.ok(repository.save(nuevo));
    }
}