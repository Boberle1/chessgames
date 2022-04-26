
import {io} from 'socket.io-client';
const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const socket = io(deploy);
let board = document.getElementById('cb');
let Square = document.getElementById("11");
let home = document.getElementById("11");
let movesbutton = document.getElementById('moves');
let availablemoves = true;
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
let blackoffboard = [];
let whiteoffboard = [];
let rightsideboard = [];
let leftsideboard = [];
let blackteam = [];
let whiteteam = [];
let boardsquares = [];
let firstconnection = false;
let Opponent = "Person";
let status = document.getElementById('p');
let check = false;

console.log("We are in the right one!!!");

class map{
    constructor(s, p)
    {
        this.spot = s;
        this.piece = p;
    }
    spot = '';
    piece = ''
}

//used to map pieces where they start on board...
let piecehome = [];

//used to see if the pieces are in thier starting positions or have moves been made...
let freshboard = true;

function Fillboardsquaresarray()
{
    let buttonh = (window.innerHeight * .03);
    let buttonindex = buttonh.toString().indexOf('.');
    if(buttonindex == -1) buttonindex = buttonh.toString().length
    movesbutton.style.height = buttonh.toString().substr(0, buttonindex) + 'px';
    let buttonw = (window.innerWidth * .05);
    buttonindex = buttonw.toString().indexOf('.');
    if(buttonindex == -1) buttonindex = buttonw.toString().length
    movesbutton.style.width = buttonw.toString().substr(0, buttonindex) + 'px';
    let h = (.75 * window.innerHeight);
    h /= 8;
    let index = h.toString().indexOf('.');
    if(index === -1) index = h.toString().length;
    h = parseInt(h.toString().substr(0, index));
    let total = h * 8 + 16;
    board.style.height = total.toString() + 'px';
    total = h * 4 + total + 8;
    board.style.width = total.toString() + 'px';
    let item2 = item;
    let itemend = 8;

    leftsideboard.push(document.getElementById('01'));
    leftsideboard.push(document.getElementById('00'));
    rightsideboard.push(document.getElementById('19'));
    rightsideboard.push(document.getElementById('20'));
    leftsideboard.push(document.getElementById('020'));
    leftsideboard.push(document.getElementById('02'));
    rightsideboard.push(document.getElementById('29'));
    rightsideboard.push(document.getElementById('30'));
    leftsideboard.push(document.getElementById('030'));
    leftsideboard.push(document.getElementById('03'));
    rightsideboard.push(document.getElementById('39'));
    rightsideboard.push(document.getElementById('40'));
    leftsideboard.push(document.getElementById('040'));
    leftsideboard.push(document.getElementById('04'));
    rightsideboard.push(document.getElementById('49'));
    rightsideboard.push(document.getElementById('50'));
    leftsideboard.push(document.getElementById('050'));
    leftsideboard.push(document.getElementById('05'));
    rightsideboard.push(document.getElementById('59'));
    rightsideboard.push(document.getElementById('60'));
    leftsideboard.push(document.getElementById('060'));
    leftsideboard.push(document.getElementById('06'));
    rightsideboard.push(document.getElementById('69'));
    rightsideboard.push(document.getElementById('70'));
    leftsideboard.push(document.getElementById('070'));
    leftsideboard.push(document.getElementById('07'));
    rightsideboard.push(document.getElementById('79'));
    rightsideboard.push(document.getElementById('80'));
    leftsideboard.push(document.getElementById('080'));
    leftsideboard.push(document.getElementById('08'));
    rightsideboard.push(document.getElementById('89'));
    rightsideboard.push(document.getElementById('90'));

    let sidesquare_dememsions = h + 2;
    for(let i = 0; i < rightsideboard.length; ++i)
    {
        rightsideboard[i].style.height = sidesquare_dememsions.toString() +'px';
        rightsideboard[i].style.width = sidesquare_dememsions.toString() +'px';
        leftsideboard[i].style.height = sidesquare_dememsions.toString() +'px';
        leftsideboard[i].style.width = sidesquare_dememsions.toString() +'px';
    }

    while(true)
    {
        let elem = document.getElementById(item.toString() + item2.toString());
        if(elem)
        {
            boardsquares.push(elem);
            elem.style.height = h.toString() + 'px';
            elem.style.width = h.toString() + 'px';
        }
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
}
Fillboardsquaresarray();

class playerinfo
{
    constructor(pn, r, t, s)
    {
        this.PlayerName = pn;
        this.room = r;
        this.team = t;
        this.socketid = s;
    }

    PlayerName = '';
    room = '';
    team = '';
    socketid = '';
}

let Player = new playerinfo(prompt("Please enter your name.", ''), prompt("Please enter the room you would like to join.", ''), '', '');

//after player makes move lock is set to true to wait until the other player has moved...
let lock = false;

// class to check for king and rooks first moves to see if a player can castle...
class FirstMoves{
    rook1 = false;
    rook2 = false;
    king = false;
}

let Darkteam = new FirstMoves();
let Lightteam = new FirstMoves();

function HandleFirstMove(elem)
{
    if(elem.id == 'dt')
    {
        if(elem.children.item(0).id == 'dr1')
        {
            Darkteam.rook1 = true;
            return;
        }
        if(elem.children.item(0).id == 'dr2')
        {
            Darkteam.rook2 = true;
            return;
        }
        if(elem.children.item(0).id == 'dk')
        {
            Darkteam.king = true;
            return;
        }
    }
    else if(elem.id == 'lt')
    {
        if(elem.children.item(0).id == 'lr1')
        {
            Lightteam.rook1 = true;
            return;
        }
        if(elem.children.item(0).id == 'lr2')
        {
            Lightteam.rook2 = true;
            return;
        }
        if(elem.children.item(0).id == 'lk')
        {
            Lightteam.king = true;
            return;
        }
    }
}

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
    else{
        stringname = '';
    }

    let child = elem.children.item(0).children.item(0).children.item(0);
    let path = child.src;
    let start = path.indexOf('light')
    if(start === -1)
    start = path.indexOf('dark');
    path = 'Chess_Pieces/' + stringname + path.substr(start, path.length);
    elem.children.item(0).children.item(0).removeChild(child);
    let image = document.createElement('img');
    image.src = path
 //   console.log("path: " + path);
    image.ariaLabel = child.ariaLabel;
    elem.children.item(0).children.item(0).appendChild(image);
}

