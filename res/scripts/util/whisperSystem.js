$.getWhisperString = function (sender) {
    return $.username.resolve(sender) + " -> ";
}

$.getWhisperStringStatic = function (sender) {
    return $.username.resolve(sender) + " -> ";
}