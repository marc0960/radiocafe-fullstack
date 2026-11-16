package com.radiocafe.config;

import com.radiocafe.infrastructure.persistence.entity.InsumoEntity;
import com.radiocafe.infrastructure.persistence.repository.InsumoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner cargarInsumosPrueba(InsumoRepository insumoRepository) {
        return args -> {
            if (insumoRepository.count() == 0) {
                insumoRepository.saveAll(List.of(
                    new InsumoEntity("Café en Grano Villa Rica", "g", 2500.0),
                    new InsumoEntity("Leche Entera", "ml", 5000.0),
                    new InsumoEntity("Leche Deslactosada", "ml", 3000.0),
                    new InsumoEntity("Leche de Almendras", "ml", 2000.0),
                    new InsumoEntity("Jarabe de Vainilla", "ml", 1000.0),
                    new InsumoEntity("Cacao en Polvo", "g", 800.0)
                ));
            }
        };
    }
}