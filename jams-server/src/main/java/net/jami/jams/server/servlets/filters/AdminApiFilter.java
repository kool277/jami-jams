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

import static net.jami.jams.server.Server.userAuthenticationModule;
import static net.jami.jams.server.servlets.filters.JWTValidator.verifyLevel;
import static net.jami.jams.server.servlets.filters.JWTValidator.verifyValidity;

@WebFilter(urlPatterns = {"/api/admin/*"})
@Slf4j
public class AdminApiFilter implements Filter {

    private static final AccessLevel TARGET_LEVEL = AccessLevel.ADMIN;

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
                    if(signedJWT.verify(jwsVerifier) && verifyValidity(signedJWT) && verifyLevel(signedJWT,TARGET_LEVEL)){
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
