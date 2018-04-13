let socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.on('newMessage', function(newMessage) {
        let li = $('<li></li>');
        li.text(`${newMessage.from}: ${newMessage.text}`);
        $('#messages').append(li);
    });

    socket.on('newLocationMessage', function(newLocatioMessage) {
        let li = $('<li></li>');
        let a = $('<a target="_blank">My current location</a>');
        
        li.text(`${newLocatioMessage.from}: `);
        a.attr('href',newLocatioMessage.url);
        li.append(a);
        $('#messages').append(li);
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
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

let slBtn = $('#send-location');
slBtn.click(function() {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location.');    
    });
});