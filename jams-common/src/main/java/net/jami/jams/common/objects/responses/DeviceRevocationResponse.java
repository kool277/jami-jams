package net.jami.jams.common.objects.responses;

import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
public class DeviceRevocationResponse {


    private boolean success;
    private String errorDetails;
    private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss'Z'X");
    private String  timestamp = dateFormatter.format(new Date());

}
