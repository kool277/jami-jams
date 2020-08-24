package net.jami.jams.server.servlets.filters;

import jakarta.servlet.annotation.WebFilter;

@WebFilter(urlPatterns = {"*"})
public class CorsFilter extends org.apache.catalina.filters.CorsFilter {

}
