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
package net.jami.jams.common.serialization.encoders;

import com.jsoniter.output.JsonStream;
import com.jsoniter.spi.Encoder;

import net.jami.jams.common.utils.X509Utils;

import java.io.IOException;
import java.security.cert.X509Certificate;

public class X509CertificateEncoder implements Encoder {

    @Override
    public void encode(Object o, JsonStream jsonStream) throws IOException {
        jsonStream.write(
                ("\"" + X509Utils.getPEMStringFromCertificate((X509Certificate) o) + "\"")
                        .getBytes());
    }
}
