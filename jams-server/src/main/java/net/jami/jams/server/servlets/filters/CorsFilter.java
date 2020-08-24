package net.jami.jams.server.servlets.filters;

import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.EnumSet;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@WebFilter(urlPatterns = {"*"})
public class CorsFilter extends org.apache.catalina.filters.CorsFilter {

    @Override
    public void init() throws ServletException {
        FilterConfig filterConfig = new FilterConfig() {

            final Map<String,String> map = new HashMap<>(){{
                put("cors.allowed.origins","*");
            }};

            @Override
            public String getFilterName() {
                return null;
            }

            @Override
            public ServletContext getServletContext() {
                return null;
            }

            @Override
            public String getInitParameter(String s) {
                return map.get(s);
            }

            @Override
            public Enumeration<String> getInitParameterNames() {
                return Collections.enumeration(map.keySet());
            }
        };
        super.init(filterConfig);
    }
}
