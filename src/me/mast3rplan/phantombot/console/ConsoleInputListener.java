package me.mast3rplan.phantombot.console;

import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.console.ConsoleInputEvent;

public class ConsoleInputListener extends Thread {

    @Override
    public void run() {
        while (true) {
            try {
                String msg = com.gmt2001.Console.in.readLine();
                EventBus.instance().post(new ConsoleInputEvent(msg));
                Thread.sleep(10);
            } catch (Exception e) {}
        }
    }
}
