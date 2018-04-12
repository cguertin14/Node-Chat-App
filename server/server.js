import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';

// Public path.
const publicPath = path.join(__dirname, '../public')
// Application (express).
const app = express();
// Socketio server
const server = http.createServer(app);
// IO
const io = socketIO(server);
// Port of the server.
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app'
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user joined!'
    });

    socket.on('createMessage', (newMessage) => {
        console.log('Create Message',newMessage);
        io.emit('newMessage', {
            ...newMessage,
            createdAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', {
        //     ...newMessage,
        //     createdAt: new Date().getTime()
        // })
    });

    socket.on('disconnect',() => {
        console.log('User is disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});