
import {io} from 'socket.io-client';
const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const socket = io(local);
let Square = document.getElementById("11");
let home = document.getElementById("11");
let lastspot = home;
let chesspiecehome = home;
let focusenter = Square;
let focusleave = Square;
let chesspiece = null;
let item = 1;
let blackonboard = [];
let whiteonboard = [];
let blackteam = [];
let whiteteam = [];


function RemoveFromBoard(elem)
{
    if(elem.ariaLabel === 'light')
    {
        whiteteam.push(elem);
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            if(whiteonboard[i].children.item(0).id === elem.id)
            {
                whiteonboard.slice(i, 1);
                return;
            }
        }
    }
    else{
        blackteam.push(elem);
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            if(blackonboard[i].children.item(0).id === elem.id)
            {
                blackonboard.slice(i, 1);
                return;
            }
        }
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

    getDiamoves(spot, team, bool = false)
    {
        let row = 1;
        let col = 1;
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

        let originrow = row;
        let origincol = col;
        this.diagnalRD(++row, ++col, team, bool);

        row = originrow;
        col = origincol;
        this.diagnalRU(--row, ++col, team, bool);

        row = originrow;
        col = origincol;
        this.diagnalLD(++row, --col, team, bool);

        row = originrow;
        col = origincol;
        this.diagnalLU(--row, --col, team, bool);
    }

    diagnalRD(row, col, team, bool)
    {
        let max = 8;
        if(row > max || col > max)
        {
            console.log("diagnalRD row:" + row + " col: " + col);
            return
        }
        let next =  document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in diagnalRD!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }
        next.classList.add('moves');
        this.moves.push(next.id);
        if(!bool)
        {
            this.diagnalRD(++row, ++col, team, bool);
        }
    }

    diagnalLD(row, col, team, bool)
    {
        let max = 8;
        let min = 1;
        if(row > max || col < min)
        {
            console.log("diagnalLD row:" + row + " col: " + col);
            return
        }
        let next =  document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in diagnalLD!");
            return;
        }
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }
        next.classList.add('moves');
        this.moves.push(next.id);

        if(!bool)
        {
            this.diagnalLD(++row, --col, team, bool);
        }
    }

    diagnalRU(row, col, team, bool)
    {
        let max = 8;
        let min = 1;
        if(row < min || col > max)
        {
            console.log("diagnalRU row:" + row + " col: " + col);
            return
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
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }
        next.classList.add('moves');
        this.moves.push(next.id);
        if(!bool)
        {
            this.diagnalRU(--row, ++col, team, bool);
        }
    }

    diagnalLU(row, col, team, bool)
    {
        let min = 1;
        if(row < min || col < min)
        {
            console.log("diagnalLU row:" + row + " col: " + col);
            return
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
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }
        next.classList.add('moves');
        this.moves.push(next.id);
        if(!bool)
        {
            this.diagnalLU(--row, --col, team, bool);
        }
        
    }
}

class HorizontalMove extends diagnalmove{
    getHormoves(spot, team, bool = false)
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
        this.Right(row, ++col, team, bool);

        row = originrow;
        col = origincol;
        this.Left(row, --col, team, bool);

        row = originrow;
        col = origincol;
        this.Down(++row, col, team, bool);

        row = originrow;
        col = origincol;
        this.Up(--row, col, team, bool);
    }
    
    Right(row, col, team, bool)
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
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            console.log("engaged return in Right. next id is: " + next.id);
            return;
        }

        next.classList.add('moves');
        console.log("Right row: " + row + " col: " + col);
        this.moves.push(next.id);
        if(!bool)
        {
            this.Right(row, ++col, team, bool);
        }
        
    }

    Left(row, col, team, bool)
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
                return;
            }
            next.classList.add('moves');
            console.log("engaged return in Left. next id is: " + next.id);
            this.moves.push(next.id);
            return;
        }

        next.classList.add('moves');
        console.log("Left row: " + row + " col: " + col);
        this.moves.push(next.id);
        if(!bool)
        {
            this.Left(row, --col, team, bool);
        }
        
    }

    Down(row, col, team, bool)
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
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }

        next.classList.add('moves');
        this.moves.push(next.id);
        if(!bool)
        {
            this.Down(++row, col, team, bool);
        }
    }

    Up(row, col, team, bool)
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
            if(next.children.item(0).children.item(0).ariaLabel === team)
            {
                return;
            }
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }

        next.classList.add('moves');
        this.moves.push(next.id);
        if(!bool)
        {
            this.Up(--row, col, team, bool);
        }
    }
}

class Knight extends Moves{
    GetMoves(spot, team)
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

        this.KnightMove(row - 1, col - 2, team);
        this.KnightMove(row -2, col - 1, team);
        this.KnightMove(row + 1, col - 2, team);
        this.KnightMove(row + 2, col - 1, team);
        this.KnightMove(row - 1, col + 2, team);
        this.KnightMove(row -2, col + 1, team);
        this.KnightMove(row + 1, col + 2, team);
        this.KnightMove(row + 2, col + 1, team);
    }

    KnightMove(row, col, team)
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
                return;
            }
        }
        next.classList.add('moves');
        this.moves.push(next.id);
    }
}

