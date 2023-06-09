package net.jami.jams.server.servlets.filters;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;
import jakarta.servlet.http.HttpServletResponse;

// @WebFilter(urlPatterns = { "*" }, initParams = { @WebInitParam(name = "cors.allowed.origins", value = "*") })
@WebFilter(urlPatterns = { "*" }, initParams = {
        @WebInitParam(name = "cors.allowed.origins", value = "*"),
        @WebInitParam(name = "cors.allowed.methods", value = "PUT, POST, GET, OPTIONS, DELETE"),
        @WebInitParam(name = "cors.allowed.headers", value = "Content-Type, Authorization"),
        @WebInitParam(name = "cors.preflight.maxage", value = "3600")
})
public class CorsFilter extends org.apache.catalina.filters.CorsFilter {
}
