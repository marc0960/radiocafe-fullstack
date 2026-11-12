package com.radiocafe.infrastructure.adapters.out.persistence;

import com.radiocafe.domain.model.DetallePedido;
import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.Pedido;
import com.radiocafe.domain.ports.out.OrderRepositoryPort;
import com.radiocafe.infrastructure.adapters.out.persistence.entity.DetallePedidoEntity;
import com.radiocafe.infrastructure.adapters.out.persistence.entity.PedidoEntity;
import com.radiocafe.infrastructure.adapters.out.persistence.repository.SpringDataOrderRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class OrderRepositoryAdapter implements OrderRepositoryPort {

    private final SpringDataOrderRepository repository;

    public OrderRepositoryAdapter(SpringDataOrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pedido guardar(Pedido domain) {
        PedidoEntity entity = toEntity(domain);
        PedidoEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Pedido> buscarPorId(Long idPedido) {
        return repository.findById(idPedido).map(this::toDomain);
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigoPedido) {
        return repository.findByCodigoPedido(codigoPedido).map(this::toDomain);
    }

    @Override
    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        return repository.findByIdUsuario(idUsuario).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Pedido> buscarPorEstado(EstadoPedido estado) {
        return repository.findByEstadoPedido(estado).stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Pedido> obtenerTodos() {
        return repository.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    // Mapeador Domain -> Entity
    private PedidoEntity toEntity(Pedido domain) {
        PedidoEntity entity = new PedidoEntity();
        entity.setIdPedido(domain.getIdPedido());
        entity.setCodigoPedido(domain.getCodigoPedido());
        entity.setIdUsuario(domain.getIdUsuario());
        entity.setNombreCliente(domain.getNombreCliente());
        entity.setTelefonoCliente(domain.getTelefonoCliente());
        entity.setNotasPedido(domain.getNotasPedido());
        entity.setPinEntrega(domain.getPinEntrega());
        entity.setMetodoPago(domain.getMetodoPago());
        entity.setFotoEvidenciaUrl(domain.getFotoEvidenciaUrl());
        entity.setEstadoPedido(domain.getEstadoPedido());
        entity.setTipoEntrega(domain.getTipoEntrega());
        entity.setDireccionEntrega(domain.getDireccionEntrega());
        entity.setLatitud(domain.getLatitud());
        entity.setLongitud(domain.getLongitud());
        entity.setSubtotal(domain.getSubtotal());
        entity.setCostoEnvio(domain.getCostoEnvio());
        entity.setTotal(domain.getTotal());
        entity.setFechaCreacion(domain.getFechaCreacion());

        if (domain.getDetalles() != null) {
            List<DetallePedidoEntity> detalles = domain.getDetalles().stream().map(d -> {
                DetallePedidoEntity de = new DetallePedidoEntity();
                de.setIdDetalle(d.getIdDetalle());
                de.setIdProducto(d.getIdProducto());
                de.setNombreProducto(d.getNombreProducto());
                de.setCantidad(d.getCantidad());
                de.setPrecioUnitario(d.getPrecioUnitario());
                de.setSubtotalLinea(d.getSubtotalLinea());
                return de;
            }).collect(Collectors.toList());
            entity.setDetalles(detalles);
        }
        return entity;
    }

    // Mapeador Entity -> Domain (Corrige la pérdida de detalles y corrupción de totales)
    private Pedido toDomain(PedidoEntity entity) {
        Pedido domain = new Pedido();
        domain.setIdPedido(entity.getIdPedido());
        domain.setCodigoPedido(entity.getCodigoPedido());
        domain.setIdUsuario(entity.getIdUsuario());
        domain.setNombreCliente(entity.getNombreCliente());
        domain.setTelefonoCliente(entity.getTelefonoCliente());
        domain.setNotasPedido(entity.getNotasPedido());
        domain.setPinEntrega(entity.getPinEntrega());
        domain.setMetodoPago(entity.getMetodoPago());
        domain.setFotoEvidenciaUrl(entity.getFotoEvidenciaUrl());
        domain.setEstadoPedido(entity.getEstadoPedido());
        domain.setTipoEntrega(entity.getTipoEntrega());
        domain.setDireccionEntrega(entity.getDireccionEntrega());
        domain.setLatitud(entity.getLatitud());
        domain.setLongitud(entity.getLongitud());
        domain.setSubtotal(entity.getSubtotal());
        domain.setCostoEnvio(entity.getCostoEnvio());
        domain.setTotal(entity.getTotal());
        domain.setFechaCreacion(entity.getFechaCreacion());

        // Mapear detalles de la entidad al modelo de dominio
        if (entity.getDetalles() != null) {
            List<DetallePedido> detalles = entity.getDetalles().stream().map(de -> {
                DetallePedido d = new DetallePedido();
                d.setIdDetalle(de.getIdDetalle());
                d.setIdProducto(de.getIdProducto());
                d.setNombreProducto(de.getNombreProducto());
                d.setCantidad(de.getCantidad());
                d.setPrecioUnitario(de.getPrecioUnitario());
                return d;
            }).collect(Collectors.toList());
            domain.setDetalles(detalles);
        } else {
            domain.setDetalles(new ArrayList<>());
        }

        // Si subtotal o total no vinieron de la entidad, recalcularlos
        if (domain.getSubtotal() == null || domain.getTotal() == null) {
            domain.recalcularTotales();
        }

        return domain;
    }
}
