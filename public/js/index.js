let socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.on('newMessage', function(newMessage) {
        let li = $('<li></li>');
        li.text(`${newMessage.from}: ${newMessage.text}`);
        $('#message-form').append(li);
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.emit('createMessage', {
    from: 'Frank',
    text: 'Hi'
}, function(data) {
    console.log(data);
});

$('#message-form').on('submit',function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('input[name="message"]').val()
    }, function(data) {

    });
    $('input[name="message"]').val('');
});