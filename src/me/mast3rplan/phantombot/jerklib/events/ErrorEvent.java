package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Session;

public class ErrorEvent extends IRCEvent {
    private final ErrorType errorType;

    public enum ErrorType {
        NUMERIC_ERROR,
        UNRESOLVED_HOSTNAME,
        GENERIC
    }


    public ErrorEvent(String data, Session session, ErrorType errorType) {
        super(data, session, Type.ERROR);
        this.errorType = errorType;
    }

    /**
     * Get the error type
     *
     * @return ErrorType
     */
    public ErrorType getErrorType() {
        return errorType;
    }

}
