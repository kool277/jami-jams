package net.jami.jams.server.servlets.filters;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.User;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebFilter(urlPatterns = {"/api/*"})
@Slf4j
public class APIFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        boolean authsuccess = false;
        /*
        The API endpoint has only 2 possible states: auth with basic Auth, and auth with SSL.
        I left the possibility of working with HTTP sessions if someday, this takes place.
        We should keep in mind, that we will NEVER need to create a user if an SSL certificate has
        been presented.
         */
        //First try with SSL
        if(Decoders.decodeSSLAuth(request) != null){
            //From the certificate, we can pull up the deviceId, and find the owner.
            authsuccess = true;
        }
        else if(Decoders.decodeAuthHeader(request) != null){
            String[] authCredentials = Decoders.decodeAuthHeader(request);
            if(authCredentials != null && authCredentials.length == 2) {
                if(userAuthenticationModule.authenticateUser(authCredentials[0],authCredentials[1])){
                    log.info("User " + authCredentials[0] + " has succesfully logged in!");
                    authsuccess = true;
                }
            }
        }
        if(authsuccess) filterChain.doFilter(servletRequest,servletResponse);
        else response.setStatus(403);
    }
}
