package net.jami.jams.server.servlets.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.server.Server;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebFilter("/api/install/*")
public class InstallFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if(Server.isInstalled.get()){
            response.sendError(404,"The server has already been configured, this endpoint is not available!");
        }
        else{
            boolean authsuccess = false;
            boolean isLogin = false;
            if(request.getServletPath().contains("start")) isLogin = true;
            if(request.getHeader("x-token") != null) {
                authsuccess = userAuthenticationModule.validateAndGetUsername(request.getHeader("x-token")) != null;
            }
            if(authsuccess || isLogin) filterChain.doFilter(servletRequest,servletResponse);
            else response.sendError(403,"You are not authorized to access this page!");
        }
    }

}
