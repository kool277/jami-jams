package net.jami.jams.authmodule;

import net.jami.jams.common.authmodule.TokenHolder;

import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class TokenController extends Timer {

    private ConcurrentHashMap<String, TokenHolder> tokenMap = new ConcurrentHashMap<>();

    public TokenController() {
        this.schedule(new TimerTask() {
            @Override
            public void run() {
                tokenMap.forEach( (k,v) -> {
                    if(v.getExpires() < System.currentTimeMillis()) tokenMap.remove(k);
                });
            }
        },0,1000);
    }

    public String generateToken(String username, Long expiry){
        String token = UUID.randomUUID().toString();
        tokenMap.put(username,new TokenHolder(token,expiry));
        return token;
    }

    public String getUsernameFromToken(String token){
        StringBuilder username = new StringBuilder();
        tokenMap.forEach( (k,v) -> {
            if(v.getToken().equals(token)){
                username.append(v.getToken());
            }
        });
        if(username.length() != 0) return username.toString();
        return null;
    }
}
