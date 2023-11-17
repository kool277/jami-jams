package net.jami.jams.server.servlets.filters;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@WebFilter(urlPatterns = {"*"})
@Slf4j
public class ARequestLoggingFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest req = ((HttpServletRequest) request);
        log.info(
                "Request: {} {} - Remote IP: {}",
                req.getMethod(),
                req.getRequestURI(),
                request.getRemoteAddr());
        chain.doFilter(request, response);
    }
}
