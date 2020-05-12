package net.jami.jams.ca.workers.csr.utils;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class CertificateExtendedData {
    private List<Object[]> extensions = new ArrayList<>();
}


