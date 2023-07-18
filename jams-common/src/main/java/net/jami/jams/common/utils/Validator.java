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
package net.jami.jams.common.utils;

import net.jami.jams.common.objects.requests.CreateCARequest;

import java.math.BigInteger;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class Validator {

    public static boolean validateCARequests(CreateCARequest request) {
        if (request.getCertificate() == null || request.getPrivateKey() == null) {
            return true;
        }

        if (request.getCertificate().getBasicConstraints() == -1) {
            return false;
        }

        RSAPublicKey rsaPublicKey = (RSAPublicKey) request.getCertificate().getPublicKey();
        RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) request.getPrivateKey();

        return rsaPublicKey.getModulus().equals(rsaPrivateKey.getModulus())
                // https://en.wikipedia.org/wiki/RSA_(cryptosystem)
                // 2 ** (e * d - 1) mod n == 1
                && BigInteger.valueOf(2).modPow(rsaPublicKey.getPublicExponent()
                        .multiply(rsaPrivateKey.getPrivateExponent()).subtract(BigInteger.ONE),
                        rsaPublicKey.getModulus()).equals(BigInteger.ONE);
    }
}
