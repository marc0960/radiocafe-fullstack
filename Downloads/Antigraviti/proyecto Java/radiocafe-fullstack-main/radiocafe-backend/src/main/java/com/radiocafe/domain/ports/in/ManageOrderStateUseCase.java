package com.radiocafe.domain.ports.in;

import com.radiocafe.domain.model.EstadoPedido;
import com.radiocafe.domain.model.Pedido;

import java.util.List;
import java.util.Optional;

public interface ManageOrderStateUseCase {
    Pedido cambiarEstadoPedido(Long idPedido, EstadoPedido nuevoEstado);
    Pedido confirmarEntrega(Long idPedido, String pin, String fotoEvidenciaUrl);
    Optional<Pedido> buscarPorId(Long idPedido);
    Optional<Pedido> buscarPorCodigo(String codigoPedido);
    List<Pedido> obtenerTodos();
    List<Pedido> obtenerPorEstado(EstadoPedido estado);
}
