package net.jami.jams.server.servlets.filters;

import jakarta.servlet.http.HttpServletRequest;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class Decoders {

    public static String[] decodeAuthHeader(HttpServletRequest request){
        if(request.getHeader("authorization") != null){
            return decodeAuthHeader(request.getHeader("authorization"));
        }
        else return null;
    }

    private static String[] decodeAuthHeader(String authorization){
        if (authorization != null && authorization.toLowerCase().startsWith("basic")) {
            // Authorization: Basic base64credentials
            String base64Credentials = authorization.substring("Basic".length()).trim();
            byte[] credDecoded = Base64.getDecoder().decode(base64Credentials);
            //TODO: change this to char array
            String credentials = new String(credDecoded, StandardCharsets.UTF_8);
            // credentials = username:password
            return credentials.split(":", 2);
        }
        return null;
    }

    //This just return whatever we need in the header.
    public static String decodeSSLAuth(HttpServletRequest request){
        if(request.getAttribute("jakarta.servlet.request.X509Certificate") != null){
            return null;
        }
        return null;
    }


}
