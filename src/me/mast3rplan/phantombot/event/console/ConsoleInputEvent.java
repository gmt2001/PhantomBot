package me.mast3rplan.phantombot.event.console;

public class ConsoleInputEvent extends ConsoleEvent {

    String msg;

    public ConsoleInputEvent(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }
}
