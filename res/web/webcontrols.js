//this will be the start of where all of the admin panel controls are put.

var botname = "botnamehere" //IT IS IMPORTANT TO REPLACE THIS WITH YOUR BOT'S NAME
var url = "http://localhost:25000/user=" + encodeURI(botname) + "&message=";

//Start music player controls
function nextSong() {
    xmlhttp.open("PUT",url + encodeURI("skipsong"),true);
    xmlhttp.send();
}

function stealSong() {
    xmlhttp.open("PUT",url + encodeURI("stealsong"),true);
    xmlhttp.send();
}


