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

package net.jami.jams.common.serialization.decoders;

import com.jsoniter.JsonIterator;
import com.jsoniter.spi.Decoder;
import net.jami.jams.common.utils.X509Utils;

import java.io.IOException;

public class CSRDecoder implements Decoder {

    private static final String CSR_HEAD = "-----BEGIN NEW CERTIFICATE REQUEST-----\n";
    private static final String CSR_TAIL = "\n-----END NEW CERTIFICATE REQUEST-----";

    @Override
    public Object decode(JsonIterator jsonIterator) throws IOException {
        //This is legacy code, we need to sanitize the string
        String input = jsonIterator.readString();
        if (input == null) return null;
        input = input.replace(CSR_HEAD, "");
        input = input.replace(CSR_TAIL, "");
        input = input.replace("\n", "");
        input = CSR_HEAD + input + CSR_TAIL;
        //Once all legacy clients stop existing, this can safely be removed leaving only the jsonIter.readString()
        return X509Utils.getCSRFromString(input);
    }
}
