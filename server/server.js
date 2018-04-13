import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { generateMessage, generateLocationMessage } from './utils/message';

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

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined!'));

    socket.on('createMessage', (newMessage, callback) => {
        console.log('Create Message',newMessage);
        io.emit('newMessage', generateMessage(newMessage.from,newMessage.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect',() => {
        console.log('User is disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});