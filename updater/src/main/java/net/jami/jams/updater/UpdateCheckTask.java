package net.jami.jams.updater;

import lombok.extern.slf4j.Slf4j;

import java.util.TimerTask;

@Slf4j
public class UpdateCheckTask extends TimerTask {


    protected UpdateCheckTask() {
    }

    @Override
    public void run() {
        try {

        }
        catch (Exception e){
            log.error("Could not check for updates with error: {}",e.getMessage());
        }
    }
}
