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
import net.jami.jams.server.Server;

import java.io.IOException;

import static net.jami.jams.server.Server.userAuthenticationModule;
import static net.jami.jams.server.servlets.filters.JWTValidator.verifyValidity;

@WebFilter(urlPatterns = {"/api/auth/*"})
@Slf4j
public class ApiFilter implements Filter {

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
                    if(signedJWT.verify(jwsVerifier) && verifyValidity(signedJWT)){
                        authsuccess = true;
                        request.setAttribute("username",signedJWT.getJWTClaimsSet().getSubject());
                        if((Boolean) signedJWT.getJWTClaimsSet().getClaim("oneTimePassword")){
                            //TODO: use redirect to enforce the /changepassword url or something.
                        }
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
