package com.radiocafe.web.controller;

import com.radiocafe.infrastructure.persistence.entity.InsumoEntity;
import com.radiocafe.infrastructure.persistence.repository.InsumoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/insumos")
@CrossOrigin(origins = "http://localhost:5173")
public class InsumoController {

    private final InsumoRepository insumoRepository;

    public InsumoController(InsumoRepository insumoRepository) {
        this.insumoRepository = insumoRepository;
    }

    @GetMapping
    public List<InsumoEntity> listarInsumos() {
        return insumoRepository.findAll();
    }
}