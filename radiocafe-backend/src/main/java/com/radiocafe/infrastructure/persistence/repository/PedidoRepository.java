package com.radiocafe.infrastructure.persistence.repository;

import com.radiocafe.infrastructure.persistence.entity.PedidoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<PedidoEntity, Long> {
    List<PedidoEntity> findAllByOrderByFechaCreacionDesc();
    List<PedidoEntity> findByEstadoInOrderByFechaCreacionAsc(List<String> estados);
}