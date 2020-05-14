package net.jami.jams.common.cryptoengineapi.ocsp;

public enum CertificateStatus {
    VALID,   /** The certificate is valid         **/
    REVOKED, /** The certificate has been revoked **/
    EXPIRED, /** The certificate is expired       **/
    UNKNOWN; /** The certificate is unknown       **/

    public static CertificateStatus fromString(String status) {
        switch (status) {
            case "V":
                return VALID;
            case "R":
                return REVOKED;
            case "E":
                return EXPIRED;
            default:
                throw new IllegalArgumentException("Did not find valid status: " + status);
        }
    }
}
