package net.jami.jams.ca.workers.crl;

import net.jami.jams.common.serialization.fs.FileStorage;
import org.bouncycastle.cert.X509CRLHolder;

public class CRLFileStorage extends FileStorage<X509CRLHolder> {

    public CRLFileStorage(String file) {
        super(file);
    }

    @Override
    public X509CRLHolder getObject(byte[] bytes) throws Exception{
        return new X509CRLHolder(bytes);
    }

    @Override
    public byte[] getBytesFromObject(X509CRLHolder object) throws Exception {
        return object.getEncoded();
    }
}
