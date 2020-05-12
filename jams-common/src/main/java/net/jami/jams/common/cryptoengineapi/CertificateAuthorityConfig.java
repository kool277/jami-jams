package net.jami.jams.common.cryptoengineapi;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CertificateAuthorityConfig {
   private String serverDomain;
   private String signingAlgorithm;
   private Long   crlLifetime;
   private Long   userLifetime;
   private Long   deviceLifetime;
}
