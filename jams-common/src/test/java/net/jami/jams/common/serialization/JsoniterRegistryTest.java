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
import com.jsoniter.output.JsonStream;
import net.jami.jams.common.objects.requests.DeviceRegistrationRequest;
import net.jami.jams.common.objects.roots.X509Entity;
import net.jami.jams.common.utils.X509Utils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.fail;

class JsoniterRegistryTest {

    static String strPrivateKey;
    static String strCertificate;
    static String strPkcs10Request;

    @BeforeAll
    public static void loadProps(){
        try {
            JsoniterRegistry.initCodecs();
            InputStream path;
            ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
            path = classLoader.getResourceAsStream("cakey.txt");
            strPrivateKey = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("cacert.txt");
            strCertificate = new String(path.readAllBytes());
            path = classLoader.getResourceAsStream("pkcs10request.txt");
            strPkcs10Request = new String(path.readAllBytes());
        }
        catch (Exception e){
            fail("Could not set-up resources for test!");
        }
    }

    @Test
    void X509SerializationAndDeserialization(){
        X509Entity entity = new X509Entity();
        entity.setCertificate(X509Utils.getCertificateFromPEMString(strCertificate));
        entity.setPrivateKey(X509Utils.getKeyFromPEMString(strPrivateKey));
        String x = JsonStream.serialize(entity);
        Assertions.assertNotNull(x,"Serialization failed!");
        entity = null;
        entity = JsonIterator.deserialize(x,X509Entity.class);
        Assertions.assertNotNull(entity.getCertificate(),"Certificate was not parsed!");
        Assertions.assertNotNull(entity.getPrivateKey(),"Private key was not parsed!");
    }

    @Test
    void CSRDeserializeTest(){
        String input = "{\"csr\":\"" + strPkcs10Request + "\"}";
        DeviceRegistrationRequest request = JsonIterator.deserialize(input, DeviceRegistrationRequest.class);
        Assertions.assertNotNull(request.getCsr(),"CSR Should not have been null!");
    }

}