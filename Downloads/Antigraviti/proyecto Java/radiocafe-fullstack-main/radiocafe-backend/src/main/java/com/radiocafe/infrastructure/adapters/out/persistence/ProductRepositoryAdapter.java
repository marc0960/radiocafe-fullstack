package com.radiocafe.infrastructure.adapters.out.persistence;

import com.radiocafe.domain.model.Producto;
import com.radiocafe.domain.ports.out.ProductRepositoryPort;
import com.radiocafe.infrastructure.adapters.out.persistence.entity.ProductoEntity;
import com.radiocafe.infrastructure.adapters.out.persistence.repository.SpringDataProductRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProductRepositoryAdapter implements ProductRepositoryPort {

    private final SpringDataProductRepository repository;

    public ProductRepositoryAdapter(SpringDataProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Producto guardar(Producto domain) {
        ProductoEntity entity = toEntity(domain);
        ProductoEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Producto> buscarPorId(Long idProducto) {
        return repository.findById(idProducto).map(this::toDomain);
    }

    @Override
    public List<Producto> obtenerTodosDisponibles() {
        return repository.findByDisponibleTrue().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Producto> obtenerPorCategoria(String categoria) {
        return repository.findByCategoriaAndDisponibleTrue(categoria).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public void eliminarPorId(Long idProducto) {
        repository.deleteById(idProducto);
    }

    private ProductoEntity toEntity(Producto domain) {
        ProductoEntity entity = new ProductoEntity();
        entity.setIdProducto(domain.getIdProducto());
        entity.setNombre(domain.getNombre());
        entity.setDescripcion(domain.getDescripcion());
        entity.setCategoria(domain.getCategoria());
        entity.setPrecio(domain.getPrecio());
        entity.setImagenUrl(domain.getImagenUrl());
        entity.setDisponible(domain.getDisponible());
        return entity;
    }

    private Producto toDomain(ProductoEntity entity) {
        return new Producto(
                entity.getIdProducto(),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getCategoria(),
                entity.getPrecio(),
                entity.getImagenUrl(),
                entity.getDisponible()
        );
    }
}