window.addEventListener('resize', (e) => {
    console.log("Entered window addevent listener :::::::::::::::::::::::::::::::::::::::");
    
    let buttonh = (window.innerHeight * .03);
    let buttonindex = buttonh.toString().indexOf('.');
    if(buttonindex == -1) buttonindex = buttonh.toString().length
    movesbutton.style.height = buttonh.toString().substr(0, buttonindex) + 'px';
    let buttonw = (window.innerWidth * .05);
    buttonindex = buttonw.toString().indexOf('.');
    if(buttonindex == -1) buttonindex = buttonw.toString().length
    movesbutton.style.width = buttonw.toString().substr(0, buttonindex) + 'px';

    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    console.log("h: " + h);
    let w = h;
    let total = h * 12;
    h -= 2;
    console.log("total: " + total);
    board.style.width = total.toString() + 'px';
    total = (h + 2) * 8;
    board.style.height = total.toString() + 'px';
    for(let i = 0; i < boardsquares.length; ++i){
        boardsquares[i].style.height = h.toString() + 'px';
        boardsquares[i].style.width = h.toString() + 'px';
//        console.log("boardsquares[i].height" + boardsquares[i].offsetHeight);
        if(boardsquares[i].children.length)
        {
            switchpiece(boardsquares[i], h - 2);
        }
    };

    let sidesquare_dememsions = h + 2;
    for(let i = 0; i < rightsideboard.length; ++i)
    {
        rightsideboard[i].style.height = sidesquare_dememsions.toString() + 'px';
        rightsideboard[i].style.width = sidesquare_dememsions.toString() + 'px';
        leftsideboard[i].style.height = sidesquare_dememsions.toString() + 'px';
        leftsideboard[i].style.width = sidesquare_dememsions.toString() + 'px';
        
        if(rightsideboard[i].children.length)
        {
            switchpiece(rightsideboard[i], h - 2);
        }
        if(leftsideboard[i].children.length)
        {
            switchpiece(leftsideboard[i], h - 2);
        }
    }
    console.log("Exited window addevent listener :::::::::::::::::::::::::::::::::::::::");
});

function GetApposingTeamMoves(team)
{
    if(team === 'light')
    return blackmoves;

    return whitemoves;
}

