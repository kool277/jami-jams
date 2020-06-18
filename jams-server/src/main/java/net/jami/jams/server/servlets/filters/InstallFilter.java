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
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;
import net.jami.jams.server.Server;

import java.io.IOException;
import java.util.Date;

import static net.jami.jams.server.Server.userAuthenticationModule;

@WebFilter("/api/install/*")
@Slf4j
public class InstallFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        if(Server.isInstalled.get()){
            TomcatCustomErrorHandler.sendCustomError(response,404,"The server is already installed");
        }
        else{
            boolean authsuccess = false;
            boolean isLogin = false;
            if(request.getServletPath().contains("start")) isLogin = true;
            SignedJWT signedJWT = null;
            if(request.getHeader("Bearer") != null) {
                try {
                    JWSVerifier jwsVerifier = new RSASSAVerifier(userAuthenticationModule.getAuthModulePubKey());
                    signedJWT = SignedJWT.parse(request.getHeader("Bearer"));
                    if (signedJWT.verify(jwsVerifier) && signedJWT.getJWTClaimsSet().getExpirationTime().compareTo(new Date()) > 0) {
                        authsuccess = true;
                        request.setAttribute("username", signedJWT.getJWTClaimsSet().getSubject());
                        request.setAttribute("accessLevel", signedJWT.getJWTClaimsSet().getClaim("scope"));
                    }
                } catch (Exception e) {
                    log.info("Received an invalid token, declining access...");
                }
            }
            if(authsuccess || isLogin) filterChain.doFilter(servletRequest,servletResponse);
            else TomcatCustomErrorHandler.sendCustomError(response,401,"You are not authenticated!");
        }
    }

}
