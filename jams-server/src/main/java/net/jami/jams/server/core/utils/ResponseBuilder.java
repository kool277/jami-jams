package net.jami.jams.server.core.utils;

import jakarta.servlet.http.HttpServletResponse;

public class ResponseBuilder {

    public void  buildResponse(Integer status, String body, HttpServletResponse resp) throws Exception{
        resp.setStatus(status);
        resp.getOutputStream().write(body.getBytes());
    }


}
