package com.radiocafe.domain.model;

import java.time.LocalDateTime;

public class Usuario {
    private Long idUsuario;
    private String nombre;
    private String email;
    private String passwordHash;
    private Rol rol;
    private boolean esClienteVerificado;
    private LocalDateTime fechaRegistro;

    public Usuario() {}

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public boolean isEsClienteVerificado() { return esClienteVerificado; }
    public void setEsClienteVerificado(boolean esClienteVerificado) { this.esClienteVerificado = esClienteVerificado; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}