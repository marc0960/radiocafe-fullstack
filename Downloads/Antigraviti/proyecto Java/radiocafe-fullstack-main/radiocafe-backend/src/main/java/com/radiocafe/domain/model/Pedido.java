package com.radiocafe.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

    private Long idPedido;
    private Long idUsuario;
    private String codigoPedido;
    private String nombreCliente;
    private String telefonoCliente;
    private String notasPedido;
    private String pinEntrega;
    private String metodoPago;
    private String fotoEvidenciaUrl;

    private EstadoPedido estadoPedido;
    private TipoEntrega tipoEntrega;
    private String direccionEntrega;
    private Double latitud;
    private Double longitud;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal total;
    private LocalDateTime fechaCreacion;
    private List<DetallePedido> detalles;

    public Pedido() {
        this.detalles = new ArrayList<>();
        this.estadoPedido = EstadoPedido.PENDIENTE;
        this.fechaCreacion = LocalDateTime.now();
        this.subtotal = BigDecimal.ZERO;
        this.costoEnvio = BigDecimal.ZERO;
        this.total = BigDecimal.ZERO;
        this.metodoPago = "EFECTIVO";
        this.pinEntrega = "1842";
    }

    public void agregarDetalle(DetallePedido detalle) {
        this.detalles.add(detalle);
        recalcularTotales();
    }

    public void recalcularTotales() {
        if (this.detalles != null && !this.detalles.isEmpty()) {
            this.subtotal = detalles.stream()
                    .map(d -> d.getSubtotalLinea() != null ? d.getSubtotalLinea() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        // Regla de Negocio: Envío Gratis si Subtotal >= $50.00
        if (this.tipoEntrega == TipoEntrega.DELIVERY) {
            if (this.subtotal != null && this.subtotal.compareTo(new BigDecimal("50.00")) >= 0) {
                this.costoEnvio = BigDecimal.ZERO;
            } else if (this.costoEnvio == null || this.costoEnvio.compareTo(BigDecimal.ZERO) == 0) {
                this.costoEnvio = new BigDecimal("5.00");
            }
        } else {
            this.costoEnvio = BigDecimal.ZERO;
        }

        if (this.subtotal != null && this.costoEnvio != null) {
            this.total = this.subtotal.add(this.costoEnvio);
        }
    }

    // Getters y Setters
    public Long getIdPedido() { return idPedido; }
    public void setIdPedido(Long idPedido) { this.idPedido = idPedido; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getCodigoPedido() { return codigoPedido; }
    public void setCodigoPedido(String codigoPedido) { this.codigoPedido = codigoPedido; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }

    public String getTelefonoCliente() { return telefonoCliente; }
    public void setTelefonoCliente(String telefonoCliente) { this.telefonoCliente = telefonoCliente; }

    public String getNotasPedido() { return notasPedido; }
    public void setNotasPedido(String notasPedido) { this.notasPedido = notasPedido; }

    public String getPinEntrega() { return pinEntrega; }
    public void setPinEntrega(String pinEntrega) { this.pinEntrega = pinEntrega; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public String getFotoEvidenciaUrl() { return fotoEvidenciaUrl; }
    public void setFotoEvidenciaUrl(String fotoEvidenciaUrl) { this.fotoEvidenciaUrl = fotoEvidenciaUrl; }

    public EstadoPedido getEstadoPedido() { return estadoPedido; }
    public void setEstadoPedido(EstadoPedido estadoPedido) { this.estadoPedido = estadoPedido; }

    public TipoEntrega getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(TipoEntrega tipoEntrega) { 
        this.tipoEntrega = tipoEntrega; 
        recalcularTotales();
    }

    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }

    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(BigDecimal costoEnvio) { this.costoEnvio = costoEnvio; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public List<DetallePedido> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedido> detalles) { 
        this.detalles = detalles; 
        if (this.subtotal == null || this.subtotal.compareTo(BigDecimal.ZERO) == 0) {
            recalcularTotales();
        }
    }
}
