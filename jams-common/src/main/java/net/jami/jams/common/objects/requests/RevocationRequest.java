package net.jami.jams.common.objects.requests;

import lombok.Getter;
import lombok.Setter;

import java.math.BigInteger;

@Getter
@Setter
public class RevocationRequest {
    private BigInteger identifier;
    private RevocationType revocationType;
}
