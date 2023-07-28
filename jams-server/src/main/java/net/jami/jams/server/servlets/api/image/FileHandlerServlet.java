package net.jami.jams.server.servlets.api.image;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@MultipartConfig
@Slf4j
@WebServlet("/api/image/filehandler/*")
public class FileHandlerServlet extends HttpServlet {

    private static final String IMAGES_DIR = "images";
    private static final String SAVE_DIR =
            ".."
                    + File.separator
                    + ".."
                    + File.separator
                    + ".."
                    + File.separator
                    + ".."
                    + File.separator
                    + ".."
                    + File.separator
                    + IMAGES_DIR;

    /**
     * @apiVersion 1.0.0
     * @api {post} /api/image/filehandler/<blueprintName>/<imageType>
     *      Upload an image
     * @apiName postImage
     * @apiGroup Images
     *
     * @apiParam {param} blueprintName The name of the blueprint
     * @apiParam {param} imageType 'logo' or 'background'
     * @apiParam {body} image The new logo image or background image
     *
     * @apiSuccess (200) {null} null successfully uploaded image
     * @apiError (400) {null} null missing path info
     * @apiError (500) {null} null contact could not be successfully added
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Handle missing path info
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            String[] pathParts = pathInfo.split("/");

            if (pathParts.length != 3) {
                // Handle wrong number of path elements
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            String blueprintName = pathParts[1];
            String imageType = pathParts[2];

            File imagesFolder = new File(IMAGES_DIR + File.separator + blueprintName);
            if (!imagesFolder.exists()) {

                imagesFolder.mkdirs();

                File imagesFolderLogo =
                        new File(
                                IMAGES_DIR
                                        + File.separator
                                        + blueprintName
                                        + File.separator
                                        + "logo");
                File imagesFolderBackground =
                        new File(
                                IMAGES_DIR
                                        + File.separator
                                        + blueprintName
                                        + File.separator
                                        + "background");

                imagesFolderLogo.mkdirs();
                imagesFolderBackground.mkdirs();
            }

            Part filePart = request.getPart("file"); // Retrieves <input type="file" name="file">
            String fileName = filePart.getSubmittedFileName();

            for (Part part : request.getParts()) {
                part.write(
                        SAVE_DIR
                                + File.separator
                                + blueprintName
                                + File.separator
                                + imageType
                                + File.separator
                                + fileName);
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("File upload was successful.");
        } catch (Exception e) {
            log.error("Error during file upload: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error during file upload: " + e.getMessage());
        }
    }

    /**
     * @apiVersion 1.0.0
     * @api {get} /api/image/filehandler/<blueprintName>/<imageType>/<fileName>
     *      Get an image
     * @apiName getImage
     * @apiGroup Images
     *
     * @apiParam {param} blueprintName The name of the blueprint
     * @apiParam {param} imageType 'logo' or 'background'
     * @apiParam {param} fileName The name of the file
     *
     * @apiSuccess (200) {null} null successfully got image
     * @apiError (400) {null} null missing path info
     * @apiError (404) {null} null image not found
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            String pathInfo = request.getPathInfo();

            if (pathInfo == null || pathInfo.equals("/")) {
                // Handle missing path info
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            String[] pathParts = pathInfo.split("/");

            if (pathParts.length != 4) {
                // Handle wrong number of path elements
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            String blueprintName = pathParts[1];
            String imageType = pathParts[2];
            String fileName = pathParts[3];

            Path imageFilePath = Paths.get(IMAGES_DIR, blueprintName, imageType, fileName);
            byte[] imageData = Files.readAllBytes(imageFilePath);

            String mimeType = Files.probeContentType(imageFilePath);
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }

            response.setContentType(mimeType);

            try (OutputStream out = response.getOutputStream()) {
                out.write(imageData);
            }
        } catch (FileNotFoundException e) {
            log.error("FileHandlerServlet: Error while processing request", e);
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        } catch (IOException e) {
            log.error("FileHandlerServlet: Error while processing request", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
