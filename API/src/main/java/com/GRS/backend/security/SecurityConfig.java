package com.GRS.backend.security;

import com.GRS.backend.oauth.CustomOAuth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Autowired
    private CustomOAuth2UserService customOAuth2UserService;

    @Autowired
    private CustomLogoutSuccessHandler customLogoutSuccessHandler;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Bean
    public OAuth2LoginFailureHandler oAuth2LoginFailureHandler() {
        return new OAuth2LoginFailureHandler();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            return http
                    .csrf(AbstractHttpConfigurer::disable) // disable CSRF
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/logout", "/generateReport").permitAll() // Allow unauthenticated access to /logout
                            .anyRequest().authenticated() // all requests must be authenticated
                    )
                    .oauth2Login(oauth2 -> oauth2
                            .userInfoEndpoint().userService(customOAuth2UserService).and()
                            .successHandler(oAuth2LoginSuccessHandler)
                            .failureHandler(oAuth2LoginFailureHandler())
                    )
                    .logout(logout -> logout
                            .logoutUrl("/logout")
                            .logoutSuccessHandler(customLogoutSuccessHandler)
                            .invalidateHttpSession(true)
                            .deleteCookies("JSESSIONID")
                    )
                    .build();
    //         return http
    //         .csrf().disable() // Disable CSRF protection for simplicity (not recommended for production)
    //         .authorizeHttpRequests()
    //         .anyRequest().permitAll().and().build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.addAllowedOrigin(frontendUrl);
        cors.addAllowedMethod("*");
        cors.addAllowedHeader("*");
        cors.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }
}
