let socket = io();

socket.on('connect', function () {
    console.log('Connected to the server');

    socket.on('newMessage', function(newMessage) {

        let formattedTime = moment(newMessage.createdAd).format('h:mm a');
        let li = $('<li></li>');
        li.text(`${newMessage.from} ${formattedTime}: ${newMessage.text}`);
        $('#messages').append(li);
    });

    socket.on('newLocationMessage', function(newLocatioMessage) {
        let formattedTime = moment(newLocatioMessage.createdAd).format('h:mm a');
        let li = $('<li></li>');
        let a = $('<a target="_blank">My current location</a>');
        
        li.text(`${newLocatioMessage.from} ${formattedTime}: `);
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

    let messageTextbox = $('input[name="message"]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function() {
        messageTextbox.val('');
    });
});

let slBtn = $('#send-location');
slBtn.click(function() {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    slBtn.prop('disabled',true).text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        slBtn.prop('disabled',false).text('Send location');
    }, function() {
        alert('Unable to fetch location.');    
        slBtn.prop('disabled',false).text('Send location');
    });
});