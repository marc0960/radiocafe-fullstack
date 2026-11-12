package com.radiocafe.domain.model;

import java.time.LocalDateTime;

public class Usuario {

    private Long idUsuario;
    private String nombre;
    private String correo;
    private String password;
    private Rol rol;
    private String telefono;
    private LocalDateTime fechaRegistro;

    public Usuario() {
        this.fechaRegistro = LocalDateTime.now();
    }

    public Usuario(Long idUsuario, String nombre, String correo, String password, Rol rol, String telefono) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.rol = rol;
        this.telefono = telefono;
        this.fechaRegistro = LocalDateTime.now();
    }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
