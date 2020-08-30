package net.jami.jams.server.servlets.filters;

import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;

@WebFilter(urlPatterns = {"*"}, initParams={@WebInitParam(name = "cors.allowed.origins",value = "*")})
public class CorsFilter extends org.apache.catalina.filters.CorsFilter {
}
