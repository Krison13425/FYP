package com.example.arilne.reservationsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {


    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;
    @Autowired
    private AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and()
                .authorizeHttpRequests()
                .requestMatchers("/api/v1/auth/**",
                        "/api/airports/code_municipal",
                        "/api/flight/user/filter",
                        "/api/airports/user/code_name",
                        "/api/flight/user/date_price_list",
                        "/api/flight/{id}",
                        "/api/bundle/class",
                        "/api/bundle/{id}",
                        "/api/baggage/all",
                        "/api/baggage/{id}",
                        "/api/meal/all",
                        "/api/meal/{id}",
                        "/api/airplaneSeats/notAvailable/{airplaneId}",
                        "/api/seats/flight/{flightId}",
                        "/api/seats/all",
                        "/api/airplane/{id}",
                        "/api/price/**",
                        "/api/countries/all",
                        "/api/transports/all",
                        "/api/transports/{id}",
                        "/api/bookings/**",
                        "/api/emergency/**",
                        "/api/transactions/**",
                        "/api/passengers/**",
                        "/api/email/**",
                        "/api/pdf/**")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
