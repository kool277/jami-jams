package net.jami.jams.updater;

import com.jsoniter.JsonIterator;
import com.jsoniter.any.Any;
import lombok.Getter;
import lombok.Setter;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

@Getter
@Setter
public class UpdateDaemon extends Timer {

    protected static volatile String UPDATE_SERVER_URI;
    private static volatile Long UPDATE_INTERVAL;
    public static final List<String> updateFiles = new ArrayList<>();

    public UpdateDaemon() throws IOException {

        InputStream input = this.getClass().getClassLoader().getResourceAsStream("oem/config.json");
        Any any = JsonIterator.deserialize(input.readAllBytes());
        UPDATE_SERVER_URI = any.get("UPDATE_URL").toString();
        UPDATE_INTERVAL = any.get("UPDATE_INTERVAL").toLong();
        this.schedule(new UpdateCheckTask(),0,UPDATE_INTERVAL);
    }

}
