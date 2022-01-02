
import {io} from 'socket.io-client';
const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const socket = io(deploy);
let board = document.getElementById('cb');
let Square = document.getElementById("11");
let home = document.getElementById("11");
let lastspot = home;
let chesspiecehome = home;
let focusenter = Square;
let focusleave = Square;
let chesspiece = null;
let item = 1;
let whitemoves = [];
let blackmoves = [];
let blackonboard = [];
let whiteonboard = [];
let blackteam = [];
let whiteteam = [];
let boardsquares = [];

function switchpiece(elem, h)
{
    let stringname = '';
    if(h < 62)
    {
        stringname = 'sms'
    }
    else if(h < 85)
    {
        stringname = 'smr';
    }
    else if(h < 152)
    {
        stringname = 'sm';
    }

    let child = elem.children.item(0).children.item(0).children.item(0);
    let path = child.src;
    let start = path.indexOf('light')
    if(start === -1)
    start = path.indexOf('dark');
    path = 'Chess_pieces/' + stringname + path.substr(start, path.length);
    elem.children.item(0).children.item(0).removeChild(child);
    let image = document.createElement('img');
    image.src = path
    console.log("path: " + path);
    image.ariaLabel = child.ariaLabel;
    elem.children.item(0).children.item(0).appendChild(image);
}

window.addEventListener('resize', (e) => {
    console.log("Entered window addevent listener :::::::::::::::::::::::::::::::::::::::");
    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    console.log("h: " + h);
    let w = h;
    let total = h * 8;
    h -= 2;
    console.log("total: " + total);
    board.style.width = total.toString() + 'px';
    board.style.height = total.toString() + 'px';
    for(let i = 0; i < boardsquares.length; ++i){
        boardsquares[i].style.height = h.toString() + 'px';
        boardsquares[i].style.width = h.toString() + 'px';
        console.log("boardsquares[i].height" + boardsquares[i].offsetHeight);
        if(boardsquares[i].children.length)
        {
            switchpiece(boardsquares[i], h - 2);
        }
    };
    console.log("Exited window addevent listener :::::::::::::::::::::::::::::::::::::::");
});

