package com.radiocafe.domain.ports.out;

import java.util.List;
import java.util.Optional;

import com.radiocafe.domain.model.Producto;

public interface ProductRepositoryPort {

    Producto guardar(Producto producto);

    Optional<Producto> buscarPorId(Long idProducto);

    List<Producto> obtenerTodosDisponibles();

    List<Producto> obtenerPorCategoria(String categoria);

    void eliminarPorId(Long idProducto);
}