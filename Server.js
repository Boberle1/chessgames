const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin:['http://localhost:8080'],
    }
})
var public = path.join(__dirname, 'public');

const port = process.env.PORT || 8080;

app.use('/', express.static('public'))

let numclients = 0;
app.get('/', (req, res) =>{
    if(numclients === 0)
    {
         res.sendFile(path.join(public, '/whiteteam.html'));
    }
    else if(numclients === 1)
    {
        res.sendFile(path.join(public, '/blackteam.html'))
    }
   console.log("Sent html file!");
});

io.on('connection', (socket) =>{
    if(numclients == 2)
    {
        return;
    }
    console.log(socket.id);
    socket.on('join', (room) =>{
        numclients++;
        socket.join(room);
        console.log(room + ' joined the room!!!!!');
        let pov = numclients === 1 ? 'white' : 'black';
        io.to(socket.id).emit('pov', pov);
    })
    socket.on('movemade', (thing) =>{
        socket.in('board').emit('movesent', thing);
        console.log(thing);
    });

    socket.on('disconnect', () =>{
        numclients--;
        console.log(socket.id + " Client disconnected!");
    })
})

server.listen(port, () => {
    console.log(`Currently listening on port ${port}...`);
});