function GetApposingTeamMoves(team)
{
    if(team === 'light')
    return blackmoves;

    return whitemoves;
}
//add all the pieces to thier respective arrays...
for(let i = 1; i < 9; ++i)
{
    blackonboard.push(document.getElementById('dp' + i.toString()).parentElement);
    whiteonboard.push(document.getElementById('lp' + i.toString()).parentElement);
    if(i === 1)
    {
        blackonboard.push(document.getElementById('dr' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lr' + i.toString()).parentElement);
        blackonboard.push(document.getElementById('dk' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lk' + i.toString()).parentElement);
        blackonboard.push(document.getElementById('db' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lb' + i.toString()).parentElement);
        blackonboard.push(document.getElementById('dk').parentElement);
        whiteonboard.push(document.getElementById('lk').parentElement);
        blackonboard.push(document.getElementById('dq').parentElement);
        whiteonboard.push(document.getElementById('lq').parentElement);
    }
    if(i === 2)
    {
        blackonboard.push(document.getElementById('dr' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lr' + i.toString()).parentElement);
        blackonboard.push(document.getElementById('dk' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lk' + i.toString()).parentElement);
        blackonboard.push(document.getElementById('db' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lb' + i.toString()).parentElement);
    }
}

console.log(blackonboard);
console.log(whiteonboard);




function RemoveFromBoard(elem)
{
    if(elem.id === 'lt')
    {
        whiteteam.push(elem);
        console.log('white*****************');
        console.log(whiteonboard);
        console.log(elem);
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            console.log("Index: " + i + " " + whiteonboard[i].children.item(0).id + " " + elem.children.item(0).id);
            if(whiteonboard[i].children.item(0).id == elem.children.item(0).id)
            {
                console.log("ENTERE ARRAYYYYY!!!" + whiteonboard[i].children.item(0).id + " " + elem.children.item(0).id)
                whiteonboard.splice(i, 1);
                console.log(whiteonboard);
                return;
            }
        }
        console.log(whiteonboard);
    }
    else{
        blackteam.push(elem);
        console.log('black*****************');
        console.log(blackonboard);
        console.log(elem);
        for(let i = 0; i < blackonboard.length; ++i)
        {
            console.log("Index: " + i + " " + blackonboard[i].children.item(0).id + " " + elem.children.item(0).id);
            if(blackonboard[i].children.item(0).id == elem.children.item(0).id)
            {
                console.log("ENTERE ARRAYYYYY!!!" + blackonboard[i].children.item(0).id + " " + elem.children.item(0).id);
                blackonboard.splice(i, 1);
                console.log(blackonboard);
                return;
            }
        }
        console.log(blackonboard);
    }
}

let toppawn = document.getElementById('21');
let bottompawn = document.getElementById('71');

class PawnStart {
    constructor(r, s, t)
    {
        this.row = r;
        this.start = s;
        this.team = t;
    }
    row = 'unknown';
    start = 'unknown';
    team = 'unknown';
}



let Toppawn = new PawnStart('2', 'top', toppawn.children.item(0).children.item(0).ariaLabel);
let Bottompawn = new PawnStart('7', 'bottom', bottompawn.children.item(0).children.item(0).ariaLabel);

console.log(Toppawn);
console.log(Bottompawn);
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

class Moves{
    moves = [];
    IsValidMove(id)
    {
        for(let i = 0; i < this.moves.length; ++i)
        {
            if(this.moves[i] === id)
            {
                return true;
            }
        }
        return false;
    }

    ClearMoves()
    {
        for(let i = 0; i < this.moves.length; ++i)
        {
            let spot = document.getElementById(this.moves[i].toString());
            if(spot === null)
            {
                console.log("Error spot in ClearMoves in Diagnalmoves is null! this.moves[" + i + "] is: " + this.moves[i]);
                return;
            }
            spot.classList.remove('moves');
        }
        this.moves = [];
        
    }
}

class diagnalmove extends Moves{
    onemove = false;
    getDiamoves(spot, team, kingmove, moves_available, theoretical)
    {
        let row = 1;
        let col = 1;
        let iteration = 0;
        if(spot === null)
        {
            console.log("Error spot passed to getmoves is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.log("team in getmoves is not equal to light or dark! team is: " + team);
            return;
        }

        row = parseInt(spot.toString().slice(0,1));
        col = parseInt(spot.toString().slice(1,2));
        console.log("Entered getDiamoves IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIi spot is: " + row + col);
        console.log("this: " + this);
        for(let iteration = 1; iteration < 5; ++iteration)
        {
            console.log("Entered for loop in getDiagmove!!!! iteration is: " + iteration);
            this.onemove = false;
            this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    DiaMoves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        console.log("Entered Moves Diag iteration is: " + iteration + " ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("Spot = " + row + col);
        if(!this.Check(row, col, iteration))
        {
            console.log("this.check(row, col, iteration) return false! Leaving Moves~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            return;
        }
        let next =  document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in diagnalRU!");
            return;
        }
        if(next.children.length)
        {
            console.log("next.children.lenth is: true!"); 
            console.log(next);
            console.log("next.children.item(0).children.item(0).ariaLabel: " + next.children.item(0).children.item(0).ariaLabel + " team: " + team);
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                        console.log("next.classlist.add('moves')");
                    }
                    this.moves.push(next.id);
                    console.log("Leaving Moves through if(theoretical && !this.onemove)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    return;
                }
                console.log("Leaving Moves throug if(next.children.item(0).children.item(0).ariaLabel === team)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                return;
            }
            if(kingmove)
            {
                console.log("KingMove is true");
                let opposition = GetApposingTeamMoves(team);
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    {
                        console.log("Leaving Moves through if(opposition[i] === next.id)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        return;
                    }
                }
            }
            if(moves_available)
            {
                console.log("Entered if(moves_available)");
                next.classList.add('moves');
            }
            console.log("this.moves.push(next.id)");
            this.moves.push(next.id);
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmove)
                {
                    console.log("kingmove New Recursion ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))");
                    console.log(this.Rowincrement);
                    this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            return
        }
        if(kingmove)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("diaglu opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            console.log("next.classList.add('moves');");
            next.classList.add('moves');
        }
        console.log("this.moves.push(next.id);")
        this.moves.push(next.id);
        if(!kingmove)
        {
            console.log("New Recursion ))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))");
            this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }
    
    Rowincrement(row, iter)
    {
        console.log("This is a Diag func increment row!!!");
        switch(iter)
        {
            case 1: return row + 1;
            case 2: return row + 1;
            case 3: return row - 1;
            case 4: return row - 1;
            default: return row;
        }
    }

    Colincrememt(col, iter)
    {
        console.log("This is a Diag func increment col!!!");
        switch(iter)
        {
            case 1: return col + 1;
            case 2: return col - 1;
            case 3: return col + 1;
            case 4: return col - 1;
            default: return col;
        }
    }

    Check(row, col, iteration)
    {
        let min = 1;
        let max = 8;
        if(iteration === 1)
        {
            if(row > max || col > max)
            {
                return false;
            }
            return true;
        }
        if(iteration === 2)
        {
            if(row > max || col < min)
            {
                return false;
            }
            return true;
        }
        if(iteration === 3)
        {
            if(row < min || col > max)
            {
                return false;
            }
            return true;
        }
        if(iteration === 4)
        {
            if(row < min || col < min)
            {
                return false;
            }
            return true;
        }
    }
}

class HorizontalMove extends diagnalmove{

    onemove = false;
    getHormoves(spot, team, kingmove = false, moves_available, theoretical)
    {
        if(spot === null)
        {
            console.log("Error spot passed to getmoves is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.log("team in getmoves is not equal to light or dark! team is: " + team);
            return;
        }

        let row = parseInt(spot.toString().slice(0,1));
        let col = parseInt(spot.toString().slice(1,2));
        this.onemove = false;
        for(let iteration = 1; iteration < 5; ++iteration)
        {
            this.onemove = false;
            this.Moves(this.incrementrow(row, iteration), this.incrememtcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
        return;
/*
        let originrow = row;
        let origincol = col;
        this.onemove = false;
        this.Right(row, ++col, team, kingmove, moves_available, theoretical);

        row = originrow;
        col = origincol;
        this.onemove = false;
        this.Left(row, --col, team, kingmove, moves_available, theoretical);

        row = originrow;
        col = origincol;
        this.onemove = false;
        this.Down(++row, col, team, kingmove, moves_available, theoretical);

        row = originrow;
        col = origincol;
        this.onemove = false;
        this.Up(--row, col, team, kingmove, moves_available, theoretical);
        */
    }
    
    Right(row, col, team, kingmoves, moves_available, theoretical)
    {
        let max = 8;
        let min = 1;
        if(row > max || row < min)
        {
            console.log("row is greater than max or less than min in Right horizontalmoves! y is: " + row);
            return;
        }

        if(col > max)
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("next is null in Right HorizonalMoves!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            if(kingmoves)
            {
                let opposition = GetApposingTeamMoves(team);
                console.log("left opposition");
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    return;
                }
            }
            if(moves_available)
            {
                next.classList.add('moves');
            }
            this.moves.push(next.id);
            
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmoves)
                {
                    this.Right(row, ++col, team, kingmoves, moves_available, theoretical);
                }
            }
            return;
        }
        if(kingmoves)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("right opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
        if(!kingmoves)
        {
            this.Right(row, ++col, team, kingmoves, moves_available, theoretical);
        }
        
    }

    Left(row, col, team, kingmoves, moves_available, theoretical)
    {
        let max = 8;
        let min = 1;
        console.log("Enter Left row: " + row + " col: " + col);
        if(row > max || row < min)
        {
            console.log("row is greater than max or less than min in Left horizontalmoves! y is: " + row);
            return;
        }

        if(col < min)
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("next is null in Left HorizonalMoves!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            if(kingmoves)
            {
                let opposition = GetApposingTeamMoves(team);
                console.log("left opposition");
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    return;
                }
            }
            if(moves_available)
            {
                next.classList.add('moves');
            }
            console.log("engaged return in Left. next id is: " + next.id);
            this.moves.push(next.id);
            
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmoves)
                {
                    this.Left(row, --col, team, kingmoves, moves_available, theoretical);
                }
            }
            return;
        }
        if(kingmoves)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("left opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
        if(!kingmoves)
        {
            this.Left(row, --col, team, kingmoves, moves_available, theoretical);
        }
        
    }

    Down(row, col, team, kingmoves, moves_available, theoretical)
    {
        let max = 8;
        let min = 1;
        if(col > max || col < min)
        {
            console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
            return;
        }

        if(row > max)
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("next is null in Down HorizonalMoves!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            if(kingmoves)
            {
                let opposition = GetApposingTeamMoves(team);
                console.log("left opposition");
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    return;
                }
            }
            if(moves_available)
            {
                next.classList.add('moves');
            }
            this.moves.push(next.id);
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmoves)
                {
                    this.down(++row, col, team, kingmoves, moves_available, theoretical);
                }
            }
            return;
        }
        if(kingmoves)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("down opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
        if(!kingmoves)
        {
            this.Down(++row, col, team, kingmoves, moves_available, theoretical);
        }
    }

    Up(row, col, team, kingmoves, moves_available, theoretical)
    {
        let max = 8;
        let min = 1;
        if(col > max || col < min)
        {
            console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
            return;
        }

        if(row < min)
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("next is null in Down HorizonalMoves!");
            return;
        }
        if(next.children.length)
        {
            console.log("aJKDFLJDSLKFJDKSLJFDLKSFJDSLKJFLKDS " + next.children.item(0).children.item(0).ariaLabel + " " + team)
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            if(kingmoves)
            {
                let opposition = GetApposingTeamMoves(team);
                console.log("left opposition");
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    return;
                }
            }
            if(moves_available)
            {
                next.classList.add('moves');
            }
            this.moves.push(next.id);
            
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmoves)
                {
                    this.Up(--row, col, team, kingmoves, moves_available, theoretical);
                }
            }
            return;
        }
        if(kingmoves)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("up opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
        if(!kingmoves)
        {
            this.Up(--row, col, team, kingmoves, moves_available, theoretical);
        }
    }

    Moves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.check(row, col, iteration))
        {
            return;
        }
        let next =  document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in diagnalRU!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical && !this.onemove)
                {
                    this.onemove = true;
                    if(moves_available)
                    {
                        next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            if(kingmove)
            {
                let opposition = GetApposingTeamMoves(team);
                console.log(opposition);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] === next.id)
                    return;
                }
            }
            if(moves_available)
            {
                next.classList.add('moves');
            }
            this.moves.push(next.id);

            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmove)
                {
                    this.Moves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            return
        }
        if(kingmove)
        {
            let opposition = GetApposingTeamMoves(team);
            console.log("diaglu opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
        if(!kingmove)
        {
            this.Moves(this.incrementrow(row, iteration), this.incrememtcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    incrementrow(row, iter)
    {
        console.log("This is a horizontal func increment row!!!");
        switch(iter)
        {
            case 1: return row;
            case 2: return row;
            case 3: return row + 1;
            case 4: return row - 1;
            default: return row;
        }
    }

    incrememtcol(col, iter)
    {
        console.log("This is a horizontal func increment row!!!");
        switch(iter)
        {
            case 1: return col + 1;
            case 2: return col - 1;
            case 3: return col;
            case 4: return col;
            default: return col;
        }
    }
    
    check(row, col, iteration)
    {
        let min = 1;
        let max = 8;
        if(iteration === 1)
        {
            if(row > max || row < min)
            {
                console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
                return false;
            }

            if(col > max)
            {
                return false;
            }

            return true;
        }
        if(iteration === 2)
        {
            if(row > max || row < min)
            {
                console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
                return false;
            }

            if(col < min)
            {
                return false;
            }

            return true;
            return true;
        }
        if(iteration === 3)
        {
            if(col > max || col < min)
            {
                console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
                return false;
            }

            if(row > max)
            {
                return false;
            }

            return true;
        }
        if(iteration === 4)
        {
            if(col > max || col < min)
            {
                console.log("col is greater than max or less than min in Down HorizontalMoves! x is: " + col);
                return false;
            }

            if(row < min)
            {
                return false;
            }

            return true;
        }
    }
}

class Knight extends Moves{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        if(spot === null)
        {
            console.log("Error spot passed to getmoves is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.log("team in getmoves is not equal to light or dark! team is: " + team);
            return;
        }

        let row = parseInt(spot.toString().slice(0,1));
        let col = parseInt(spot.toString().slice(1,2));

        let originrow = row;
        let origincol = col;

        this.KnightMove(row - 1, col - 2, team, moves_available, theoretical);
        this.KnightMove(row -2, col - 1, team, moves_available, theoretical);
        this.KnightMove(row + 1, col - 2, team, moves_available, theoretical);
        this.KnightMove(row + 2, col - 1, team, moves_available, theoretical);
        this.KnightMove(row - 1, col + 2, team, moves_available, theoretical);
        this.KnightMove(row -2, col + 1, team, moves_available, theoretical);
        this.KnightMove(row + 1, col + 2, team, moves_available, theoretical);
        this.KnightMove(row + 2, col + 1, team, moves_available, theoretical);
    }

    KnightMove(row, col, team, moves_available, theoretical)
    {
        let min = 1;
        let max = 8;
        if(row > max || row < min)
        {
            return;
        }

        if(col > max || col < min)
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("next is null in Up_one_left_two");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                if(theoretical)
                {
                    if(moves_available)
                    {
                         next.classList.add('moves');
                    }
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }
        this.moves.push(next.id);
    }
}

class Pawn extends Moves{
    GetDiagMoves(spot, team, moves_available = false, theoretical = false)
    {
        if(spot === null)
        {
            console.log("Error spot passed to getmoves pawn is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.log("team in getmoves pawn is not equal to light or dark! team is: " + team);
            return;
        }

        let row = parseInt(spot.toString().slice(0,1));
        let col = parseInt(spot.toString().slice(1,2));
        let originrow = row;
        let origincol = col;

        if(Toppawn.team === team)
        {
            this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
            this.MoveDiag(row, col + 1, team, moves_available, theoretical);
            return
        }
        this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
        this.MoveDiag(row, col + 1, team, moves_available, theoretical);
    }

    GetMoves(spot, team, moves_available = true)
    {
        if(spot === null)
        {
            console.log("Error spot passed to getmoves pawn is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.log("team in getmoves pawn is not equal to light or dark! team is: " + team);
            return;
        }

        let row = parseInt(spot.toString().slice(0,1));
        let col = parseInt(spot.toString().slice(1,2));
        let originrow = row;
        let origincol = col;

        row = originrow;
        col = origincol;
        if(Toppawn.row === row.toString() && Toppawn.team === team)
         {
            this.FirstMoveDown(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(++row, col - 1, team, moves_available);
            this.MoveDiag(row, col + 1, team, moves_available);

             return;
        }
        if(Bottompawn.row === row.toString() && Bottompawn.team === team)
        {
            this.FirstMoveUp(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(--row, col - 1, team, moves_available);
            this.MoveDiag(row, col + 1, team, moves_available);

            return;
        }

        if(Bottompawn.team === team)
        {
            this.FindMoveUp(row, col, team, moves_available);
            return;
        }

        this.FindMoveDown(row, col, team, moves_available);
    }

    FirstMoveDown(row, col, team, moves_available)
    {
        if(this.MoveForward(++row, col, team, moves_available))
        {
            this.MoveForward(++row, col, team, moves_available);
        }
    }

    FirstMoveUp(row, col, team, moves_available)
    {
        if(this.MoveForward(--row, col, team, moves_available))
        {
            this.MoveForward(--row, col, team, moves_available);
        }
    }

    FindMoveUp(row, col, team, moves_available)
    {
        this.MoveForward(--row, col, team, moves_available);
        this.MoveDiag(row, col + 1, team, moves_available);
        this.MoveDiag(row, col - 1, team, moves_available);
    }

    FindMoveDown(row, col, team, moves_available)
    {
        this.MoveForward(++row, col, team, moves_available);
        this.MoveDiag(row, col + 1, team, moves_available);
        this.MoveDiag(row, col - 1, team, moves_available);
    }

    MoveForward(row, col, team, moves_available)
    {       
        if(this.IsOnBoard(row, col))
        {
            let forward = document.getElementById(row.toString() + col.toString());
            if(forward === null)
            {
                console.log("forward is null in MoveFoward pawn!");
                return false;
            }
            if(!forward.children.length)
            {
                console.log("movesforward moves_available: " + moves_available)
                if(moves_available)
                {
                    forward.classList.add('moves');
                }
                this.moves.push(forward.id);
                return true;
            }
        }

        return false;
    }

    MoveDiag(row, col, team, moves_available, theoretical)
    {
        if(this.IsOnBoard(row, col))
        {
            let diag = document.getElementById(row.toString() + col.toString());
            if(diag === null)
            {
                console.log("left is null in MoveForward pawn!");
                return;
            }
            if(diag.children.length)
            {
                if(theoretical)
                {
                    console.log(diag);
                    console.log('diag.ariaLabel: ' + diag.children.item(0).children.item(0).ariaLabel + ' team: ' + team);
                    if(diag.children.item(0).children.item(0).ariaLabel === team)
                    {
                        console.log("entered movediag children^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                        if(moves_available)
                        {
                            diag.classList.add('moves');
                        }
                        this.moves.push(diag.id);
                        return;
                    }
                    return;
                }
                if(diag.children.item(0).children.item(0).ariaLabel !== team)
                {
                    console.log('row: ' + row + ' col: ' + col);
                    console.log("movesdiag moves_available: " + moves_available)
                    if(moves_available)
                    {
                        diag.classList.add('moves');
                    }
                    this.moves.push(diag.id);
                }
                return;
            }
            if(theoretical)
            {
                if(moves_available)
                {
                    diag.classList.add('moves');
                }
                this.moves.push(diag.id);
            }
        }
    }

    IsOnBoard(row, col)
    {
        let min = 1;
        let max = 8;

        if(row < min || row > max)
        {
            return false;
        }
        if(col < min || col > max)
        {
            return false;
        }

        return true;
    }
}

class King extends HorizontalMove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.getDiamoves(spot, team, true, moves_available, theoretical);
        this.getHormoves(spot, team, true, moves_available, theoretical);
    }
}

class Queen extends HorizontalMove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.getDiamoves(spot, team, false, moves_available, theoretical);
        this.getHormoves(spot, team, false, moves_available, theoretical);
    }
}

class Rook extends HorizontalMove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.getHormoves(spot, team, false, moves_available, theoretical);
    }
}

class Bishop extends diagnalmove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.getDiamoves(spot, team, false, moves_available, theoretical);
    }
}

let king = new King();
let queen = new Queen();
let rook = new Rook();
let bishop = new Bishop();
let knight = new Knight();
let pawn = new Pawn();

function GetPieceMoves(elem)
{
    if(elem.children.item(0).className === 'lightking' || elem.children.item(0).className === 'darkking')
    {
        king.ClearMoves();
        king.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightking')
        {
            for(let i = 0; i < king.moves.length; ++i)
            {
                whitemoves.push(king.moves[i]);
            }
            console.log('whiteking moves:');
            console.log(king.moves);
        }
        else{
            for(let i = 0; i < king.moves.length; ++i)
            {
                blackmoves.push(king.moves[i]);
            }
            console.log('blackking moves:');
            console.log(king.moves);
        }
    }
    if(elem.children.item(0).className === 'lightqueen' || elem.children.item(0).className === 'darkqueen')
    {
        queen.ClearMoves();
        queen.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightqueen')
        {
            for(let i = 0; i < queen.moves.length; ++i)
            {
                whitemoves.push(queen.moves[i]);
            }
            console.log('whitequeen moves:');
            console.log(queen.moves);
        }
        else{
            for(let i = 0; i < queen.moves.length; ++i)
            {
                blackmoves.push(queen.moves[i]);
            }
            console.log('blackqueen moves:');
            console.log(queen.moves);
        }
    }
    if(elem.children.item(0).className === 'lightrook' || elem.children.item(0).className === 'darkrook')
    {
        rook.ClearMoves();
        rook.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightrook')
        {
            for(let i = 0; i < rook.moves.length; ++i)
            {
                whitemoves.push(rook.moves[i]);
            }
            console.log('whiterook moves:' );
            console.log(rook.moves);
        }
        else{
            for(let i = 0; i < rook.moves.length; ++i)
            {
                blackmoves.push(rook.moves[i]);
            }
            console.log('blackrook moves:');
            console.log(rook.moves);
        }
    }
    if(elem.children.item(0).className === 'lightbishop' || elem.children.item(0).className === 'darkbishop')
    {
        bishop.ClearMoves();
        bishop.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightbishop')
        {
            for(let i = 0; i < bishop.moves.length; ++i)
            {
                whitemoves.push(bishop.moves[i]);
            }
            console.log('whitebishop moves:' );
            console.log(bishop.moves);
        }
        else{
            for(let i = 0; i < bishop.moves.length; ++i)
            {
                blackmoves.push(bishop.moves[i]);
            }
            console.log('whitebishop moves:');
            console.log(bishop.moves);
        }
    }
    if(elem.children.item(0).className === 'lightknight' || elem.children.item(0).className === 'darkknight')
    {
        knight.ClearMoves();
        knight.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightknight')
        {
            for(let i = 0; i < knight.moves.length; ++i)
            {
                whitemoves.push(knight.moves[i]);
            }
            console.log('whiteknight moves:');
            console.log(knight.moves);
        }
        else{
            for(let i = 0; i < knight.moves.length; ++i)
            {
                blackmoves.push(knight.moves[i]);
            }
            console.log('blackknight moves:');
            console.log(knight.moves);
        }
    }
    if(elem.children.item(0).className === 'lightpawn' || elem.children.item(0).className === 'darkpawn')
    {
        pawn.ClearMoves();
        pawn.GetDiagMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, true);
        if(elem.children.item(0).className === 'lightpawn')
        {
            for(let i = 0; i < pawn.moves.length; ++i)
            {
                whitemoves.push(pawn.moves[i]);
            }
            console.log('whitepawn moves:');
            console.log(pawn.moves);
        }
        else{
            for(let i = 0; i < pawn.moves.length; ++i)
            {
                blackmoves.push(pawn.moves[i]);
            }
            console.log('blackpawn moves:');
            console.log(pawn.moves);
        }
    }
}

function GetApposingMoves(team)
{
    whitemoves = [];
    blackmoves = [];
    if(team === 'dark')
    {
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            GetPieceMoves(whiteonboard[i]);
        }
        console.log('whitemoves array: ');
        console.log(whitemoves);
        return;
    }
    else{
        for(let i = 0; i < blackonboard.length; ++i)
        {
            GetPieceMoves(blackonboard[i]);
        }
        console.log('blackmoves array: ');
        console.log(blackmoves)
        return;
    }
}

let item2 = item;
let itemend = 8;

let h = (board.offsetHeight - 16) / 8;
h = parseInt(h.toString().substr(0, 2))
console.log("h: " + h);
let w = h;
let total = h * 8;
console.log("total: " + total);
board.style.width = total.toString() + 'px';
board.style.height = total.toString() + 'px';
h = h - 2;
w = w - 2;
    while(true)
    {
        let elem = document.getElementById(item.toString() + item2.toString());
        if(elem)
        {
            boardsquares.push(elem);
        }
        console.log("before height: " + elem.offsetHeight);
        console.log("before width: " + elem.offsetWidth);
        elem.style.height = h.toString().substr(0, 2) + 'px';
        elem.style.width = w.toString().substr(0, 2)+ 'px';
        console.log("board height: " + board.offsetHeight);
        console.log("board width: " + board.offsetWidth);
        console.log("height: " + elem.offsetHeight);
        console.log("width: " + elem.offsetWidth);
        let child = elem.firstElementChild;
        if(child !== null)
        {
            switchpiece(elem, h);
            child.addEventListener('dragstart', (e) => {
                chesspiecehome = child.parentElement;
                chesspiece = child;
                if(child.children.item(0).id === 'lk' || child.children.item(0).id === 'dk')
                {
                    console.log('king child::');
                    console.log(child);
                    GetApposingMoves(child.children.item(0).ariaLabel);
                    king.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    return;
                }
                if(child.children.item(0).id === 'lq' || child.children.item(0).id === 'dq')
                {
                    console.log('chesspiecehome.id: ' + chesspiecehome.id + ' chesspiece.id: ' + chesspiece.children.item(0).id);
                    console.log("Entered if(child.children.item(0).id === 'lq' || child.children.item(0).id === 'dq')")
                    queen.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    return;
                }
                if(child.children.item(0).className === 'lightrook' || child.children.item(0).className == 'darkrook')
                {
                    console.log('chesspiecehome.id: ' + chesspiecehome.id + ' chesspiece.id: ' + chesspiece.children.item(0).id);
                    rook.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    return;
                }
                if(child.children.item(0).className === 'lightbishop' || child.children.item(0).className == 'darkbishop')
                {
                    console.log('chesspiecehome.id: ' + chesspiecehome.id + ' chesspiece.id: ' + chesspiece.children.item(0).id);
                    bishop.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    return;
                }
                if(child.children.item(0).className === 'lightknight' || child.children.item(0).className == 'darkknight')
                {
                    console.log('chesspiecehome.id: ' + chesspiecehome.id + ' chesspiece.id: ' + chesspiece.children.item(0).id);
                    knight.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    return;
                }
                console.log('right before pawn dragstart@@@@@@@@@@@@@@@@@@');
                if(child.children.item(0).className === 'lightpawn' || child.children.item(0).className == 'darkpawn')
                {

                    console.log('chesspiecehome.id: ' + chesspiecehome.id + ' chesspiece.id: ' + chesspiece.children.item(0).id);
                    pawn.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, true);
                    console.log('left pawn dragstart@@@@@@@@@@@@@@@@@@');
                    return;
                }
            });
        }
        
        elem.addEventListener("dragend", function(e)
        {
            if(focusenter === null)
            {
                console.log('focusenter is equal to null!!!!');
                return;
            }
            if(focusenter.className  === 'black moves' || focusenter.className === 'white moves' || focusenter.className === 'white' || focusenter.className === 'black' 
            || focusenter.className === 'black drag-over' || focusenter.className === 'white drag-over')
            {
                console.log('focusenter.id: ' + focusenter.id + ' chesspiecehome.id: ' + chesspiecehome.id + ' e.currentTarget: ' + e.currentTarget.id + 'e.target.id: ' + e.target.id +'this.id: ' + this.id)
                if(focusenter.id === chesspiecehome.id)
                {
                    if(chesspiece.children.item(0).id === 'dk' || chesspiece.children.item(0).id === 'lk')
                    king.ClearMoves();
                    if(chesspiece.children.item(0).id === 'dq' || chesspiece.children.item(0).id === 'lq')
                    queen.ClearMoves();
                    if(chesspiece.children.item(0).className === 'lightrook' || chesspiece.children.item(0).className === 'darkrook')
                    rook.ClearMoves();
                    if(chesspiece.children.item(0).className === 'lightbishop' || chesspiece.children.item(0).className === 'darkbishop')
                    bishop.ClearMoves();
                    if(chesspiece.children.item(0).className === 'lightknight' || chesspiece.children.item(0).className === 'darkknight')
                    knight.ClearMoves();
                    if(chesspiece.children.item(0).className === 'lightpawn' || chesspiece.children.item(0).className === 'darkpawn')
                    pawn.ClearMoves();

                    return;
                }
                if(!chesspiecehome.children.item(0))
                {
                    console.log("chesspiecehome has no children to remove!");
                    console.log("chesspiecehome.id is: " + chesspiecehome.id);
                    console.log('chesspiece.id is: ' + chesspiece.id);
                    return;
                }

                if(chesspiece.children.item(0).id === 'dk' || chesspiece.children.item(0).id === 'lk')
                {
                    if(king.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            console.log('focchildren.id: ' + focusenter.children.item(0).id + ' chesspiec.id: ' + chesspiece.id);
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        console.log('focchildren.id: ' + focusenter.children.item(0).id + ' chesspiec.id: ' + chesspiece.id);
                        king.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        king.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }

                if(chesspiece.children.item(0).id === 'dq' || chesspiece.children.item(0).id === 'lq')
                {
                    if(queen.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        queen.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        queen.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }
                console.log("light rook className and id &&&&&&&&&&&&&&&&&&&&&" + chesspiece.children.item(0).className + ' ' + chesspiece.children.item(0).id)
                if(chesspiece.children.item(0).className === 'lightrook' || chesspiece.children.item(0).className === 'darkrook')
                {
                    if(rook.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        rook.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        rook.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }
                if(chesspiece.children.item(0).className === 'lightbishop' || chesspiece.children.item(0).className === 'darkbishop')
                {
                    if(bishop.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        bishop.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        bishop.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }
                if(chesspiece.children.item(0).className === 'lightknight' || chesspiece.children.item(0).className === 'darkknight')
                {
                    if(knight.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        knight.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        knight.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }
                if(chesspiece.children.item(0).className === 'lightpawn' || chesspiece.children.item(0).className === 'darkpawn')
                {
                    if(pawn.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                            socket.emit('move finished', Player);
                        }
                        chesspiecehome.removeChild(chesspiece);
                        
                        if(focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1')
                        {
                            let team = chesspiece.children.item(0).ariaLabel
                            chesspiece.children.item(0).removeChild(chesspiece.children.item(0).children.item(0));
                            chesspiece.children.item(0).classList.replace(team + 'pawn', team + 'queen');
                            chesspiece.children.item(0).id = 'lq';
                            let image = document.createElement('img');
                            image.src = 'Chess_Pieces/sm' + team + 'queen.png';
                            image.ariaLabel = team;
                            chesspiece.children.item(0).appendChild(image);
                        }
                        
                        focusenter.appendChild(chesspiece);
                        pawn.ClearMoves();
                        socket.emit('move finished', Player);
                        return;
                    }
                    else{
                        pawn.ClearMoves();
                        socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                        alert("Invalid move!");
                        return;
                    }
                }
            }
        });
        
        elem.addEventListener("mouseleave", SetSquareLeave, true);

        elem.addEventListener("dragenter", function(e)
        {
            e.preventDefault();
            console.log('this.id in Dragenter is: ' + this.id);
            console.log('this.className is: ' + this.className);
            if(this.className === 'black' || this.className === 'white' || this.className === 'white drag-over' || this.className === 'black drag-over' 
            || this.className === 'white moves' || this.className === 'black moves')
            {
                console.log("enterd className if statement!!!");
                focusenter = this;
             //   focusenter.classList.add('drag-over');
            }
            else{
                console.log("entered stupid looooop@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                let htl = this.parentElement;
                while(htl.className !== 'white' || htl.className !== 'black')
                {
                    htl = htl.parentElement;
                }
                htl.classList.add('drag-over');
            }
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
//            this.classList.remove('drag-over');
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

    RemoveFromBoard(cpparent);
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


socket.on('move-back', (obj) => {
    let cp = document.getElementById(obj.cp);
    let cpparent = cp.parentElement;
    console.log(cp);
    let home = document.getElementById(obj.sp);
    let parent = cp.parentElement.parentElement;
    console.log(obj);
    home.appendChild(cpparent);
 //   parent.removeChild(cpparent);
});

/*
socket.on('checkforcheck', (obj) => {
    let cp = null;
    let piecmoves = [];
    team = bottompawn.children.item(0).id;
    if(team === 'lt')
    {
        cp = document.getElementById('lk');
    }
    else{
        cp = document.getElementById('dk');
    }

    GetApposingMoves('dark');
    if(team === 'dt')
    {
        for(let i = 0; i < blackmoves.length; ++i)
        {
            if(blackmoves[i] === cp.parentElement.id)
            {
                alert(obj.PlayerName + " put you in check!");
            }
        }
    }
});
*/


