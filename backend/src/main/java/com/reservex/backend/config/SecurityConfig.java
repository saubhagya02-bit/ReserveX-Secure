package com.reservex.backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;
    private final CorsConfigurationSource corsConfigurationSource;
    private final RateLimitFilter rateLimitFilter;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;


    // PASSWORD ENCODER

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // AUTHENTICATION MANAGER

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }


    // DAO AUTHENTICATION PROVIDER

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider authProvider =
                new DaoAuthenticationProvider(userDetailsService);

        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }


    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtAuthenticationConverter jwtConverter =
                new JwtAuthenticationConverter();

        jwtConverter.setJwtGrantedAuthoritiesConverter(jwt -> {

            Collection<GrantedAuthority> authorities =
                    new ArrayList<>();

            // ASGARDEO ROLES

            List<String> roles =
                    jwt.getClaimAsStringList("roles");

            if (roles != null) {

                for (String role : roles) {

                    if (role == null || role.isBlank()) {
                        continue;
                    }

                    String authority =
                            "ROLE_" + role;

                    authorities.add(
                            new SimpleGrantedAuthority(authority)
                    );

                    log.info(
                            "Asgardeo role '{}' -> authority '{}'",
                            role,
                            authority
                    );
                }
            }


            String scope =
                    jwt.getClaimAsString("scope");

            if (scope != null && !scope.isBlank()) {

                Arrays.stream(scope.split(" "))
                        .filter(s -> !s.isBlank())
                        .forEach(s -> {

                            String authority =
                                    "SCOPE_" + s;

                            authorities.add(
                                    new SimpleGrantedAuthority(
                                            authority
                                    )
                            );
                        });
            }


            log.info(
                    "Final JWT authorities: {}",
                    authorities
            );

            return authorities;
        });

        return jwtConverter;
    }


    // JWT DECODER

    @Bean
    public JwtDecoder jwtDecoder() {

        SimpleClientHttpRequestFactory factory =
                new SimpleClientHttpRequestFactory();

        factory.setConnectTimeout(30000);
        factory.setReadTimeout(30000);

        RestTemplate restTemplate =
                new RestTemplate();

        restTemplate.setRequestFactory(factory);

        NimbusJwtDecoder decoder =
                NimbusJwtDecoder
                        .withJwkSetUri(jwkSetUri)
                        .restOperations(restTemplate)
                        .build();

        decoder.setJwtValidator(
                token ->
                        org.springframework.security.oauth2.core
                                .OAuth2TokenValidatorResult
                                .success()
        );

        return decoder;
    }


    // SECURITY FILTER CHAIN

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http) throws Exception {

        http

                // ------------------------------------------------
                // CORS
                // ------------------------------------------------

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource
                        )
                )


                // ------------------------------------------------
                // CSRF
                // ------------------------------------------------

                .csrf(csrf ->
                        csrf.disable()
                )

                // SECURITY HEADER

                .headers(headers -> headers

                        .contentSecurityPolicy(csp ->
                                csp.policyDirectives(
                                        "default-src 'self'; " +
                                                "script-src 'self'; " +
                                                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                                                "font-src 'self' https://fonts.gstatic.com; " +
                                                "img-src 'self' data: https: blob:; " +
                                                "connect-src 'self' https://api.asgardeo.io https://localhost:8443"
                                )
                        )

                        .frameOptions(frame ->
                                frame.deny()
                        )
                )


                // EXCEPTION HANDLING

                .exceptionHandling(ex ->
                        ex.authenticationEntryPoint(
                                jwtAuthEntryPoint
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // AUTHORIZATION

                .authorizeHttpRequests(authorize -> authorize


                        // =========================================
                        // PUBLIC ENDPOINTS
                        // =========================================

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/stalls/**"
                        )
                        .permitAll()


                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/genres"
                        )
                        .permitAll()


                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/contact"
                        )
                        .permitAll()



                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("Organizer")



                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/stalls/**"
                        )
                        .hasRole("Organizer")


                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/stalls/**"
                        )
                        .hasRole("Organizer")


                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/stalls/**"
                        )
                        .hasRole("Organizer")



                        .requestMatchers(
                                "/api/reservations/**"
                        )
                        .hasRole("Vendor")



                        .requestMatchers(
                                "/api/users/**"
                        )
                        .hasAnyRole(
                                "Vendor",
                                "Organizer"
                        )



                        .anyRequest()
                        .authenticated()
                )


                // ASGARDEO JWT RESOURCE SERVER

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt
                                        .decoder(jwtDecoder())
                                        .jwtAuthenticationConverter(
                                                jwtAuthenticationConverter()
                                        )
                        )
                )


                // CUSTOM AUTHENTICATION PROVIDER

                .authenticationProvider(
                        authenticationProvider()
                );


        // CUSTOM FILTERS

        // Rate limiting
        http.addFilterBefore(
                rateLimitFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        // Custom JWT filter for Admin/custom JWT authentication
        http.addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
        );


        return http.build();
    }
}