function setaside(array, piece)
{
    for(let i = 0; i < array.length; ++i)
    {
        console.log(array[i].children.length);
        if(!array[i].children.length)
        {
            array[i].appendChild(piece);
            return;
        }
    }
    console.log("array");
    console.log(array);
    console.log("setaside function with paramater array is full!>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
}

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
                whiteoffboard.push(elem)
                elem.parentElement.removeChild(elem);
                if(blackbottom) setaside(rightsideboard, elem);
                else setaside(leftsideboard, elem);
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
                blackoffboard.push(elem);
                elem.parentElement.removeChild(elem);
                if(blackbottom) setaside(leftsideboard, elem);
                else setaside(rightsideboard, elem);
                console.log(blackonboard);
                return;
            }
        }
        console.log(blackonboard);
    }
}

let top = '21';
let bottom = '71';
let blackbottom = false;

let toppawn = document.getElementById(top);
let bottompawn = document.getElementById(bottom);

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

let Toppawn = new PawnStart('unknown', 'unknown', 'unknown');
let Bottompawn = new PawnStart('unknown', 'unknown', 'unknown');

function GetPieceNameAndID(id)
{
    let item = parseInt(id)
    switch(item)
    {
        case 11: piecehome.push(new map('11', '')); return { piecname: 'rook', pieceid: 'r1' };
        case 12: piecehome.push(new map('12', '')); return { piecname: 'knight', pieceid: 'k1' };
        case 13: piecehome.push(new map('12', '')); return { piecname: 'bishop', pieceid: 'b1' };
        case 14: piecehome.push(new map('12', '')); return { piecname: 'king', pieceid: 'k' };
        case 15: piecehome.push(new map('12', '')); return { piecname: 'queen', pieceid: 'q' };
        case 16: piecehome.push(new map('12', '')); return { piecname: 'bishop', pieceid: 'b2' };
        case 17: piecehome.push(new map('12', '')); return { piecname: 'knight', pieceid: 'k2' };
        case 18: piecehome.push(new map('12', '')); return { piecname: 'rook', pieceid: 'r2' };
        case 21: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p1' };
        case 22: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p2' };
        case 23: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p3' };
        case 24: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p4' };
        case 25: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p5' };
        case 26: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p6' };
        case 27: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p7' };
        case 28: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p8' };
        case 81: piecehome.push(new map('12', '')); return { piecname: 'rook', pieceid: 'r1' };
        case 82: piecehome.push(new map('12', '')); return { piecname: 'knight', pieceid: 'k1' };
        case 83: piecehome.push(new map('12', '')); return { piecname: 'bishop', pieceid: 'b1' };
        case 84: piecehome.push(new map('12', '')); return { piecname: 'queen', pieceid: 'q' };
        case 85: piecehome.push(new map('12', '')); return { piecname: 'king', pieceid: 'k' };
        case 86: piecehome.push(new map('12', '')); return { piecname: 'bishop', pieceid: 'b2' };
        case 87: piecehome.push(new map('12', '')); return { piecname: 'knight', pieceid: 'k2' };
        case 88: piecehome.push(new map('12', '')); return { piecname: 'rook', pieceid: 'r2' };
        case 71: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p1' };
        case 72: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p2' };
        case 73: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p3' };
        case 74: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p4' };
        case 75: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p5' };
        case 76: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p6' };
        case 77: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p7' };
        case 78: piecehome.push(new map('12', '')); return { piecname: 'pawn', pieceid: 'p8' };
        default:{
            console.log("id was not found in GetPieceNameAndID!!!!!!!!!!!!!! id is: " + id);
            return { piecname: '', pieceid: '' };
        }
    }
}

function GetPiecesizename(h)
{
    if(h < 62)
    {
        return'sms'
    }
    else if(h < 85)
    {
        return 'smr';
    }
    else if(h < 152)
    {
        return 'sm';
    }
    return '';
}

function GetNewPiece(id, h, team)
{
    let parentid = team == 'dark' ? 'dt' : 'lt';
    let prefix = parentid.substr(0, 1);
    let name = GetPieceNameAndID(id);
    let parentdiv = document.createElement('div');
    let childdiv = document.createElement('div');
    let grandchilddiv = document.createElement('img');
    parentdiv.classList.add(team + '-team');
    parentdiv.id = parentid;
    childdiv.classList.add(team + name.piecname);
    childdiv.id = prefix + name.pieceid;
    piecehome[piecehome.length - 1].piece = childdiv.id;
    childdiv.ariaLabel = team;
    grandchilddiv.src = 'Chess_Pieces/' + GetPiecesizename(h - 2) + team + name.piecname + '.png';
    console.log(grandchilddiv.src);
    grandchilddiv.ariaLabel = team;
    childdiv.appendChild(grandchilddiv);
    parentdiv.appendChild(childdiv);
    return parentdiv;
}

