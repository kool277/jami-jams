package net.jami.jams.server.servlets.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.server.Server;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

/*

 */
@WebFilter("/web/*")
public class WebAppFilter implements Filter {

    public static final ConcurrentHashMap<HttpSession, User> authenticatedUsers = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        boolean authsuccess = authenticatedUsers.containsKey(request.getSession());

        //Block the possibility of getting back into the installation once it has been
        //completed.
        if(Server.isInstalled.get() && request.getServletPath().contains("install")){
            response.setStatus(404);
            return;
        }

        if(authsuccess){
            filterChain.doFilter(request,response);
        }
        if(!authsuccess && request.getServletPath().contains("login")){
            filterChain.doFilter(request,response);
        }
        else{
            response.setStatus(403);
        }
    }
}
