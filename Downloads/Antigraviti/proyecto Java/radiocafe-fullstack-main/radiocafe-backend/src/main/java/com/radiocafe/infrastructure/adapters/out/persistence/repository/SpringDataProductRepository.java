package com.radiocafe.infrastructure.adapters.out.persistence.repository;

import com.radiocafe.infrastructure.adapters.out.persistence.entity.ProductoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpringDataProductRepository extends JpaRepository<ProductoEntity, Long> {
    List<ProductoEntity> findByDisponibleTrue();
    List<ProductoEntity> findByCategoriaAndDisponibleTrue(String categoria);
}
