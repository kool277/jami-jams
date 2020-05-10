package net.jami.jams.cryptoengine.workers.csr.utils;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CertificateExtendedData {
    private List<Object[]> extensions = new ArrayList<>();
}


