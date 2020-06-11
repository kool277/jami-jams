package net.jami.jams.common.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.Setter;
import net.jami.jams.common.objects.user.AccessLevel;

import java.io.IOException;
import java.util.HashSet;

/*
This is in order to be able to manipulate this more efficiently.
 */
public abstract class ScopedServlet extends HttpServlet {

    public static HashSet<AccessLevel> GET_accessLevels = new HashSet<>();
    public static HashSet<AccessLevel> PUT_accessLevels = new HashSet<>();
    public static HashSet<AccessLevel> DELETE_accessLevels = new HashSet<>();
    public static HashSet<AccessLevel> POST_accessLevels = new HashSet<>();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(!(req.getAttribute("accessLevel") instanceof AccessLevel)){
            resp.sendError(403,"No valid access level found!");
            return;
        }
        if(!GET_accessLevels.contains((AccessLevel) req.getAttribute("accessLevel"))){
            resp.sendError(403,"You do not have enough rights to access this endpoint!");
            return;
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(!(req.getAttribute("accessLevel") instanceof AccessLevel)){
            resp.sendError(403,"No valid access level found!");
            return;
        }
        if(!POST_accessLevels.contains((AccessLevel) req.getAttribute("accessLevel"))){
            resp.sendError(403,"You do not have enough rights to access this endpoint!");
            return;
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(!(req.getAttribute("accessLevel") instanceof AccessLevel)){
            resp.sendError(403,"No valid access level found!");
            return;
        }
        if(!PUT_accessLevels.contains((AccessLevel) req.getAttribute("accessLevel"))){
            resp.sendError(403,"You do not have enough rights to access this endpoint!");
            return;
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if(!(req.getAttribute("accessLevel") instanceof AccessLevel)){
            resp.sendError(403,"No valid access level found!");
            return;
        }
        if(!DELETE_accessLevels.contains((AccessLevel) req.getAttribute("accessLevel"))){
            resp.sendError(403,"You do not have enough rights to access this endpoint!");
            return;
        }
    }
}
