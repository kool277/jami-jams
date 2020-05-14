package net.jami.jams.ca.workers.ocsp;

import lombok.extern.slf4j.Slf4j;
import net.jami.jams.ca.workers.X509Worker;
import net.jami.jams.ca.workers.crl.CRLWorker;
import net.jami.jams.common.cryptoengineapi.ocsp.CertificateStatus;
import net.jami.jams.common.cryptoengineapi.ocsp.CertificateSummary;
import net.jami.jams.common.cryptoengineapi.ocsp.OCSPCertificateStatusMapper;
import org.bouncycastle.asn1.ocsp.OCSPObjectIdentifiers;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.Extensions;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.cert.X509CRLEntryHolder;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.bouncycastle.cert.ocsp.*;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DefaultDigestAlgorithmIdentifierFinder;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaContentVerifierProviderBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;

import java.math.BigInteger;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static net.jami.jams.ca.JamsCA.*;

@Slf4j
public class OCSPWorker extends X509Worker<String> {

    private final CRLWorker crlWorker;
    private final RespID responderID;
    private final ContentSigner contentSigner;
    private final JcaContentVerifierProviderBuilder contentVerifierProvider = new JcaContentVerifierProviderBuilder().setProvider("BC");

    //To process OCSP requests we need access to the CRL, hence we might as well just pass it here.
    public OCSPWorker(PrivateKey privateKey, X509Certificate certificate, CRLWorker crlWorker) throws Exception {
        super(privateKey, certificate);
        this.crlWorker = crlWorker;
        DigestCalculatorProvider digestCalculatorProvider = new JcaDigestCalculatorProviderBuilder().setProvider("BC").build();
        // only SHA-1 is supported for responder IDs.
        this.responderID = new RespID(SubjectPublicKeyInfo.getInstance(CA.getCertificate()), digestCalculatorProvider.get(new DefaultDigestAlgorithmIdentifierFinder().find("SHA-1")));
        this.contentSigner = new JcaContentSignerBuilder("SHA256withRSA").setProvider("BC").build(OCSP.getPrivateKey());
        log.info("Instantiated OCSP Worker...");
    }

    public OCSPResp getOCSPResponse(OCSPReq ocspRequest) {
        try{
            OCSPResp resp = validateRequest(ocspRequest);
            if(resp != null) return resp; //this means the request is invalid and we should notify the client.
            //If the request was valid, we move on to other things.
            BasicOCSPRespBuilder responseBuilder = new BasicOCSPRespBuilder(responderID);
            Collection<Extension> responseExtensions = new ArrayList<>();
            Extension nonceExtension = ocspRequest.getExtension(OCSPObjectIdentifiers.id_pkix_ocsp_nonce);
            if (nonceExtension != null) responseExtensions.add(nonceExtension);
            Extension[] extensions = responseExtensions.toArray(new Extension[responseExtensions.size()]);
            responseBuilder.setResponseExtensions(new Extensions(extensions));
            for (Req request : ocspRequest.getRequestList()) {
                addResponse(responseBuilder, request);
            }
            BasicOCSPResp basicResponse = responseBuilder.build(
                    contentSigner,
                    new X509CertificateHolder[]{new JcaX509CertificateHolder(OCSP.getCertificate())},
                    new Date()
            );
            return new OCSPRespBuilder().build(OCSPRespBuilder.SUCCESSFUL, basicResponse);
        }
        catch (Exception e){
            log.error("Could not verify the signature on the OCSP request with error {}",e.getMessage());
            return null;
        }
    }

    private OCSPResp validateRequest(OCSPReq ocspRequest) throws Exception {
        if (ocspRequest == null || (ocspRequest.isSigned() &&
                !ocspRequest.isSignatureValid(contentVerifierProvider.build(ocspRequest.getCerts()[0])))) {
            return new OCSPRespBuilder().build(OCSPRespBuilder.MALFORMED_REQUEST, null);
        }
        return null;
    }


    private CertificateSummary getCertificateSummary(BigInteger serial) {
        X509CRLEntryHolder x509CRLEntryHolder = crlWorker.getExistingCRL().get().getRevokedCertificate(serial);
        if (x509CRLEntryHolder != null)
            return new CertificateSummary(CertificateStatus.REVOKED, LocalDateTime.from(x509CRLEntryHolder.getRevocationDate().toInstant()), serial);
        else return new CertificateSummary(CertificateStatus.VALID, serial);
    }


    private void addResponse(BasicOCSPRespBuilder responseBuilder, Req request) throws OCSPException{
        CertificateID certificateID = request.getCertID();
        // Build Extensions
        Extensions extensions = new Extensions(new Extension[]{});
        Extensions requestExtensions = request.getSingleRequestExtensions();
        if (requestExtensions != null) {
            Extension nonceExtension = requestExtensions.getExtension(OCSPObjectIdentifiers.id_pkix_ocsp_nonce);
            if (nonceExtension != null) extensions = new Extensions(nonceExtension);
        }
        responseBuilder.addResponse(certificateID,
                OCSPCertificateStatusMapper.getStatus(getCertificateSummary(request.getCertID().getSerialNumber())),
                new Date(),
                new Date(new Date().getTime() + crlLifetime),
                extensions);
    }

}
