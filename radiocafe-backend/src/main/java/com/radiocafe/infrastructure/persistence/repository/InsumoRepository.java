package com.radiocafe.infrastructure.persistence.repository;

import com.radiocafe.infrastructure.persistence.entity.InsumoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsumoRepository extends JpaRepository<InsumoEntity, Long> {
}