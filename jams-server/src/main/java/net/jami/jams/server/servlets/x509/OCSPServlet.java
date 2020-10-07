/*
 * Copyright (C) 2020 by Savoir-faire Linux
 * Authors: William Enright <william.enright@savoirfairelinux.com>
 *          Ndeye Anna Ndiaye <anna.ndiaye@savoirfairelinux.com>
 *          Johnny Flores <johnny.flores@savoirfairelinux.com>
 *          Mohammed Raza <mohammed.raza@savoirfairelinux.com>
 *          Felix Sidokhine <felix.sidokhine@savoirfairelinux.com>
 *
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
package net.jami.jams.server.servlets.x509;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.jami.jams.ca.JamsCA;
import net.jami.jams.common.utils.X509Utils;
import org.bouncycastle.asn1.DEROctetString;
import org.bouncycastle.asn1.ocsp.OCSPObjectIdentifiers;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.Extensions;
import org.bouncycastle.cert.jcajce.JcaX509CertificateHolder;
import org.bouncycastle.cert.ocsp.CertificateID;
import org.bouncycastle.cert.ocsp.OCSPReq;
import org.bouncycastle.cert.ocsp.OCSPReqBuilder;
import org.bouncycastle.cert.ocsp.OCSPResp;
import org.bouncycastle.operator.DigestCalculator;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;

import java.io.IOException;
import java.security.cert.X509Certificate;

@WebServlet("/api/ocsp")
public class OCSPServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/ocsp-response");
        byte[] content = new byte[Integer.parseInt(req.getHeader("Content-Length"))];
        try {
            for(int i=0;i<content.length;i++){
                req.getInputStream().read(content);
            }
            JcaDigestCalculatorProviderBuilder digestCalculatorProviderBuilder = new JcaDigestCalculatorProviderBuilder();
            DigestCalculatorProvider digestCalculatorProvider = digestCalculatorProviderBuilder.build();
            DigestCalculator digestCalculator = digestCalculatorProvider.get(CertificateID.HASH_SHA1);
            // Generate the id for the certificate we are looking for
            X509Certificate targetCert = X509Utils.getCertificateFromPEMString(new String(content));

            if (targetCert != null) {
                CertificateID id = new CertificateID(digestCalculator,
                        new JcaX509CertificateHolder(JamsCA.CA.getCertificate()), targetCert.getSerialNumber());

                // basic request generation with nonce
                OCSPReqBuilder gen = new OCSPReqBuilder();
                gen.addRequest(id);

                // create details for nonce extension
                String nonce = String.valueOf(System.nanoTime());
                Extension ext = new Extension(OCSPObjectIdentifiers.id_pkix_ocsp_nonce, false, new DEROctetString(new DEROctetString(nonce.getBytes()).getEncoded()));
                gen.setRequestExtensions(new Extensions(new Extension[]{ext}));
                OCSPReq ocspReq = gen.build();
                OCSPResp response = JamsCA.getOCSPResponse(ocspReq, targetCert);

                if (response != null) {
                    byte[] respBytes = response.getEncoded();
                    resp.getOutputStream().write(respBytes);
                } else resp.setStatus(404);
            }
        }
        catch (Exception e) {
            resp.sendError(404, "Could not find the requested certificate!");
        }
    }
}