function SetboardTop(team)
{
    if(!boardsquares.length)
    {
        console.log("boardsquares array is empty in Setboard!!!!!");
        return;
    }

    let h = parseInt(boardsquares[boardsquares.length-1].style.height);
    for(let i = 0; i < 16 && i < boardsquares.length; ++i)
    {
        boardsquares[i].appendChild(GetNewPiece(boardsquares[i].id, h, team));
    }
}

function SetboardBottom(team)
{
    if(!boardsquares.length)
    {
        console.log("boardsquares array is empty in Setboard!!!!!");
        return;
    }

    let h = parseInt(boardsquares[boardsquares.length-1].style.height);
    for(let i = boardsquares.length - 1; i > 47 && i > -1; --i)
    {
        boardsquares[i].appendChild(GetNewPiece(boardsquares[i].id, h, team));
    }
}

function Mirrorboard()
{
    console.log("Youve entered Mirrorboard!)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))");
    let end = boardsquares.length;
    for(let i = 0; i < boardsquares.length / 2; ++i)
    {
        --end;
        let temp = boardsquares[i].id;
        boardsquares[i].id = boardsquares[end].id;
        boardsquares[end].id = temp; 
  //      console.log("swap " + boardsquares[i].id + " with " + boardsquares[end].id)
    }

    /*
    for(let i = 0; i < rightsideboard.length; ++i)
    {
        let temp = leftsideboard[i];
        if(i == 0)
        {
            temp = leftsideboard[i];
            leftsideboard[i] = leftsideboard[i + 1];
            leftsideboard[i + 1] = leftsideboard[i];
            continue;
        }
        if(i == 1)
        {
            leftsideboard[i] = rightsideboard[end + 1];
            continue;
        }
        if(i % 2 == 0) leftsideboard[i] = rightsideboard[end - 1];
        else leftsideboard[i] = rightsideboard[end + 1];
        leftsideboard[i].id = rightsideboard[end].id
        rightsideboard[end].id = temp;
    }
    */
}

function IsMoved(elem)
{
    for(let i = 0; i < piecehome.length; ++i)
    {
        if(piecehome[i].piece == elem.children.item(0).id && piecehome[i].spot != elem.parentElement.id)
        return true;
    }

    return false;
}

function Clearboard()
{
    for(let i = 0; i < boardsquares.length; ++i)
    {
        if(boardsquares[i].children.length)
        {
            boardsquares[i].removeChild(boardsquares[i].children.item(0));
        }
    }
}

socket.on('connect', () =>{
    socket.emit('join', (Player));
    if(socket.connected)
    {
        document.getElementById('title').innerText = 'Joined Room: ' + Player.room;
        alert("You connected to room " + Player.room);
    }
});

socket.on('error', (message) => {
    alert(Player.PlayerName + "has a problem with connecting! " + message);
    return;
});

socket.on('leaveroom', (message) => {
    alert(message);
    return;
});

socket.on('enterroom', (Obj) => {
    Opponent = Obj.Name;
    alert(Obj.Name);
    return;
});

socket.on('roomfull', (message) => {
    alert(message);
    socket.disconnect();
    return;
});

if(socket.connected)
{
    document.getElementById('title').innerText = 'Joined Room: ' + Player.room;
    alert("You connected to room " + Player.room);
}

