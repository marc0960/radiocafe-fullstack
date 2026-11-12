package com.radiocafe.infrastructure.adapters.out.persistence;

import com.radiocafe.domain.model.Usuario;
import com.radiocafe.domain.ports.out.UserRepositoryPort;
import com.radiocafe.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import com.radiocafe.infrastructure.adapters.out.persistence.repository.SpringDataUserRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository repository;

    public UserRepositoryAdapter(SpringDataUserRepository repository) {
        this.repository = repository;
    }

    @Override
    public Usuario guardar(Usuario domain) {
        UsuarioEntity entity = toEntity(domain);
        UsuarioEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long idUsuario) {
        return repository.findById(idUsuario).map(this::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return repository.findByCorreo(correo).map(this::toDomain);
    }

    @Override
    public boolean existePorCorreo(String correo) {
        return repository.existsByCorreo(correo);
    }

    private UsuarioEntity toEntity(Usuario domain) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setIdUsuario(domain.getIdUsuario());
        entity.setNombre(domain.getNombre());
        entity.setCorreo(domain.getCorreo());
        entity.setPassword(domain.getPassword());
        entity.setRol(domain.getRol());
        entity.setTelefono(domain.getTelefono());
        entity.setFechaRegistro(domain.getFechaRegistro());
        return entity;
    }

    private Usuario toDomain(UsuarioEntity entity) {
        Usuario domain = new Usuario(
                entity.getIdUsuario(),
                entity.getNombre(),
                entity.getCorreo(),
                entity.getPassword(),
                entity.getRol(),
                entity.getTelefono()
        );
        domain.setFechaRegistro(entity.getFechaRegistro());
        return domain;
    }
}
