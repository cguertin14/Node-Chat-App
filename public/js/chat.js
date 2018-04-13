let socket = io();

function scrollToBottom() {
    // Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');
    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if ((scrollTop + clientHeight + newMessageHeight + lastMessageHeight) >= scrollHeight) {
        messages.animate({ scrollTop: scrollHeight }, 500);
    }   
}

socket.on('connect', function () {
    let params = $.deparam(window.location.search);
    socket.emit('join',params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            // No error.
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUsersList', function(users) {
    console.log(users);
    let ol = $('<ol></ol>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });
    $('#users').html(ol);
});

socket.on('newMessage', function(newMessage) {
    let createdAt = moment(newMessage.createdAt).format('h:mm a');
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        from: newMessage.from,
        text: newMessage.text,
        createdAt
    });
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function(newLocatioMessage) {
    let createdAt = moment(newLocatioMessage.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        from: newLocatioMessage.from,
        text: 'My current location',
        url: newLocatioMessage.url,
        createdAt
    });
    $('#messages').append(html);
    scrollToBottom();
});

$('#message-form').on('submit',function(e) {
    e.preventDefault();

    let messageTextbox = $('input[name="message"]');

    socket.emit('createMessage', {
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