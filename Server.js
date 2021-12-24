const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
       origin:['localhost:8080'],
    }
})
var public = path.join(__dirname, 'public');

const port = process.env.PORT || 8080;

app.use('/', express.static('public'))

let Path = '/whiteteam.html';
let numclients = 0;
app.get('/', (req, res) =>{
    if(numclients === 0)
    {
         res.sendFile(path.join(public, '/whiteteam.html'));
    }
    if(numclients === 1)
    {
        res.sendFile(path.join(public, '/blackteam.html'))
    }
   console.log("Sent html file!");
});

class playerinfo{
    playername = '';
    socketid = '';
    active = false
    team = 'black';

    New(n, s, t)
    {
        this.playername = n;
        this.socketid = s;
        this.active = true;
        this.team = t;
    }

    erase()
    {
        this.active = false;
    }
}

class roominfo{
    constructor(r, pname, sockid, t)
    {
        this.room = r;
        this.roomsize++;
        if(!this.player1.active)
        {
            this.player1.New(pname, sockid, t);
        }
        else
        {
            this.player2.New(pname, sockid, t);
        }
    }

    room = '';
    roomsize = 0;
    player1 = new playerinfo();
    player2 = new playerinfo();

    HasPlayer(sock_id)
    {
        if(this.player1.socketid === sock_id || this.player2.socketid === sock_id)
        {
            return true;
        }

        return false;
    }

    AddPlayer(pname, sock_id)
    {
        if(this.roomsize === 2)
        {
            console.log('socket cannot connect, room is full!!!');
            return false;
        }
        if(!this.player1.active)
        {
            this.roomsize++;
            this.player1.New(pname, sock_id, 'white');
            return true;
        }
        if(!this.player2.active)
        {
            this.roomsize++;
            this.player2.New(pname, sock_id, 'black');
            return true;
        }
        console.log('room is full but player is inactive!');
        return false;
    }

    RemovePlayer(sock_id)
    {
        if(this.player2.socketid === sock_id)
        {
            this.roomsize--;
            this.player2.erase();
            return {
                room: this.room,
                name: this.player2.playername
            }
        }
        if(this.player1.socketid === sock_id)
        {
            this.roomsize--;
            this.player1.erase();
            return {
                room: this.room,
                name: this.player1.playername 
            }
        }
        console.log('sock_id did not match any players in RemovePlayer!!');
        return {
            room: 'null',
            name: null
        }
    }

    RoomEmpty()
    {
        if(!this.player1.active && !this.player2.active)
        {
            return true;
        }

        return false;
    }
}

let roomholder = [];
let room = '';

function FindRoom(sock_id){
    for(let i = 0; i < roomholder.length; ++i){
        if(roomholder[i].HasPlayer(sock_id))
            return roomholder[i].room;
    };
    console.log("Error " + sock_id + " was not found in function FindRoom!");
    return 'null';
}

function FindRoomandName(sock_id){
    for(let i = 0; i < roomholder.length; ++i){
        if(roomholder[i].HasPlayer(sock_id))
        {
            return {
                room: roomholder[i].room,
                p_name: roomholder[i].player1.playername
            }
        }
    };
}

function DeletePlayer(sock_id)
{
    for(let i = 0; i < roomholder.length; ++i){
        if(roomholder[i].HasPlayer(sock_id))
        {
            let obj = roomholder[i].RemovePlayer(sock_id);
            if(roomholder[i].RoomEmpty())
            {
                roomholder.splice(i, 1);
            }
            return obj;
        }
    };

    return {
        room: 'null',
        p_name: 'null'
    }
}

io.on('connection', (socket) =>{
    if(numclients == 2)
    {
        numclients == -1;
    }

    console.log(socket.id);
    socket.on('join', (player) =>{
        if(roomholder.length === 0)
        {
            roomholder.push(new roominfo(player.room, player.PlayerName, socket.id, 'white'));
        }
        else
        {
            for(let index = 0; index < roomholder.length; ++index)
            {
                if(roomholder[index].room === player.room)
                {
                    if(!roomholder[index].AddPlayer(player.PlayerName, socket.id, 'black'))
                    {
                        console.log("socket cannot connect, room is full!!!");
                        return;
                    }
                }
            }
        }

        ++numclients;
        room = player.room;
        socket.join(player.room);
        socket.in(player.room).emit('enterroom', (player.PlayerName + ` has entered the room: ${player.room}!`));
    })

    socket.on('take-piece', (thing) =>{
        let answer = FindRoomandName(socket.id);
        socket.in(answer.room).emit('remove-piece', thing);
        console.log(thing);
    });

    socket.on('drag-in', (obj) =>{
        let room = FindRoom(socket.id);
        socket.in(room).emit('monitor-drag-in', (obj));
    });

    socket.on('drag-leave', (obj) => {
        let room = FindRoom(socket.id);
        socket.in(room).emit('monitor-drag-leave', (obj));
    });

    socket.on('disconnect', () =>{
        numclients--;
        let answer = DeletePlayer(socket.id);
        socket.in(answer.room).emit('leaveroom', answer.name + " left the room!");
    })
})

server.listen(port, () => {
    console.log(`Currently listening on port ${port}...`);
});
