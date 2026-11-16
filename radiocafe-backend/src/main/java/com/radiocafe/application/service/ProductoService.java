package com.radiocafe.application.service;

import com.radiocafe.infrastructure.persistence.entity.ProductoEntity;
import com.radiocafe.infrastructure.persistence.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final Path uploadDir = Paths.get("uploads");

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoEntity> listarDisponibles() {
        return productoRepository.findByDisponibleTrueOrderByIdDesc();
    }

    public ProductoEntity crearProducto(
            String nombre,
            String descripcion,
            BigDecimal precio,
            String categoria,
            String insumosReceta,
            MultipartFile imagen
    ) throws IOException {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String imagenUrl = null;
        if (imagen != null && !imagen.isEmpty()) {
            String nombreArchivo = UUID.randomUUID() + "_" + imagen.getOriginalFilename().replaceAll("\\s+", "_");
            Path destino = uploadDir.resolve(nombreArchivo);
            Files.copy(imagen.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            imagenUrl = "http://localhost:8080/uploads/" + nombreArchivo;
        }

        ProductoEntity producto = new ProductoEntity();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setCategoria(categoria);
        producto.setInsumosReceta(insumosReceta);
        producto.setImagenUrl(imagenUrl);
        producto.setDisponible(true);

        return productoRepository.save(producto);
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }
}