package com.sneha.seatmgmtapp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger Configuration.
 * Configures API documentation with Swagger UI.
 *
 * @author Sneha A S
 * @since 1.0
 */
@Configuration
public class OpenAPIConfiguration {

        @Bean
        OpenAPI defineOpenApi() {
                Server devServer = new Server();
                devServer.setUrl("http://localhost:8085");
                devServer.setDescription("Seat Management API - Development");

                Server prodServer = new Server();
                prodServer.setUrl("https://api.seatcms.com");
                prodServer.setDescription("Seat Management API - Production");

                Contact contact = new Contact();
                contact.setName("Sneha A S");
                contact.setEmail("snehaaa1003@gmail.com");

                License license = new License()
                                .name("Apache 2.0")
                                .url("http://www.apache.org/licenses/LICENSE-2.0.html");

                Info info = new Info()
                                .title("Seat Management API")
                                .version("1.0")
                                .description("This API document exposes endpoints to the services provided by the Seat Management Spring Boot App.")
                                .contact(contact)
                                .license(license);

                ExternalDocumentation externalDocs = new ExternalDocumentation()
                                .description("Seat Management Web App")
                                .url("");

                // Security scheme for JWT
                SecurityScheme securityScheme = new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT Authentication");

                Components components = new Components()
                                .addSecuritySchemes("bearerAuth", securityScheme);

                SecurityRequirement securityRequirement = new SecurityRequirement()
                                .addList("bearerAuth");

                // Tags for API grouping

                return new OpenAPI()
                                .info(info)
                                .servers(List.of(devServer, prodServer))
                                .externalDocs(externalDocs)
                                .components(components)
                                .addSecurityItem(securityRequirement);
        }
}