class Pawn extends Moves{
    GetMoves(spot, team)
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
            this.FirstMoveDown(row, col, team);

            row = originrow;
            col = origincol;
            this.MoveDiag(++row, col - 1, team);
            this.MoveDiag(row, col + 1, team);

             return;
        }
        if(Bottompawn.row === row.toString() && Bottompawn.team === team)
        {
            this.FirstMoveUp(row, col, team);

            row = originrow;
            col = origincol;
            this.MoveDiag(--row, col - 1, team);
            this.MoveDiag(row, col + 1, team);

            return;
        }

        if(Bottompawn.team === team)
        {
            this.FindMoveUp(row, col, team);
            return;
        }

        this.FindMoveDown(row, col, team);
    }

    FirstMoveDown(row, col, team)
    {
        if(this.MoveForward(++row, col))
        {
            this.MoveForward(++row, col);
        }
    }

    FirstMoveUp(row, col, team)
    {
        if(this.MoveForward(--row, col))
        {
            this.MoveForward(--row, col);
        }
    }

    FindMoveUp(row, col, team)
    {
        this.MoveForward(--row, col);
        this.MoveDiag(row, col + 1);
        this.MoveDiag(row, col - 1);
    }

    FindMoveDown(row, col, team)
    {
        this.MoveForward(++row, col);
        this.MoveDiag(row, col + 1, team);
        this.MoveDiag(row, col - 1, team);
    }

    MoveForward(row, col, team)
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
                forward.classList.add('moves');
                this.moves.push(forward.id);
                return true;
            }
        }

        return false;
    }

    MoveDiag(row, col, team)
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
                if(diag.children.item(0).children.item(0).ariaLabel !== team)
                {
                    diag.classList.add('moves');
                    this.moves.push(diag.id);
                }
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
    GetMoves(spot, team)
    {
        this.getDiamoves(spot, team, true);
        this.getHormoves(spot, team, true);
    }
}

class Queen extends HorizontalMove{
    GetMoves(spot, team)
    {
        this.getDiamoves(spot, team);
        this.getHormoves(spot, team);
        console.log("Available moves... " + this.moves);
    }
}

class Rook extends HorizontalMove{
    GetMoves(spot, team)
    {
        this.getHormoves(spot, team);
        console.log("Available moves Rook... " + this.moves);
    }
}

class Bishop extends diagnalmove{
    GetMoves(spot, team)
    {
        this.getDiamoves(spot, team);
        console.log("Available moves Bishop... " + this.moves);
    }
}

let king = new King();
let queen = new Queen();
let rook = new Rook();
let bishop = new Bishop();
let knight = new Knight();
let pawn = new Pawn();

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
                if(child.children.item(0).id === 'lk' || child.children.item(0).id === 'dk')
                {
                    king.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
                    return;
                }
                if(child.children.item(0).id === 'lq' || child.children.item(0).id === 'dq')
                {
                    queen.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
                    return;
                }
                if(child.children.item(0).className === 'lightrook' || child.children.item(0).className == 'darkrook')
                {
                    rook.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
                    return;
                }
                if(child.children.item(0).className === 'lightbishop' || child.children.item(0).className == 'darkbishop')
                {
                    bishop.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
                    return;
                }
                if(child.children.item(0).className === 'lightknight' || child.children.item(0).className == 'darkknight')
                {
                    knight.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
                    return;
                }
                if(child.children.item(0).className === 'lightpawn' || child.children.item(0).className == 'darkpawn')
                {
                    pawn.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel);
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
                /*
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
                }*/
                if(focusenter.id === chesspiecehome.id)
                {
                    console.log("focusenter.id: " + focusenter.id);
                    console.log("chesspiecehome.id: " + chesspiecehome.id);
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
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        king.ClearMoves();
                        return;
                    }
                    else{
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
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        queen.ClearMoves();
                        return;
                    }
                    else{
                        alert("Invalid move!");
                        return;
                    }
                }
                if(chesspiece.children.item(0).className === 'lightrook' || chesspiece.children.item(0).className === 'darkrook')
                {
                    if(rook.IsValidMove(focusenter.id))
                    {
                        if(focusenter.children.length)
                        {
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        rook.ClearMoves();
                        return;
                    }
                    else{
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
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        bishop.ClearMoves();
                        return;
                    }
                    else{
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
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        knight.ClearMoves();
                        return;
                    }
                    else{
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
                            RemoveFromBoard(focusenter.children.item(0));
                            focusenter.removeChild(focusenter.children.item(0));
                        }
                        chesspiecehome.removeChild(chesspiece);
                        
                        if(focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1')
                        {
                            let team = chesspiece.children.item(0).ariaLabel
                            chesspiece.children.item(0).removeChild(chesspiece.children.item(0).children.item(0));
                            chesspiece.children.item(0).classList.replace(team + 'pawn', team + 'queen');
                            chesspiece.children.item(0).id = 'lq';
                            let image = document.createElement('img');
                            image.src = 'Chess_Pieces/' + team + 'queen.png'
                            image.ariaLabel = team;
                            chesspiece.children.item(0).appendChild(image);
                        }
                        
                        focusenter.appendChild(chesspiece);
                        pawn.ClearMoves();
                        return;
                    }
                    else{
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


