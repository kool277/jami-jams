package net.jami.jams.common.updater;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class FileDescription implements Comparable {

    private String fileName;
    private String version;
    private String md5hash;
    private String mainClass;


    @Override
    public int compareTo(Object o) {
        if(o == null) throw new NullPointerException();
        if(!(o instanceof FileDescription)) throw new ClassCastException();
        return new BigDecimal(this.version).compareTo(new BigDecimal(((FileDescription) o).getVersion()));
    }
}
