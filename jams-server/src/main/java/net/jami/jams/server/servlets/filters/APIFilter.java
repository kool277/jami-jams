package net.jami.jams.server.servlets.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.server.Server;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebFilter(urlPatterns = {"/api/auth/*"})
@Slf4j
public class APIFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if (!Server.isInstalled.get()) {
            response.sendError(404,"This endpoint requires setup to be complete!");
        } else {
            boolean authsuccess = false;
            boolean isLogin = false;
            if (request.getServletPath().contains("login")) isLogin = true;
            if (request.getHeader("x-token") != null)
                authsuccess = userAuthenticationModule.validateAndGetUsername(request.getHeader("x-token")) != null;
            if (authsuccess || isLogin){
                servletRequest.setAttribute("username",userAuthenticationModule.validateAndGetUsername(request.getHeader("x-token")));
                filterChain.doFilter(servletRequest, servletResponse);
            }
            else response.sendError(403,"This endpoint requires setup to be complete!");
        }
    }
}