class Moves{
    moves = [];
    lu = [];
    ru = [];
    ld = [];
    rd = [];
    vu = [];
    hr = [];
    vd = [];
    hl = [];
    king = false;
    queen = false;
    bishop = false;
    knight = false;
    rook = false;
    pawn = false;
    IsValidMove(id)
    {
        for(let i = 0; i < this.moves.length; ++i)
        {
            console.log('id: ' + id);
            console.log(this.moves);
            if(this.moves[i] == id)
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

    SetKing(k)
    {
        this.king = k;
    }

    SetPiece(num)
    {
        switch(num)
        {
            case 1: this.king = true; return;
            case 2: this.queen = true; return;
            case 3: this.bishop = true; return;
            case 4: this.knight = true; return;
            case 5: this.rook = true; return;
            case 6: this.pawn = true; return;
        }
        console.log("The number passed as paramater in Moves.SetPiece did not match! Paramater is: " + num);
    }

    IsKing()
    {
        return this.king;
    }

    IsKnight()
    {
        return knight;
    }

    IsPawn()
    {
        return pawn;
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
        for(let iteration = 1; iteration < 5; ++iteration)
        {
            this.onemove = false;
            this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    DiaMoves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.Check(row, col, iteration))
        {
            return;
        }
        let next =  document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in DaMoves!");
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
                console.log("KingMove is true");
                let opposition = GetApposingTeamMoves(team);
                for(let i = 0; i < opposition.length; ++i)
                {
                    if(opposition[i] == next.id)
                    {
                        return;
                    }
                }
            }
            if(moves_available)
            {
                console.log("Entered if(moves_available)");
                next.classList.add('moves');
            }

            this.moves.push(next.id);
            if(theoretical && (next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk'))
            {
                if(!kingmove)
                {
                    this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            return
        }
        if(kingmove)
        {
            let opposition = GetApposingTeamMoves(team);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] == next.id)
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
            this.Moves(this.incrementrow(row, iteration), this.incrementcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
        if(kingmove && !theoretical)
        {
            this.CastleMove(row, col, team);
        }
        return;
    }

    CastleMove(row, col, team)
    {
        let decrease = 2;
        let increase = 1;
        if(team == 'dark' || team == 'black')
        {
            if(Darkteam.king) return;
            if(!Darkteam.rook1) this.CastleCheck(row, this.incrementcol(col, decrease), decrease);
            if(!Darkteam.rook2) this.CastleCheck(row, this.incrementcol(col, increase), increase);
            return;
        }
        if(team == 'white' || team == 'light')
        {
            if(Lightteam.king) return;
            if(!Lightteam.rook1) this.CastleCheck(row, this.incrementcol(col, decrease), decrease);
            if(!Lightteam.rook2) this.CastleCheck(row, this.incrementcol(col, increase), increase);
            return;
        }
    }

    CastleCheck(row, col, iter)
    {
        if(this.check(row, col)) return;
        let next =  document.getElementById(row.toString() + col.toString());
        console.log('row, col');
        console.log(row + col);
        if(col.toString() === '8' || col.toString() === '1')
        {
            next.classList.add('moves');
            this.moves.push(next.id);
            return;
        }
        if(next.children.length) return;
        this.CastleCheck(row, this.incrementcol(col, iter), iter)
    }
/*
    SomeMoves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        let findpiece = false;
        if(!this.check(row, col, iteration))
        {
            return;
        }

        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            console.log("Next is null in diagnalRU!");
            return;
        }

        if(next.children.length)
        {
            findpiece = true;
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

        if(!findpiece && !kingmove)
        this.Moves(this.incrementrow(row, iteration), this.incrementcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
    }
*/
    Moves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.check(row, col, iteration))
        {
            return;
        }
        let next = document.getElementById(row.toString() + col.toString());
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
                console.log("You hit the return because ths.onemove is used and necessary^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
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
                    this.Moves(this.incrementrow(row, iteration), this.incrementcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
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
            this.Moves(this.incrementrow(row, iteration), this.incrementcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
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

    incrementcol(col, iter)
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

        console.log("toppawn.team is: " + Toppawn.team + ' team is: ' + team);
        if(Toppawn.team === team)
        {
            if(parseInt(Toppawn.row) > 2)
            {
                this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
                this.MoveDiag(row, col + 1, team, moves_available, theoretical);
                return
            }
            this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
            this.MoveDiag(row, col + 1, team, moves_available, theoretical);
            return
        }
        if(parseInt(Bottompawn.row) < 7)
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
            if(parseInt(Toppawn.row) > 2)
            {
                this.FirstMoveUp(row, col, team, moves_available);

                row = originrow;
                col = origincol;
                this.MoveDiag(--row, col - 1, team, moves_available);
                this.MoveDiag(row, col + 1, team, moves_available);
                return;
            }
            this.FirstMoveDown(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(++row, col - 1, team, moves_available);
            this.MoveDiag(row, col + 1, team, moves_available);

             return;
        }
        if(Bottompawn.row === row.toString() && Bottompawn.team === team)
        {
            if(parseInt(Bottompawn.row) < 7)
            {
                this.FirstMoveDown(row, col, team, moves_available);

                row = originrow;
                col = origincol;
                this.MoveDiag(++row, col - 1, team, moves_available);
                this.MoveDiag(row, col + 1, team, moves_available);
                return;
            }

            this.FirstMoveUp(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(--row, col - 1, team, moves_available);
            this.MoveDiag(row, col + 1, team, moves_available);

            return;
        }

        if(Bottompawn.team === team)
        {
            if(parseInt(Bottompawn.row) < 7)
            {
                this.FindMoveDown(row, col, team, moves_available);
                return;
            }
            this.FindMoveUp(row, col, team, moves_available);
            return;
        }

        if(parseInt(Toppawn.row) > 2)
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

            if(theoretical)
            {
                if(moves_available)
                {
                    diag.classList.add('moves');
                }
                this.moves.push(diag.id);
                return;
            }

            if(diag.children.length)
            {
                /*
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
                */
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
            /*
            if(theoretical)
            {
                if(moves_available)
                {
                    diag.classList.add('moves');
                }
                this.moves.push(diag.id);
            }
            */
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
        this.ClearMoves();
        this.getDiamoves(spot, team, true, moves_available, theoretical);
        this.getHormoves(spot, team, true, moves_available, theoretical);
    }
    clear()
    {
        this.ClearMoves();
    }
}

class Queen extends HorizontalMove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getDiamoves(spot, team, false, moves_available, theoretical);
        this.getHormoves(spot, team, false, moves_available, theoretical);
    }
}

class Rook extends HorizontalMove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getHormoves(spot, team, false, moves_available, theoretical);
    }
}

class Bishop extends diagnalmove{
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getDiamoves(spot, team, false, moves_available, theoretical);
    }
}

let king = new King();
king.SetKing(true);
let queen = new Queen();
queen.SetPiece(2);
let rook = new Rook();
rook.SetPiece(5);
let bishop = new Bishop();
bishop.SetPiece(3);
let knight = new Knight();
knight.SetPiece(4);
let pawn = new Pawn();
pawn.SetPiece(6);

function GetPiece(id)
{
    if(id == 'darkking' || id == 'lightking')
        return king;
    if(id == 'darkqueen' || id == 'lightqueen')
        return queen;
    if(id == 'darkrook' || id == 'lightrook')
        return rook;
    if(id == 'darkbishop' || id == 'lightbishop')
        return bishop;
    if(id == 'darkknight' || id == 'lightknight')
        return knight;
    if(id == 'darkpawn' || id == 'lightpawn')
        return pawn;

    console.log('id did not match anything in GetPiece! id is: ' + id);
    return null;
}
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
    console.log('team: [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ ' + team);
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

function SetListeners(elem)
{
    let child = elem.firstElementChild;
    if(child !== null)
    {
        child.addEventListener('dragstart', (e) => {
            if(lock)
            {
                return;
            }
            chesspiecehome = child.parentElement;
            chesspiece = child;
            if(child.children.item(0).id === 'lk' || child.children.item(0).id === 'dk')
            {
                GetApposingMoves(child.children.item(0).ariaLabel);
                king.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).id === 'lq' || child.children.item(0).id === 'dq')
            {
                queen.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).className === 'lightrook' || child.children.item(0).className == 'darkrook')
            {
                rook.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).className === 'lightbishop' || child.children.item(0).className == 'darkbishop')
            {
                bishop.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).className === 'lightknight' || child.children.item(0).className == 'darkknight')
            {
                knight.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).className === 'lightpawn' || child.children.item(0).className == 'darkpawn')
            {
                pawn.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
        });
    }
        
    elem.addEventListener("dragend", function(e)
    {
        if(lock)
        {
            return;
        }
        if(focusenter === null)
        {
            console.log('focusenter is equal to null!!!!');
            return;
        }
        if(focusenter.className  === 'black moves' || focusenter.className === 'white moves' || focusenter.className === 'white' || focusenter.className === 'black' 
        || focusenter.className === 'black drag-over' || focusenter.className === 'white drag-over')
        {
            if(focusenter.id === chesspiecehome.id)
            {
                let cp = GetPiece(chesspiece.children.item(0).className);
                if(!cp)
                {
                    console.log('cp is null in dragend!');
                    return;
                }
                cp.ClearMoves();
                return;
            }
            if(!chesspiecehome.children.item(0))
            {
                console.log('chesspiecehome does not have a chess piece in dragend!!!');
                return;
            }
            let cp = GetPiece(chesspiece.children.item(0).className);
            if(!cp)
            {
                console.log('cp in dragend in null!!!!');
                return;
            }
            if(cp.IsValidMove(focusenter.id))
            {
                if(cp.IsKing())
                {
                    //check for castle move...
                    if(focusenter.children.length)
                    {
                        let rk = focusenter.children.item(0);
                        focusenter.removeChild(rk);
                        chesspiecehome.removeChild(chesspiece);
                        focusenter.appendChild(chesspiece);
                        chesspiecehome.appendChild(rk);
                        HandleFirstMove(chesspiece);
                        cp.ClearMoves();
                        lock = true;
                        document.getElementById('status').innerHTML = Opponent + "'s Move";
                        socket.emit('castle move', {P: Player, king: chesspiece.children.item(0).id, rook: rk.children.item(0).id, rookhome: chesspiecehome.id, kinghome: focusenter.id});
                        return;
                    }
                }
                if(focusenter.children.length)
                {
                    socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                    RemoveFromBoard(focusenter.children.item(0));
                 //   focusenter.removeChild(focusenter.children.item(0));
                }

                chesspiecehome.removeChild(chesspiece);
                        
                if((focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1') && (chesspiece.children.item(0).className == 'lightpawn' ||
                chesspiece.children.item(0).className == 'darkpawn'))
                {
                    let team = chesspiece.children.item(0).ariaLabel
                    chesspiece.children.item(0).children.item(0).src;
                    chesspiece.children.item(0).removeChild(chesspiece.children.item(0).children.item(0));
                    chesspiece.children.item(0).classList.replace(team + 'pawn', team + 'queen');
                    chesspiece.children.item(0).id = 'lq';
                    let image = document.createElement('img');
                    image.src = 'Chess_Pieces/sm' + team + 'queen.png';
                    image.ariaLabel = team;
                    chesspiece.children.item(0).appendChild(image);
                }   
                focusenter.appendChild(chesspiece);
                cp.ClearMoves();
                lock = true;
                let piecename = chesspiece.children.item(0).className.toString();
                status.innerHTML = Opponent + "'s Move";
                piecename = chesspiece.children.item(0).ariaLabel == 'light' ? piecename.toString().substr(5) : piecename.toString().substr(4);
                socket.emit('move finished', {P: Player, id: chesspiece.children.item(0).id, Name: piecename, spot: focusenter.id});
                freshboard = false;
                HandleFirstMove(chesspiece);
                return;
            }
            else{
                cp.ClearMoves();
                socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                alert("Invalid move!");
                return;
            }
        }
    });
        
    elem.addEventListener("mouseleave", SetSquareLeave, true);

    elem.addEventListener("dragenter", function(e)
    {
        if(lock)
        {
            return;
        }
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
        if(!lock) e.preventDefault();
    });
}

