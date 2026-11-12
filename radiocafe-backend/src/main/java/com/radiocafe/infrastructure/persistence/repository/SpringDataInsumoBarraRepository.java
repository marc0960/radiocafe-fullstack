package com.radiocafe.infrastructure.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.radiocafe.infrastructure.persistence.entity.InsumoBarraEntity;

public interface SpringDataInsumoBarraRepository extends JpaRepository<InsumoBarraEntity, Long> {
    List<InsumoBarraEntity> findAllByOrderByTipoAscIdInsumoAsc();
    List<InsumoBarraEntity> findByDisponibleTrueOrderByTipoAscIdInsumoAsc();
}