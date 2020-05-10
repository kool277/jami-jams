package net.jami.jams.cryptoengine;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.cryptoengineapi.CertificateAuthority;
import net.jami.jams.common.objects.devices.Device;
import net.jami.jams.common.objects.requests.RevocationRequest;
import net.jami.jams.common.objects.system.SystemAccount;
import net.jami.jams.common.objects.user.User;
import net.jami.jams.cryptoengine.workers.crl.CRLWorker;
import net.jami.jams.cryptoengine.workers.csr.CertificateWorker;
import net.jami.jams.cryptoengine.workers.ocsp.OCSPWorker;
import org.bouncycastle.cert.X509CRLHolder;
import org.bouncycastle.cert.ocsp.OCSPReq;
import org.bouncycastle.cert.ocsp.OCSPResp;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.Security;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
public class CryptoEngine implements CertificateAuthority {


    //These are the workers which are responsible for CRL/OCSP, they have an odd relationship.
    private static CRLWorker crlWorker;
    private static OCSPWorker ocspWorker;
    public static volatile String serverDomain;
    public static volatile String signingAlgorithm;

    //Various times
    public static long caLifetime = 360_000_000;
    public static long crlLifetime = 360_000_000;
    public static long userLifetime = 360_000_000;
    public static long deviceLifetime = 360_000_000;

    //CA certificate & OCSP Certificates, because they are often used.
    public static SystemAccount CA;
    public static SystemAccount OCSP;

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    @Override
    public void init(String domain, String signingAlgorithm, SystemAccount ca, SystemAccount ocsp) {
        serverDomain = domain;
        CA = ca;
        OCSP = ocsp;
        CryptoEngine.signingAlgorithm = signingAlgorithm;
        crlWorker = new CRLWorker(CA.getPrivateKey(), CA.getCertificate());
    }

    @Override
    public User getSignedCertificate(User user) {
        return CertificateWorker.getSignedCertificate(user);
    }

    @Override
    public Device getSignedCertificate(User user, Device device) {
        return CertificateWorker.getSignedCertificate(user, device);
    }

    @Override
    public SystemAccount getSignedCertificate(SystemAccount systemAccount) {
        return CertificateWorker.getSignedCertificate(systemAccount);
    }

    @Override
    public void revokeCertificate(RevocationRequest revocationRequest) {
        crlWorker.getInput().add(revocationRequest);
        synchronized (crlWorker.getInput()) {
            crlWorker.getInput().notify();
        }
    }

    @Override
    public AtomicReference<X509CRLHolder> getLatestCRL() {
        return crlWorker.getExistingCRL();
    }

    @Override
    public OCSPResp getOCSPResponse(OCSPReq ocspRequest) {
        return null;
    }
}
