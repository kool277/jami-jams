package net.jami.jams.server.servlets.filters;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.server.Server;

import java.io.IOException;
import java.util.Date;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebFilter(urlPatterns = {"/api/admin/*"})
@Slf4j
public class AdminApiFilter implements Filter {

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
            if (request.getHeader("Bearer") != null){
                SignedJWT signedJWT = null;
                try {
                    JWSVerifier jwsVerifier = new RSASSAVerifier(userAuthenticationModule.getAuthModulePubKey());
                    signedJWT = SignedJWT.parse(request.getHeader("Bearer"));
                    if(signedJWT.verify(jwsVerifier) && signedJWT.getJWTClaimsSet().getExpirationTime().compareTo(new Date()) > 0
                    && AccessLevel.valueOf(signedJWT.getJWTClaimsSet().getClaim("scope").toString()).equals(AccessLevel.ADMIN)){
                        authsuccess = true;
                        request.setAttribute("username",signedJWT.getJWTClaimsSet().getSubject());
                    }
                } catch (Exception e) {
                    log.info("Received an invalid token, declining access...");
                }
            }
            if (authsuccess || isLogin){
                filterChain.doFilter(servletRequest, servletResponse);
            }
            else response.sendError(403,"This endpoint requires setup to be complete!");
        }
    }

}
