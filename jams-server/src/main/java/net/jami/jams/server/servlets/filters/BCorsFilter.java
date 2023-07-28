package net.jami.jams.server.servlets.filters;

import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;

@WebFilter(
        urlPatterns = {"*"},
        initParams = {
            @WebInitParam(name = "cors.allowed.origins", value = "*"),
            @WebInitParam(name = "cors.allowed.methods", value = "PUT, POST, GET, OPTIONS, DELETE"),
            @WebInitParam(name = "cors.allowed.headers", value = "Content-Type, Authorization"),
            @WebInitParam(name = "cors.preflight.maxage", value = "3600")
        })
public class BCorsFilter extends org.apache.catalina.filters.CorsFilter {}