function init()
{
    movesbutton.addEventListener('click', (e) => {
    
        if(availablemoves)
        { 
            availablemoves = false;
            return;
        }
        availablemoves = true;
    });
    
    for(let i = 0; i < boardsquares.length; ++i) SetListeners(boardsquares[i]);
    if(Player.team == 'black' || Player.team == 'dark')
    {
        blackbottom = true;
    }

    toppawn = document.getElementById(top);
    bottompawn = document.getElementById(bottom);
    
    Toppawn = new PawnStart(top.substr(0, 1), 'top', toppawn.children.item(0).children.item(0).ariaLabel);
    Bottompawn = new PawnStart(bottom.substr(0, 1), 'bottom', bottompawn.children.item(0).children.item(0).ariaLabel);
    
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
    console.log("Piecehome obj");
    console.log(piecehome);
}

function SetSquareLeave()
{
    focusleave = this;
    focusleave.classList.remove('drag-over');
}

function GetMirror(first, second)
{
    switch(first)
    {
        case '8': first = '1'; break;
        case '7': first = '2'; break;
        case '6': first = '3'; break;
        case '5': first = '4'; break;
        case '4': first = '5'; break;
        case '3': first = '6'; break;
        case '2': first = '7'; break;
        case '1': first = '8'; break;
        default: return 'Unknown spot';
    }

    switch(second)
    {
        case '8': second = '1'; break;
        case '7': second = '2'; break;
        case '6': second = '3'; break;
        case '5': second = '4'; break;
        case '4': second = '5'; break;
        case '3': second = '6'; break;
        case '2': second = '7'; break;
        case '1': second = '8'; break;
        default: return 'Unknown spot';
    }

    return first.toString() + second.toString();
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
  //  parent.removeChild(cpparent);
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
});


