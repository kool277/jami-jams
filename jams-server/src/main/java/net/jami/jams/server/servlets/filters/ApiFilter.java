/*
 * Copyright (C) 2020 by Savoir-faire Linux
 * Authors: William Enright <william.enright@savoirfairelinux.com>
 *          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
 *          Johnny Flores <johnny.flores@savoirfairelinux.com>
 *          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
 *          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package net.jami.jams.server.servlets.filters;

import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.authmodule.AuthTokenResponse;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.server.Server;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;
import static net.jami.jams.server.servlets.filters.JWTValidator.verifyValidity;

@WebFilter(urlPatterns = {"/api/auth/*"})
@Slf4j
public class ApiFilter implements Filter {

    private static final String SERVLET_AUTH_METHOD = "authorize";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if (!Server.isInstalled.get()) {
            response.sendError(404, "This endpoint requires setup to be complete!");
        } else {
            boolean authsuccess = false;
            boolean isLogin = false;
            if (request.getServletPath().contains("login")) {
                isLogin = true;
            }
            //This is a backward compatibility function to provide the ability for clients to use the
            //authorization header instead of tokens.
            if(request.getHeader("authorization") != null){
                AuthTokenResponse res = processUsernamePasswordAuth(request.getHeader("authorization"));
                try {
                    SignedJWT token = SignedJWT.parse(res.getAccess_token());
                    request.setAttribute("username", token.getJWTClaimsSet().getSubject());
                    request.setAttribute("accessLevel",AccessLevel.valueOf(token.getJWTClaimsSet().getClaim("scope").toString()));
                }
                catch (Exception e){
                    log.error("Could not authenticate user!");
                }
                if(res != null) authsuccess = true;
            }
            else if (request.getHeader("Bearer") != null) {
                SignedJWT signedJWT = null;
                try {
                    JWSVerifier jwsVerifier = new RSASSAVerifier(userAuthenticationModule.getAuthModulePubKey());
                    signedJWT = SignedJWT.parse(request.getHeader("Bearer"));
                    //In this case, we need to ask the "target" resource what are the allowed access levels.
                    if (signedJWT.verify(jwsVerifier) && verifyValidity(signedJWT)) {
                        authsuccess = true;
                        request.setAttribute("username", signedJWT.getJWTClaimsSet().getSubject());
                        if ((Boolean) signedJWT.getJWTClaimsSet().getClaim("oneTimePassword")) {
                            //TODO: use redirect to enforce the /changepassword url or something.
                        }
                        request.setAttribute("accessLevel", AccessLevel.valueOf(signedJWT.getJWTClaimsSet().getClaim("scope").toString()));
                    }
                } catch (Exception e) {
                    log.info("Received an invalid token, declining access...");
                }
            }
            if (authsuccess || isLogin) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                response.sendError(403, "This endpoint requires setup to be complete!");
            }
        }
    }
}
