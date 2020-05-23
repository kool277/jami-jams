package net.jami.jams.updater;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import net.jami.jams.common.updater.FileDescription;

import java.util.HashMap;
import java.util.TimerTask;

@Slf4j
@Getter
@Setter
public class UpdateCheckTask extends TimerTask {

    private HashMap<String, FileDescription> remoteData;

    protected UpdateCheckTask() {
    }

    @Override
    public void run() {
        try {
            remoteData = new HashMap<>();
            //Download the info from the remote server.

            //Compare with local -> if(remote > local)
            JAMSUpdater.updateAvailable.set(true);

        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
        }
    }
}
