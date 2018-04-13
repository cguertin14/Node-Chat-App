import path from 'path';
import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import { generateMessage, generateLocationMessage } from './utils/message';
import { isRealString } from './utils/validation';
import Users from './utils/users';

// Public path.
const publicPath = path.join(__dirname, '../public')
// Application (express).
const app = express();
// Socketio server
const server = http.createServer(app);
// IO
const io = socketIO(server);
// Users
let users = new Users();
// Port of the server.
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection',(socket) => {
    console.log('New user connected');

    socket.on('join', (params,callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.')
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,params.name,params.room);
        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined.`));
        callback();
    });

    socket.on('createMessage', (newMessage, callback) => {
        console.log('Create Message',newMessage);
        io.emit('newMessage', generateMessage(newMessage.from,newMessage.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude, coords.longitude));
    });

    socket.on('disconnect',() => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left.`));
        }
        console.log('User is disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});