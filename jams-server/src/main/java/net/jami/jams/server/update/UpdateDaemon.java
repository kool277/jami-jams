package net.jami.jams.server.update;

import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

public class UpdateDaemon extends Timer {

    public static final String UPDATE_SERVER_URI = "https://jami.net";
    public static final List<String> updateFiles = new ArrayList<>();

    public UpdateDaemon() {
        this.schedule(new UpdateCheckTask(updateFiles),0,150_000);
    }

}
