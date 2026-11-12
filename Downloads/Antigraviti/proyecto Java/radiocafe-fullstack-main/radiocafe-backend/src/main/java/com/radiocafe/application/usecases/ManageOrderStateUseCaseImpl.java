package com.radiocafe.application.usecases;

import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.Pedido;
import com.radiocafe.domain.ports.in.ManageOrderStateUseCase;
import com.radiocafe.domain.ports.out.OrderRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ManageOrderStateUseCaseImpl implements ManageOrderStateUseCase {

    private final OrderRepositoryPort orderRepositoryPort;

    public ManageOrderStateUseCaseImpl(OrderRepositoryPort orderRepositoryPort) {
        this.orderRepositoryPort = orderRepositoryPort;
    }

    @Override
    public Pedido cambiarEstadoPedido(Long idPedido, EstadoPedido nuevoEstado) {
        Pedido pedido = orderRepositoryPort.buscarPorId(idPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + idPedido));

        pedido.setEstadoPedido(nuevoEstado);
        return orderRepositoryPort.guardar(pedido);
    }

    @Override
    public Pedido confirmarEntrega(Long idPedido, String pin, String fotoEvidenciaUrl) {
        Pedido pedido = orderRepositoryPort.buscarPorId(idPedido)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con ID: " + idPedido));

        if (pedido.getPinEntrega() != null && !pedido.getPinEntrega().trim().isEmpty()) {
            if (!pedido.getPinEntrega().trim().equals(pin != null ? pin.trim() : "")) {
                throw new IllegalArgumentException("El PIN de seguridad ingresado es incorrecto.");
            }
        }

        pedido.setEstadoPedido(EstadoPedido.ENTREGADO);
        if (fotoEvidenciaUrl != null && !fotoEvidenciaUrl.isEmpty()) {
            pedido.setFotoEvidenciaUrl(fotoEvidenciaUrl);
        }

        return orderRepositoryPort.guardar(pedido);
    }

    @Override
    public Optional<Pedido> buscarPorId(Long idPedido) {
        return orderRepositoryPort.buscarPorId(idPedido);
    }

    @Override
    public Optional<Pedido> buscarPorCodigo(String codigoPedido) {
        return orderRepositoryPort.buscarPorCodigo(codigoPedido);
    }

    @Override
    public List<Pedido> obtenerTodos() {
        return orderRepositoryPort.obtenerTodos();
    }

    @Override
    public List<Pedido> obtenerPorEstado(EstadoPedido estado) {
        return orderRepositoryPort.buscarPorEstado(estado);
    }
}
