package net.jami.jams.common.cryptoengineapi;

import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.user.User;
import org.bouncycastle.cert.X509CRLHolder;
import org.bouncycastle.cert.ocsp.OCSPReq;
import org.bouncycastle.cert.ocsp.OCSPResp;

import java.util.concurrent.atomic.AtomicReference;

public interface CertificateAuthority {
    //Return a signed X509 certificate based on various constraints.
    void init(String settings, SystemAccount ca, SystemAccount ocsp);
    User getSignedCertificate(User user);
    Device getSignedCertificate(User user, Device device);
    SystemAccount getSignedCertificate(SystemAccount systemAccount);
    void revokeCertificate(RevocationRequest revocationRequest);
    AtomicReference<X509CRLHolder> getLatestCRL();
    OCSPResp getOCSPResponse(OCSPReq ocspRequest);
}