socket.on('checkforcheck', (obj) => {
    lock = false;
    let cp = null;
    let piecemoves = [];
    let team = !blackbottom ? 'lt' : '';
    console.log('bottompawn.children.item(0).id: ' + team);
    if(team == 'lt')
    {
        cp = document.getElementById('lk');
        GetApposingMoves('light');
        piecemoves = blackmoves;
    }
    else{
        cp = document.getElementById('dk');
        GetApposingMoves('dark');
        piecemoves = whitemoves;
    }

    console.log('piecemoves.length>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(piecemoves);
    for(let i = 0; i < piecemoves.length; ++i)
    {
        if(piecemoves[i] == cp.parentElement.parentElement.id)
        {
            check = true;
            let LandingSpot = blackbottom ? GetMirror(obj.spot.toString().substr(0,1), obj.spot.toString().substr(1,2)) : document.getElementById(obj.id).parentElement.parentElement.id;
            document.getElementById('status').innerHTML = obj.P.PlayerName  + " Put You in Check with thier " + obj.Name + ", Your Move";
            alert(obj.P.PlayerName + " put you in check!");
            return;
        }
    } 

    check = false;
    let LandingSpot = blackbottom ? GetMirror(obj.spot.toString().substr(0,1), obj.spot.toString().substr(1,2)) : document.getElementById(obj.id).parentElement.parentElement.id;
    status.innerHTML = obj.P.PlayerName + " moved their " + obj.Name + " to " + LandingSpot + ", Your Move";
    Opponent = obj.P.PlayerName;
  //  alert(obj.P.PlayerName + " moved their " + obj.Name + " to " + LandingSpot);
});

socket.on('send castle move', (obj) => {
    console.log('send castle move');
    console.log(obj);
    let rk = document.getElementById(obj.rook).parentElement;
    let rh = document.getElementById(obj.rookhome);
    rk.parentElement.removeChild(rk);
    rh.appendChild(rk);
    lock = false;
});

socket.on('team-assigned', (team) => {
    if(firstconnection)
    {
        return;
    }
    Player = new playerinfo(Player.PlayerName, Player.room, team, socket.id);
    alert('You are team ' + team);
    if(team == 'black')
    {
        firstconnection = true;
        Mirrorboard();
        SetboardTop('light');
        SetboardBottom('dark');
        init();
        return;
    }

    firstconnection = true;
    SetboardTop('dark');
    SetboardBottom('light');
    init();
});

socket.on('check_state_of_board', (message) => {
    console.log('entered check_state_of_board on clientside');
    console.log(freshboard);
    socket.emit('state_is', (freshboard));
});

socket.on('get_board_data', (message) => {
    console.log('entered get_board_data on clientside');
    let obj = {wob: [], bob: [], w: [], b: []};
    for(let i = 0; i < whiteonboard.length; ++i)
    {
        if(IsMoved(whiteonboard[i])) obj.wob.push(new map(whiteonboard[i].parentElement.id, whiteonboard[i].children.item(0).id));
    }
    for(let i = 0; i < blackonboard.length; ++i)
    {
        if(IsMoved(blackonboard[i])) obj.bob.push(new map(blackonboard[i].parentElement.id, blackonboard[i].children.item(0).id));
    }
    for(let i = 0; i < whiteteam.length; ++i)
    {
        obj.w.push(whiteteam[i].children.item(0).id);
    }
    for(let i = 0; i < blackteam.length; ++i)
    {
        obj.b.push(blackteam[i].children.item(0).id);
    }
    socket.emit('board_data', (obj));
});

socket.on('update-board', (boarddata) => {
    console.log('entered updata_board clientside');
    for(let i = 0; i < boarddata.wob.length; ++i)
    {
        let cp = document.getElementById(boarddata.wob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.wob[i].spot == pastparent.id) continue;
        pastparent.removeChild(cp);
        let cpparent = document.getElementById(boarddata.wob[i].spot);
        cpparent.appendChild(cp);
    }
    for(let i = 0; i < boarddata.bob.length; ++i)
    {
        let cp = document.getElementById(boarddata.bob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.bob[i].spot == pastparent.id) continue;
        pastparent.removeChild(cp);
        let cpparent = document.getElementById(boarddata.bob[i].spot);
        cpparent.appendChild(cp);
    }
    for(let i = 0; i < boarddata.w.length; ++i)
    {
        let cp = document.getElementById(boarddata.w[i].piece).parentElement;
        RemoveFromBoard(cp);
    }
    for(let i = 0; i < boarddata.b.length; ++i)
    {
        let cp = document.getElementById(boarddata.b[i].piece).parentElement;
        RemoveFromBoard(cp);
    }
});



