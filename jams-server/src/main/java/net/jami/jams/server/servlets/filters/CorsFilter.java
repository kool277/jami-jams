package net.jami.jams.server.servlets.filters;

import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.annotation.WebInitParam;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@WebFilter(urlPatterns = {"*"}, initParams={@WebInitParam(name = "cors.allowed.origins",value = "*")})
public class CorsFilter extends org.apache.catalina.filters.CorsFilter {
}
