
import {io} from 'socket.io-client';
const socket = io('localhost:8080');
let whitespots = document.querySelectorAll("white");
let blackspots = document.querySelectorAll("black");
let queen = document.getElementById("lq");
let board = document.getElementById("cb");
let itemclicked = document.getElementById("lq");
let Square = document.getElementById("11");
let dragsquare = document.getElementById("11");
let home = document.getElementById("11");
let chesspiecehome = home;
let lastspot = home;
let focusenter = Square;
let focusleave = Square;
let chesspiece = null;
let item = 1;
let draged_piece = document.getElementById("lq");
let blackteam = [];
let whiteteam = [];
let chesspieces = [];

class playerinfo
{
    constructor(playername, room)
    {
        this.PlayerName = playername;
        this.room = room
    }

    PlayerName = '';
    room = '';
}

let Player = new playerinfo(prompt("Please enter your name.", ''), prompt("Please enter the room you would like to join.", ''));
socket.on('connect', () =>{
    socket.emit('join', (Player));
    if(socket.connected)
    alert("You connected to room " + Player.room);
});

socket.on('error', (message) => {
    alert(Player.PlayerName + "has a problem with connecting! " + message);
});

socket.on('leaveroom', (message) => {
    alert(message);
});

socket.on('enterroom', (message) => {
    alert(message);
});
/*
class Move{
    constructor(mp, mt, r, id)
    {
        this.movedpiece = mp;
        this.movedto = mt;
        this.room = r;
    }

    movedpiece = 'something';
    movedto = 'something';
    room = 'something';
    id = 'something';
}

socket.on('passmove', (data) =>{
    console.log("Entered passmove on clientside!");
    var piece = getElementById(data.movedpiece).parentElement.parentElement;
    var square = piece.parentElement;
    square.removeChild(piece);
    square = getElementById(data.movedto);
    if(square.children.length > 0)
    {
        square.removechild(square.children.item(0));
    }

    square.appendChild(piece);   
});
*/
    let item2 = item;
    let itemend = 8;

    while(true)
    {
        let elem = document.getElementById(item.toString() + item2.toString());
        let child = elem.firstElementChild;
        if(child !== null)
        {
            child.addEventListener('dragstart', (e) => {
                chesspiecehome = child.parentElement;
                chesspiece = child;
                console.log('chesspiecehome.id is: ' + chesspiecehome.id);
                console.log('child.id is: ' + child.id);
                console.log('child.children.item(0).id is: ' + child.children.item(0).id);
            });
        }
        
        elem.addEventListener("dragend", function(e)
        {
            if(focusenter === null)
            {
                console.log('focusenter is equal to null!!!!');
                 return;
            }
            console.log('this.id is: ' + this.id);
            console.log('chesspiecehome.id is: ' + chesspiecehome.id);
            console.log('chesspiecehome.children.item(0).id is: ' + chesspiecehome.children.item(0).id);
            if(focusenter.className  === 'black drag-over' || focusenter.className === 'white drag-over' || focusenter.className === 'white' || focusenter.className === 'black')
            {
                console.log('focusenter.id is: ' + focusenter.id);
                console.log('enterd drag-over!!!!!!!!!!!!');
                console.log('focusenter.children.length is: ' + focusenter.children.length);
                if(focusenter.children.length)
                {
                    console.log('focusenter.children.item(0)..item(0).ariaLabel is: ' + focusenter.children.item(0).children.item(0).ariaLabel);
                    console.log('chesspiece.ariaLabel is: ' + chesspiece.ariaLabel);
                    if(focusenter.children.item(0).children.item(0).ariaLabel === chesspiece.children.item(0).ariaLabel)
                    {
                        return;
                    }
                    if(focusenter.children.item(0).ariaLabel === 'light')
                        {
                            let cp = focusenter.children.item(0);
                            whiteteam.push(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('take-piece', (cp.children.item(0).id));
                        }
                     else
                        {
                            let cp = focusenter.children.item(0);
                            blackteam.push(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('take-piece', (cp.children.item(0).id));
                        }
                }
                if(!chesspiecehome.children.item(0))
                {
                    console.log("chesspiecehome has no children to remove!");
                    console.log("chesspiecehome.id is: " + chesspiecehome.id);
                    console.log('chesspiece.id is: ' + chesspiece.id);
                    return;
                }
                chesspiecehome.removeChild(chesspiece);
                focusenter.appendChild(chesspiece);
            }
        
            /*
            if(this.children.length)
            {
                if(focusenter.children.length)
                {
                    if(focusenter.children.item(0).ariaLabel == this.children.item(0).ariaLabel)
                    {
                        return;
                    }
                    else{
                        /*
                        console.log('if(focusenter.children.item(0).ariaLabel == this.children.item(0).ariaLabel)');
                        console.log('focusenter.children.item(0).id is: ' + focusenter.children.item(0).id);
                        console.log('this.children.item(0).id is: ' + this.children.item(0));
                        focusenter.removeChild(focusenter.children.item(0));
                        focusenter.appendChild(this.children.item(0));
                        return;
                        
                    }
                }
                if(focusenter.className === 'black drag-over' || focusenter.className === 'white drag-over')
                {
                    
                    console.log('if(focusenter.className == black drag-over || focusenter.className == white drag-over)');
                    focusenter.appendChild(this.children.item(0));
                    let cp = focusenter.children.item(0).children.item(0).id;
                    console.log('piece: ' + cp);
                    console.log('from: ' + this.id);
                    console.log('to: ' + focusenter.id);
                    socket.emit('movemade', {
                        piece: cp,
                        from: this.id,
                        to: focusenter.id
                    });
                    return;
                    
                }
                else{
                    console.log("this.children.item(0).arialabel is: " + this.children.item(0).ariaLabel)
                    if(focusenter.parentElement.ariaLabel === this.children.item(0).children.item(0).ariaLabel)
                    return;
                    else{
                        
                        console.log('if(focusenter.parentElement.ariaLabel === this.children.item(0).children.item(0).ariaLabel)');
                        let pelement = focusenter.parentElement.parentElement.parentElement
                        if(focusenter.parentElement.ariaLabel === 'dark')
                        {
                            whiteteam.push(pelement.children.item(0));
                        }
                        else
                        {
                            darkteam.push(pelement.children.item(0));
                        }
                        console.log('pelement.id is: ' + pelement.id);
                        console.log('pelement.children.item(0).id is: ' + pelement.children.item(0).id);
                        console.log('this.children.item(0).id is: ' + this.children.item(0).id)
                        pelement.removeChild(pelement.children.item(0));
                        pelement.appendChild(this.children.item(0));
                        socket.emit('movemade', {
                            piece: pelement.children.item(0).children.item(0).id,
                            from: this.id,
                            to: pelement.id
                        });
                        
                    }
                }
            }*/
        });
        
        elem.addEventListener("mouseleave", SetSquareLeave, true);

        elem.addEventListener("dragenter", function(e)
        {
            e.preventDefault();
            console.log('this.className is: ' + this.className);
            if(this.className === 'black' || this.className === 'white' || this.className === 'white drag-over' || this.className === 'black drag-over')
            {
                console.log("enterd className if statement!!!");
                focusenter = this;
                focusenter.classList.add('drag-over');
            }
            else{
                let htl = this.parentElement;
                while(htl.className !== 'white' || htl.className !== 'black')
                {
                    htl = htl.parentElement;
                }
                htl.classList.add('drag-over');
            }
            console.log('focusenter.id is: ' + focusenter.id);
            socket.emit('drag-in', ({
                piece: chesspiece.children.item(0).id,
                square: focusenter.id
            }));
        });

        elem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        elem.addEventListener("dragleave", function(e)
        {
            socket.emit('drag-leave', (focusenter.id));
            this.classList.remove('drag-over');
            lastspot = focusenter;
        });

        if(item2 === itemend && item != itemend)
        {
            ++item;
            item2 = 0;
        }
        else if(item2 == itemend && item == itemend){
            break;
        }

        item2 = item2 + 1;
    }

function SetSquareLeave()
{
    focusleave = this;
    focusleave.classList.remove('drag-over');
}


socket.on('remove-piece', (data) =>{
    console.log("Move recieved to second board!");
    let cp = document.getElementById(data);
    if(cp === null)
    {
        console.log('cp is null in Socket (take-piece)');
        return;
    }

    let cpparent = cp.parentElement;
    if(cpparent === null)
    {
        console.log('cpparent element is null in socket(take-piece)');
        return;
    }
    
    let parent = cpparent.parentElement;
    if(parent === null)
    {
        console.log('parent element is null in socket(take-piece)');
        return;
    }

    if(cp.ariaLabel === 'light')
    {
        whiteteam.push(cpparent);
    }

    else 
    {
        blackteam.push(cpparent);
    }
    parent.removeChild(cpparent);
});

socket.on('monitor-drag-in', (obj) => {
    console.log("obj.square value: " + obj.square);
    let boardspot = document.getElementById(obj.square);
    if(boardspot === null)
        return;
    let cp = document.getElementById(obj.piece);
    cp = cp.parentElement;
    let parent = cp.parentElement;
    parent.removeChild(cp);
    let error = boardspot.appendChild(cp);
    console.log("socket.on(monitor-drag-in) " + error);
});

/*
socket.on('monitor-drag-leave', (id) => {
    let boardsquare = document.getElementById(id);
    if(boardsquare !== null)
    {
        boardsquare.classList.remove('drag-over');
    }
    else{
        console.log(id + " id did not match any thing in socket.on('monitor-drag-leave')!");
    }
});
*/


