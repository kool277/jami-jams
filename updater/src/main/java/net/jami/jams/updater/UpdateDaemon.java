package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;

import java.util.Timer;

@Getter
@Setter
public class UpdateDaemon extends Timer {

    //TODO: This should come from the resources file.
    public  static final String UPDATE_SERVER_URI = "https://jami.net";

    public UpdateDaemon() {
        this.schedule(new UpdateCheckTask(),0,150_000);
    }

}
