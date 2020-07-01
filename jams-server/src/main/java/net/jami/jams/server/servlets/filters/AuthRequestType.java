package net.jami.jams.server.servlets.filters;

public enum AuthRequestType {
    FORM, //not supported on filters.
    BASIC,
    BEARER_TOKEN,
    CLIENT_CERT //not supported on filters.
}
