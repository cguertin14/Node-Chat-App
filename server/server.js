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
        from: 'Dany',
        text: 'Hey watsup',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (newEmail) => {
        console.log('Create Message',newEmail);
    });

    socket.on('disconnect',() => {
        console.log('User is disconnected');
    })
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});