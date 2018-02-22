// Please also see index.js for the server logic.
// Also, since I see "4 functions from chosen library":
// emit() and on() are used in this file.
// Others from Express and Socket.io are found in index.js.

'use strict';
// why tho

var socket = io();
var form = document.getElementById('sender');
var id = null;

/*
Notification ordering is as follows:
Time:        time / 0
Device ID:   dID  / 1
Title:       t    / 2
Description: d    / 3
Color:       c    / 4
*/

// Handles form submissions.
form.onsubmit = function () {
    var toSend = [
        Date.now(),
        id,
        document.getElementById('title').value,
        document.getElementById('description').value,
        document.getElementById('color').value
    ];
    socket.emit('notification', toSend);
    wipeNotiForm();
    return false;
};

// Server returns the ID to client for differentiation between
// the different origins of each message.
socket.on('connect_acknowledge', function (conID) {
    id = conID;
});

// When the socket receives a notification, this parses it
// and displays it.
socket.on('notification', function (data) {
    var notiLog = document.getElementById('notiLog');
    var newNoti = document.createElement('li');

    var d = new Date(data[0]);
    var timeStr = d.toLocaleString();

    var notiTime = document.createTextNode(timeStr);
    var notiTimeEl = document.createElement("h3");

    var notiTitle = document.createTextNode(data[2]);
    var notiTitleEl = document.createElement("h2");

    var notiDesc = document.createTextNode(data[3]);
    var notiDescEl = document.createElement("p");

    notiTimeEl.appendChild(notiTime);
    notiTitleEl.appendChild(notiTitle);
    notiDescEl.appendChild(notiDesc);

    newNoti.appendChild(notiTimeEl);
    newNoti.appendChild(notiTitleEl);
    newNoti.appendChild(notiDescEl);

    // If notification comes from the same instances, right align it
    // otherwise, left align
    if (data[1] == id) {
        newNoti.classList.add('right');

        // If notification doesn't override the color, use the default based on side
        if (data[4] != 'default') {
            newNoti.classList.add(data[4]);
        } else {
            newNoti.classList.add('gray');
        }
    } else {
        newNoti.classList.add('left');
        if (data[4] != 'default') {
            newNoti.classList.add(data[4]);
        } else {
            newNoti.classList.add('blue');
        }
    }

    // After all options modified on new element, add it to the log
    notiLog.appendChild(newNoti);
});

// Resets the form when needed
function wipeNotiForm() {
    var f = document.getElementById('sender');
    f.title.value = '';
    f.description.value = '';
    f.color.value = 'default';
}