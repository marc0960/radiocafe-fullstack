package com.radiocafe.infrastructure.adapters.out.persistence.repository;

import com.radiocafe.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataUserRepository extends JpaRepository<UsuarioEntity, Long> {
    Optional<UsuarioEntity> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
