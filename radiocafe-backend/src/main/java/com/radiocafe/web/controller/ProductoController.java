package com.radiocafe.web.controller;

import com.radiocafe.application.service.ProductoService;
import com.radiocafe.infrastructure.persistence.entity.ProductoEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<ProductoEntity>> obtenerCatalogo() {
        return ResponseEntity.ok(productoService.listarDisponibles());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoEntity> crearProducto(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false, defaultValue = "Nuevo producto agregado por el Administrador.") String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "insumosReceta", required = false) String insumosReceta,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        ProductoEntity creado = productoService.crearProducto(nombre, descripcion, precio, categoria, insumosReceta, imagen);
        return ResponseEntity.ok(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }
}