package net.jami.jams.server.update;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

@Getter
@Setter
public class UpdateDaemon extends Timer {

    public  static final String UPDATE_SERVER_URI = "https://jami.net";
    public static final List<String> updateFiles = new ArrayList<>();

    public UpdateDaemon() {
        this.schedule(new UpdateCheckTask(updateFiles),0,150_000);
    }

}
