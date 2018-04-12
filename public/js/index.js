let socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.on('newMessage', function(newMessage) {
        console.log('New Message', newMessage);
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});