package net.jami.jams.common.objects.roots;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class X509Fields {

    private String commonName;
    private String country;
    private String state;
    private String organization;
    private String organizationUnit;

    public String getDN(){
        StringBuilder stringBuilder = new StringBuilder();
        //This makes no sense without a Common Name;
        if(commonName != null) {
            stringBuilder.append("CN=").append(commonName);
        } else return null;
        if(country != null) stringBuilder.append(",").append("C=").append(country);
        if(state != null) stringBuilder.append(",").append("ST=").append(state);
        if(organization != null) stringBuilder.append(",").append("O=").append(organization);
        if(organizationUnit != null) stringBuilder.append(",").append("OU=").append(organizationUnit);
        return stringBuilder.toString();
    }

}
