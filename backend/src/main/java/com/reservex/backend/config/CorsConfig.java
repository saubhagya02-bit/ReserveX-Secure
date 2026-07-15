// CORS configuration for multiple frontend applications
// Allows admin-portal, online-portal, and other frontends to make requests

package com.reservex.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    @Primary
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow frontend origins
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",      // Vite default port (admin-portal, online-portal)
                "http://localhost:5174",      // Alternative Vite port
                "http://localhost:3000",      // React default port (my-react-app)
                "http://localhost:3001",      // Alternative React port
                "http://localhost:8080"       // Backend testing
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Allow headers
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        
        // Expose headers for the client
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Max age of preflight requests (in seconds)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
