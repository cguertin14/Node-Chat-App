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
        if (!isRealString(params.room)) {
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
        let user = users.getUser(socket.id);

        if (user && isRealString(newMessage.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name,newMessage.text));
        }

        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
        }
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