package net.jami.jams.common.updater;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class FileDescription {

    private String fileName;
    private String version;
    private String md5hash;
    private String mainClass;


}
