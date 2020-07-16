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
package net.jami.jams.common.serialization;

import com.jsoniter.JsonIterator;
import com.jsoniter.output.EncodingMode;
import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.DecodingMode;
import com.jsoniter.spi.JsoniterSpi;
import net.jami.jams.common.objects.contacts.Contact;
import net.jami.jams.common.serialization.decoders.CSRDecoder;
import net.jami.jams.common.serialization.decoders.PrivateKeyDecoder;
import net.jami.jams.common.serialization.decoders.X509CertificateDecoder;
import net.jami.jams.common.serialization.encoders.PrivateKeyEncoder;
import net.jami.jams.common.serialization.encoders.X509CertificateEncoder;
import net.jami.jams.common.serialization.serializers.ContactCodec;
import org.bouncycastle.pkcs.PKCS10CertificationRequest;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;

public class JsoniterRegistry {

    public static void initCodecs(){
        JsonStream.setMode(EncodingMode.DYNAMIC_MODE);
        JsonIterator.setMode(DecodingMode.DYNAMIC_MODE_AND_MATCH_FIELD_WITH_HASH);
        JsoniterSpi.registerTypeDecoder(X509Certificate.class,new X509CertificateDecoder());
        JsoniterSpi.registerTypeDecoder(PrivateKey.class,new PrivateKeyDecoder());
        JsoniterSpi.registerTypeEncoder(X509Certificate.class,new X509CertificateEncoder());
        JsoniterSpi.registerTypeEncoder(PrivateKey.class,new PrivateKeyEncoder());
        JsoniterSpi.registerTypeDecoder(PKCS10CertificationRequest.class,new CSRDecoder());
        JsoniterSpi.registerTypeEncoder(Contact.class,new ContactCodec());
        JsoniterSpi.registerTypeDecoder(Contact.class,new ContactCodec());
    }


}
