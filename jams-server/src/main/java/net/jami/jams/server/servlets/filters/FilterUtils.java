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
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.dao.StatementElement;
import net.jami.jams.common.dao.StatementList;
import net.jami.jams.common.objects.user.AccessLevel;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.common.serialization.tomcat.TomcatCustomErrorHandler;

import java.util.Date;

import static net.jami.jams.server.Server.*;
import static net.jami.jams.server.Server.certificateAuthority;
import static net.jami.jams.server.servlets.api.auth.login.AuthRequestProcessor.processUsernamePasswordAuth;

@Slf4j
public class FilterUtils {

    public static final String USERNAME_ATTR = "username";
    public static final String ACCESS_LEVEL_ATTR = "accessLevel";

    public static boolean verifyValidity(SignedJWT signedJWT) {
        try {
            return signedJWT.getJWTClaimsSet().getExpirationTime().compareTo(new Date()) > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public static AuthRequestType classifyRequest(HttpServletRequest request) {
        if (request.getHeader("authorization") != null) {
            if (request.getHeader("authorization").contains("basic") || request.getHeader("authorization").contains("Basic")) {
                return AuthRequestType.BASIC;
            }
            if (request.getHeader("authorization").contains("bearer") || request.getHeader("authorization").contains("Bearer")) {
                return AuthRequestType.BEARER_TOKEN;
            }
            return null;
        }
        return null;
    }

    public static boolean doAuthCheck(HttpServletRequest request){
        AuthRequestType requestType = FilterUtils.classifyRequest(request);
        try {
            if (requestType != null) {
                SignedJWT token = null;
                switch (requestType) {
                    case BASIC:
                        token = SignedJWT.parse(processUsernamePasswordAuth(request.getHeader("authorization")).getAccess_token());
                        break;
                    case BEARER_TOKEN:
                        token = SignedJWT.parse(request.getHeader("authorization").
                            replace("bearer", "")
                            .replace("Bearer", ""));
                        break;
                    default:
                        return false;
                }
                StatementList statementList = new StatementList();
                StatementElement statementElement = new StatementElement("username", "=", token.getJWTClaimsSet().getSubject(), "");
                statementList.addStatement(statementElement);
                log.info("Getting user from database");
                User user =  dataStore.getUserDao().getObjects(statementList).get(0);
                log.info("User retrieved from database: {}", user);
                if(!user.getAccessLevelName().equals("ADMIN") && certificateAuthority.getLatestCRL().get() != null) {
                    if(certificateAuthority.getLatestCRL().get().getRevokedCertificate(user.getCertificate().getSerialNumber()) != null)
                        return false;
                }
                JWSVerifier jwsVerifier = new RSASSAVerifier(userAuthenticationModule.getAuthModulePubKey());
                if (token.verify(jwsVerifier) && verifyValidity(token)) {
                    request.setAttribute(USERNAME_ATTR, token.getJWTClaimsSet().getSubject());
                    request.setAttribute(ACCESS_LEVEL_ATTR, AccessLevel.valueOf(token.getJWTClaimsSet().getClaim("scope").toString()));
                    return true;
                }
            }
            return false;
        }
        catch (Exception e){
            log.info("Failed to process authentication request and denying access: {}",e.getMessage());
            return false;
        }
    }
}
