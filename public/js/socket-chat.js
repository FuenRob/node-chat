var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

var user = {
    name: params.get('name'),
    room: params.get('room')
};

socket.on('connect', function() {
    socket.emit('entryChat', user, function(resp) {
        renderPeople(resp);
    });

});

// Listen connection
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

// Listen information
socket.on('sentMessage', function(message) {
    renderChats(message, false);
    scrollBottom()
});

// Listen changes in session
socket.on('listPeople', function(people) {
    renderPeople(people);
});

// Private message
socket.on('sentPrivate', function(message) {
    console.log('Mensaje Privado:', message);
});
