package net.jami.jams.common.authentication;

public enum AuthenticationSourceType {
    AD,
    LDAP,
    LOCAL;

    public static AuthenticationSourceType fromString(String str){
        if(str.equals("AD")) return AD;
        if(str.equals("LDAP")) return LDAP;
        if(str.equals("LOCAL")) return LOCAL;
        return null;
    }

}
