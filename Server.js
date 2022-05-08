const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const express = require('express');
const { SocketAddress } = require('net');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
       origin:[deploy]
    }
})
var public = path.join(__dirname, 'public');
const port = process.env.PORT || 8080;

app.use('/', express.static('public'));
app.enable('post');

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
            console.log("removed player2 in RemovePlayer");
            this.roomsize--;
            console.log("roomsize is: " + this.roomsize);
            this.player2.erase();
            return {
                room: this.room,
                name: this.player2.playername
            }
        }
        if(this.player1.socketid === sock_id)
        {
            console.log("removed player1 in RemovePlayer");
            this.roomsize--;
            console.log("roomsize is: " + this.roomsize);
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
            console.log("room is empty in RoomEmpty");
            return true;
        }

        console.log("room is not empty in RoomEmpty");
        return false;
    }

    GetPlayerStatusTeam()
    {
        if(this.player1.active)
        {
            if(this.player1.team == 'black') return {team: 'white', id: this.player1.socketid};
            else return {team: 'black', id: this.player1.socketid};
        }

        if(this.player2.active)
        {
            if(this.player2.team == 'black') return {team: 'white', id: this.player2.socketid};
            else return {team: 'black', id: this.player2.socketid};
        }
        return {team: 'white', id: 'no_id'};
    }

    GetOppositeId(sock_id)
    {
        if(this.player1.socketid === sock_id)
        return this.player2.socketid;

        if(this.player2.socketid === sock_id)
        return this.player1.socketid;

        console.log("Could not find player id in GetOppositeId in room holder!");
        return '0';
    }
}

let roomholder = [];
let room = '';

app.get('/', (req, res) =>{
    res.sendFile(path.join(public, '/board.html'));
    console.log("Sent html file!");
});

function FindRoomIndex(sock_id)
{
    for(let i = 0; i < roomholder.length; ++i){
        if(roomholder[i].HasPlayer(sock_id))
            return i;
    };
    console.log("Error " + sock_id + " was not found in function FindRoom!");
    return -1;
}

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

function FindOppositePlayerID(sock_id)
{
    let index = FindRoomIndex(sock_id);
    if(index === -1)
    {
        console.log('room index was not found in FindOppositePlayerID!');
        return 0;
    }
    return roomholder[index].GetOppositeId(sock_id);
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
let boarddata = null;
function BoardData()
{
    if(boarddata)
    return true;

    return false;
}

io.on('connection', (socket) =>{
    let p = null;
    let team = 'white'
    socket.on('join', (player) =>{
        if(roomholder.length === 0)
        {
            roomholder.push(new roominfo(player.room, player.PlayerName, socket.id, team));
            console.log(roomholder);
        }
        else
        {
            for(let index = 0; index < roomholder.length; ++index)
            {
                if(roomholder[index].room === player.room)
                {
                    p = roomholder[index].GetPlayerStatusTeam();
                    if(!roomholder[index].AddPlayer(player.PlayerName, socket.id, p.team))
                    {
                        io.to(socket.id).emit("reconnect_fail", "Cannot connect due to room being full but most likely because something is wrong");
                        console.log("socket cannot connect, room is full!!!");
                        return;
                    }
                    console.log(roomholder);
                }
            }
        }

        room = player.room;
        socket.join(player.room);
        if(p) 
        {
            console.log("going to check stat of board in " + p.id + " !!!!!!!!!!!!!!");
            team = p.team;
            io.to(p.id).emit('check_state_of_board', ('status'));
            p = null;
        }
        io.to(socket.id).emit('team-assigned', (team));
        let Obj = {
            Name: player.PlayerName,
            sentence: player.PlayerName + " has entered room!"
        };
        socket.in(player.room).emit('enterroom', (Obj));
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

    
    socket.on('move finished', (obj) =>{
        console.log(obj);
        let room = FindRoom(socket.id);
        socket.in(room).emit('checkforcheck', (obj));
    });

    socket.on('i-lost', (something) => {
        console.log(something);
        let room = FindRoom(socket.id);
        socket.in(room).emit('you-win', (something));
    });

    socket.on('castle move', (obj) => {
        console.log(obj);
        let room = FindRoom(socket.id);
        socket.in(room).emit('send castle move', (obj));
        let newobj ={
            P: obj.P,
            Name: 'King',
            spot: obj.kinghome,
            id: obj.king
        }
        socket.in(room).emit('checkforcheck', (newobj));
    });
    
    socket.on('queen-me', (obj) =>{
        console.log("queen-me obj");
        console.log(obj);
        let room = FindRoom(socket.id);
        socket.in(room).emit('queen-it', (obj));
    });

    socket.on('drag-leave', (obj) => {
        let room = FindRoom(socket.id);
        socket.in(room).emit('monitor-drag-leave', (obj));
    });

    socket.on('invalid-move', (obj) => {
        console.log('entered invalid move!');
        console.log('cid ' + obj.cp + ' sid ' + obj.sp);
        let room = FindRoom(socket.id);
        socket.in(room).emit('move-back', (obj));
    });

    socket.on('disconnect', (reason) =>{
        let answer = DeletePlayer(socket.id);
        socket.in(answer.room).emit('leaveroom', answer.name + " disconnected because; " + reason);
    });

    socket.on('state_is', (bool) => {
        console.log('entered stat_is with socket.id: ' + socket.id);
        //board is not a fresh board, moves have been made. Need to update the other players board that reconnected...
        console.log('goin into get board data!!!!!!!!!');
        if(!bool) io.to(socket.id).emit('get_board_data', ('please'));
    });

    socket.on('board_data', (data) => {
        console.log('entered board_data with socket.id: ' + socket.id);
        console.log(data);
        io.to(FindOppositePlayerID(socket.id)).emit('update-board', (data)); 
    });
})

server.listen(port, () => {
    console.log(`Currently listening on port ${port}...`);
});
