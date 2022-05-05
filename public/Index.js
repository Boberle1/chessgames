
import {io} from 'socket.io-client';
const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const socket = io(local);
let board = document.getElementById('cb');
let Square = document.getElementById("11");
let home = document.getElementById("11");
let movesbutton = document.getElementById('moves');
let checkalert = document.getElementById('ny');
let innercheckalert = document.getElementById('cm');
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
let numofcheckmoves = 0;

//index in off theoretical move horizontal array in Moves.directions array...
let theomovehor = 8;
//index in off theoretical move diagnal array in Moves.directions array...
let theomovedia = 9;
let FirstEight = 3;

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
  //  let buttonh = (window.innerHeight * .03);
  //  let buttonindex = buttonh.toString().indexOf('.');
  //  if(buttonindex == -1) buttonindex = buttonh.toString().length
  //  movesbutton.style.height = buttonh.toString().substr(0, buttonindex) + 'px';
  //  let buttonw = (window.innerWidth * .05);
  //  buttonindex = buttonw.toString().indexOf('.');
 //   if(buttonindex == -1) buttonindex = buttonw.toString().length
  //  movesbutton.style.width = buttonw.toString().substr(0, buttonindex) + 'px';
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

class MyAvailableMoves
{
    piece = null;
    moves = [];
    MyAvailabalMoves(elem, moves)
    {
        this.piece = elem;
        this.moves = moves;
    }
}

let MyMoves = [];

class MyAvailableCheckMoves 
{
    piece = null;
    move = [];
    
    AddMove(elem, spot)
    {
        console.log("Adding piece: " + elem + " to spot: " + spot + " in AddMove()");
        this.piece = elem;
        this.move.push(spot);
    }

    ClearMoves()
    {
        this.move = [];
    }

    IsValidInCheckMove(spot)
    {
        console.log("MyAvailableCheckMoves::IsValidMove();;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
        for(let i = 0; i < this.move.length; ++i)
        {
            console.log(this.move[i] + " == " + spot);
            if(this.move[i] == spot) return true;
        }
        return false;
    }

    LightMoves()
    {
        for(let i = 0; i < this.move.length; ++i)
        {
            document.getElementById(this.move[i]).classList.add('moves');
        }
    }

    MovesOffandClear()
    {
        this.MovesOff();
        this.ClearMoves();
    }

    MovesOff()
    {
        for(let i = 0; i < this.move.length; ++i) document.getElementById(this.move[i]).classList.remove('moves');
    }
    
    IsMyPiece(id)
    {
        if(id == this.piece) return true;

        return false;
    }
}

let MyInCheckMovesArray = [];

function IsValidInCheckPiece(elem)
{
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        console.log("IsValidInCheckPiec(elem)LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        console.log(MyInCheckMovesArray[i].piece + " == " + elem.children.item(0).id)
        if(MyInCheckMovesArray[i].piece == elem.children.item(0).id)
        {
            if(availablemoves)
            {
                MyInCheckMovesArray[i].LightMoves();
            }
            return true;
        }
    }
    return false;
}

//while in check make sure this piece is a valid piece to move and the spot its moving to will
//block the opponents piece from checking the king...
function Validate_Piece_spot(spot, piece)
{
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        console.log("Validate_Piece_spot(piece)LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
        console.log(MyInCheckMovesArray[i].piece + " == " + piece);
        if(MyInCheckMovesArray[i].piece == piece)
        {
            if(MyInCheckMovesArray[i].IsValidInCheckMove(spot))
            {
                if(availablemoves) MyInCheckMovesArray[i].LightMoves();
                return true;
            }
        }
    }
}

function ClearCheckMoves()
{
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        MyInCheckMovesArray[i].MovesOffandClear();
    }
}

class OpposingMoves
{
    piece = null;
    moves = [];
    OpposingMoves(elem, moves)
    {
        this.piece = elem;
        this.moves = moves;
    }
}

let OpposingMovesArray = [];

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

// Recording the first moves of the rooks and king.. If they are moved then the player can no longer castle...
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

//Checks to see if the rooks or king were moved prior to attempting a castle move...
function ValidateCastleMove(elem)
{
    if(elem.id == 'dt')
    {
        if(elem.children.item(0).id == 'dr1') return Darkteam.rook1;
        if(elem.children.item(0).id == 'dr2') return Darkteam.rook2;
        if(elem.children.item(0).id == 'dk') return Darkteam.king;

        return false;
    }
    else if(elem.id == 'lt')
    {
        if(elem.children.item(0).id == 'lr1') return Lightteam.rook1;
        if(elem.children.item(0).id == 'lr2') return Lightteam.rook2;
        if(elem.children.item(0).id == 'lk') return Lightteam.king;
        
        return false;
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
    image.ariaLabel = child.ariaLabel;
    elem.children.item(0).children.item(0).appendChild(image);
}

window.addEventListener('resize', (e) => {
    console.log("Entered window addevent listener :::::::::::::::::::::::::::::::::::::::");

    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    let w = h;
    let total = h * 12;
    console.log("total: " + total);
    total = (h + 2) * 8;
    board.style.height = total.toString() + 'px';
    total = (h + 2) * 12;
    board.style.width = total.toString() + 'px';
    for(let i = 0; i < boardsquares.length; ++i){
        boardsquares[i].style.height = h.toString() + 'px';
        boardsquares[i].style.width = h.toString() + 'px';
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
    //RealignStatus();
    console.log("Exited window addevent listener :::::::::::::::::::::::::::::::::::::::");
});

function GetApposingTeamMoves(team)
{
    if(team === 'light')
    return blackmoves;

    return whitemoves;
}

function GetApposingTeamPieces(team)
{
    if(team === 'light' && !blackbottom) return OpponentsPieces;
    if(team === 'light' && blackbottom) return MYpieces;
    if(team === 'dark' && !blackbottom) return MYpieces;
    if(team === 'dark' && blackbottom) return OpponentsPieces;
    console.error("No match in GetApposingTeamPieces! Team is: " + team);
    return null;
}

function CheckingKingMove(team, id)
{
    let item = GetApposingTeamPieces(team);
    if(!item)
    {
        console.log("item is null in CheckingKingMove!");
        return false;
    }

    for(let l = 0; l < item.length - 1; ++l)
    {
        console.error("CheckKingMoveloop item.id: " + item[l].pieceid);
        if(!item[l].moves.CheckKingMove(id)) return false;
    }
    return true;
}

function GetTeamonBoard(team)
{
    if(team === 'light')
    return whiteonboard;

    return blackonboard;
}

function GetNewQueenID(array, team)
{
    let id = 'dq';
    if(team === 'light')
    id = 'lq';
    let count = 0;
    for(let i = 0; i < array.length; ++i)
    {
        if(array[i].children.item(0).id.substr(0, 2) == id) ++count;
    }

    if(!count) return id;
    return id + count.toString();
}

function setaside(array, piece)
{
    for(let i = 0; i < array.length; ++i)
    {
        if(!array[i].children.length)
        {
            array[i].appendChild(piece);
            return;
        }
    }
}

function RemoveItemMyInCheckArray(id)
{
    for(let i = 0; MyInCheckMovesArray.length; ++i)
    {
        if(MyInCheckMovesArray[i].IsMyPiece(id))
        {
            console.log("Removing Item from MyInCheckMovesArray!!!!!");
            MyInCheckMovesArray[i].splice(i, 1);
            return;
        }
    }
}

function RemoveFromBoard(elem, putonside = true)
{
    if(elem.id === 'lt')
    {
        whiteteam.push(elem);
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            if(whiteonboard[i].children.item(0).id == elem.children.item(0).id)
            {
                whiteonboard.splice(i, 1);
                elem.parentElement.removeChild(elem);
                whiteoffboard.push(elem);
            }
        }
        console.log(whiteonboard);
        if(blackbottom)
        {
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
                if(OpponentsPieces[i].pieceid == elem.children.item(0).id) 
                {
                    OpponentsPieces.splice(i, 1);
                    break;
                }
            }
            if(putonside) setaside(rightsideboard, elem);
            return;
        }
        else
        {
            for(let i = 0; i < MYpieces.length; ++i)
            {
                if(MYpieces[i].pieceid == elem.children.item(0).id) 
                {
                    MYpieces.splice(i, 1);
                    break;
                }
            }
            RemoveItemMyInCheckArray(elem.children.item(0).id);
            if(putonside) setaside(leftsideboard, elem);
            return;
        }
    }
    else{
        blackteam.push(elem);
        for(let i = 0; i < blackonboard.length; ++i)
        {
            if(blackonboard[i].children.item(0).id == elem.children.item(0).id)
            {
                blackonboard.splice(i, 1);
                elem.parentElement.removeChild(elem);
                blackoffboard.push(elem);
                if(putonside)
                {
                    if(blackbottom) setaside(leftsideboard, elem);
                    else setaside(rightsideboard, elem);
                }
                return;
            }
        }
        if(blackbottom)
        {
            for(let i = 0; i < MYpieces.length; ++i)
            {
                if(MYpieces[i].pieceid == elem.children.item(0).id) 
                {
                    MYpieces.splice(i, 1);
                    break;
                }
            }
            RemoveItemMyInCheckArray(elem.children.item(0).id);
            if(putonside) setaside(leftsideboard, elem);
            return;
        }
        else
        {
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
                if(OpponentsPieces[i].pieceid == elem.children.item(0).id) 
                {
                    OpponentsPieces.splice(i, 1);
                    break;
                }
            }
            if(putonside) setaside(rightsideboard, elem);
            return;
        }
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
    alert(Obj.sentence);
    return;
});

socket.on('roomfull', (message) => {
    alert(message);
    socket.disconnect();
    return;
});

if(socket.connected)
{
    let width = status.style.width.substr(0, width.length - 2);
    console.log("Width************************************************************************************");
    console.log(width)
    let padding = (window.innerWidth/2) - (parseInt(width)/2);
    status.style.paddingRight = padding;
    status.style.marginRight = padding;
    movesbutton.style.height = '20px';
    movesbutton.style.width = '30px';
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
    theorticalmoveshor = [];
    theorticalmovesdia = [];
    castlemoves = [];
    directions = [];
    king = false;
    queen = false;
    bishop = false;
    knight = false;
    rook = false;
    pawn = false;
    constructor(num)
    {
        this.SetPiece(num);
    }
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
        for(let i = 0; i < this.directions.length; ++i) this.directions[i] = [];
        
    }

    InitDirections()
    {
        this.directions.push(this.lu);
        this.directions.push(this.ru);
        this.directions.push(this.ld);
        this.directions.push(this.rd);
        this.directions.push(this.vu);
        this.directions.push(this.hr);
        this.directions.push(this.vd);
        this.directions.push(this.hl);
        this.directions.push(this.theorticalmoveshor);
        this.directions.push(this.theorticalmovesdia);
        this.directions.push(this.castlemoves);
    }

    CheckKingMove(id)
    {
        if(this.IsPawn())
        {
            console.error("In IsPawn");
            console.log(this.directions);
            for(let i = 0; i < 4; ++i)
            {
                for(let j = 1; j < this.directions[i].length; ++ i)
                {
                    console.error("diag " + this.directions[i][j] + " == " + id);
                    if(this.directions[i][j] == id) return false;
                }
            }
            for(let k = 0; k < this.directions[theomovedia].length; ++k)
            {
                console.log("k is: " + k);
                console.log("Length of array" + this.directions[theomovedia].length);
                console.error("theoretical " + this.directions[theomovedia][k] + " == " + id);
                if(this.directions[theomovedia][k] == id) return false;
            }
            return true;
        }
        for(let i = 0; i < this.directions.length - FirstEight; ++i)
        {
            for(let j = 1; j < this.directions[i].length; ++j)
            {
                if(id == this.directions[i][j]) return false;
            }
        }
        
        for(let i = 0; i < this.directions[theomovedia].length; ++i)
        {
            if(this.directions[theomovedia][i] == id) return false;
        }

        for(let i = 0; i < this.directions[theomovehor].length; ++i)
        {
            if(this.directions[theomovehor][i] == id) return false;
        }

        return true;
    }

    SetKing(k)
    {
        this.InitDirections();
        this.king = k;
    }

    SetPiece(num)
    {
        this.InitDirections();
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

    //Fill first element in the first 8 arrays the position the piece is in to start with...
    FillFirstPosition(id)
    {
        for(let i = 0; i < this.directions.length - FirstEight; ++i)
        {
            this.directions[i].push(id);
        }
    }

    AddTheoreticalMoveDia(id)
    {
        this.directions[theomovedia].push(id);
    }

    AddTheoreticalMoveHor(id)
    {
        this.directions[theomovehor].push(id);
    }

    AddCastleMove(id)
    {
        this.directions[this.directions.length - 1].push(id);
    }

    AddMovesForPawn(id, dia_hor)
    {
        //if dia_hor is true then they are diagnal moves.. otherwise they are horizontal or vertical moves...
        let i = dia_hor ? 0 : 4;
        let stop = dia_hor ? 7 : FirstEight
        for(i; i < this.directions.length - stop; ++i)
        {
            if(this.directions[i].length < 2)
            {
                this.directions[i].push(id);
                return;
            }
        }
        console.error("Pawn will be missing available moves in AddMovesForPawn in Moves obj... directions array is full...");
    }

    IsKing()
    {
        return this.king;
    }

    IsQueen()
    {
        return this.queen;
    }

    IsRook()
    {
        return this.rook;
    }

    IsKnight()
    {
        return this.knight;
    }

    IsPawn()
    {
        return this.pawn;
    }

    IsBishop()
    {
        return this.bishop
    }
}

class Dia_vh_Moves extends Moves{
    onemove = false;
    constructor(num)
    {
        super(num);
    }
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
            console.log("right before this.directions in getDaimoves::::::::::::::::::::::::::::::::::::::::");
            this.onemove = false;
            this.directions[iteration - 1].push(spot);
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
                    this.directions[this.directions.length - 2].push(next.id);
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

            this.directions[iteration - 1].push(next.id);
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
            if(!CheckingKingMove(team, next.id)) return;
            /*
            let opposition = GetApposingTeamMoves(team);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] == next.id)
                return;
            }*/
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }

        this.directions[iteration - 1].push(next.id);
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

    Get_HV_Moves(spot, team, kingmove = false, moves_available, theoretical)
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
            console.log("right before this.directions in getHormoves::::::::::::::::::::::::::::::::::::::::");
            this.onemove = false;
            this.directions[iteration + 3].push(spot);
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
        if(kingmove && !theoretical)
        {
            this.CastleMove(row, col, team, moves_available);
        }
        return;
    }

    CastleMove(row, col, team, moves_available)
    {
        let decrease = 2;
        let increase = 1;
        if(team == 'dark' || team == 'black')
        {
            if(Darkteam.king) return;
            if(!Darkteam.rook1) this.CastleCheck(row, this.incremen_th_vcol(col, decrease), decrease, moves_available, team);
            if(!Darkteam.rook2) this.CastleCheck(row, this.incremen_th_vcol(col, increase), increase, moves_available, team);
            return;
        }
        if(team == 'white' || team == 'light')
        {
            if(Lightteam.king) return;
            if(!Lightteam.rook1) this.CastleCheck(row, this.incremen_th_vcol(col, decrease), decrease, moves_available, team);
            if(!Lightteam.rook2) this.CastleCheck(row, this.incremen_th_vcol(col, increase), increase, moves_available, team);
            return;
        }
    }

    CastleCheck(row, col, iter, moves_available, team)
    {
        if(this.check_h_v(row, col)) return;
        let next =  document.getElementById(row.toString() + col.toString());
        console.log('row, col');
        console.log(row + "" + col);
        console.error("in CastleCheck");
        console.log("team: " + team);
        if(next.children.length)
        {
            console.log(next.children.item(0).children.item(0).ariaLabel);
            console.log("team + 'rook'" + team + 'rook');
            if(next.children.item(0).children.item(0).ariaLabel != team) return;
            if(next.children.item(0).children.item(0).className != team + 'rook') return;
            if(col.toString() === '8' || col.toString() === '1')
            {
                if(moves_available) next.classList.add('moves');
                this.directions[this.directions.length - 1].push(next.id);
                this.moves.push(next.id);
                return;
            }
        }
        console.log("Calling CastleCheck again:: row/col: " + row + "" + col + " team: " + team);
        this.CastleCheck(row, this.incremen_th_vcol(col, iter), iter, moves_available, team);
    }

    HV_Moves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.check_h_v(row, col, iteration))
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
                    this.directions[this.directions.length - 3].push(next.id);
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

            console.log("right before the first this.direction.push(" + next.id +")");
            this.directions[iteration + 3].push(next.id);
            this.moves.push(next.id);

            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmove)
                {
                    this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            return
        }
        if(kingmove)
        {
        
            if(!CheckingKingMove(team, next.id)) return;
            /*
            let opposition = GetApposingTeamMoves(team);
            console.log("diaglu opposition");
            console.log(opposition);
            for(let i = 0; i < opposition.length; ++i)
            {
                if(opposition[i] === next.id)
                return;
            }
            */
        }
        if(moves_available)
        {
            next.classList.add('moves');
        }

        console.log("right before the second this.direction.push(" + next.id +")");
        this.directions[iteration + 3].push(next.id);
        this.moves.push(next.id);
        if(!kingmove)
        {
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    increment_hv_row(row, iter)
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

    incremen_th_vcol(col, iter)
    {
        console.log("This is a horizontal func increment col!!!");
        switch(iter)
        {
            case 1: return col + 1;
            case 2: return col - 1;
            case 3: return col;
            case 4: return col;
            default: return col;
        }
    }
    
    check_h_v(row, col, iteration)
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

/*
class HorizontalMove extends diagnalmove{

    onemove = false;
    Get_HV_Moves(spot, team, kingmove = false, moves_available, theoretical)
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
            console.log("right before this.directions in getHormoves::::::::::::::::::::::::::::::::::::::::");
            this.onemove = false;
            this.directions[iteration + 3].push(spot);
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
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
            if(!Darkteam.rook1) this.CastleCheck(row, this.incremen_th_vcol(col, decrease), decrease);
            if(!Darkteam.rook2) this.CastleCheck(row, this.incremen_th_vcol(col, increase), increase);
            return;
        }
        if(team == 'white' || team == 'light')
        {
            if(Lightteam.king) return;
            if(!Lightteam.rook1) this.CastleCheck(row, this.incremen_th_vcol(col, decrease), decrease);
            if(!Lightteam.rook2) this.CastleCheck(row, this.incremen_th_vcol(col, increase), increase);
            return;
        }
    }

    CastleCheck(row, col, iter)
    {
        if(this.check_h_v(row, col)) return;
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
        this.CastleCheck(row, this.incremen_th_vcol(col, iter), iter)
    }

    HV_Moves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.check_h_v(row, col, iteration))
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

            console.log("right before the first this.direction.push(" + next.id +")");
            this.directions[iteration + 3].push(next.id);
            this.moves.push(next.id);

            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmove)
                {
                    this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
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

        console.log("right before the second this.direction.push(" + next.id +")");
        this.directions[iteration + 3].push(next.id);
        this.moves.push(next.id);
        if(!kingmove)
        {
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    increment_hv_row(row, iter)
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

    incremen_th_vcol(col, iter)
    {
        console.log("This is a horizontal func increment col!!!");
        switch(iter)
        {
            case 1: return col + 1;
            case 2: return col - 1;
            case 3: return col;
            case 4: return col;
            default: return col;
        }
    }
    
    check_h_v(row, col, iteration)
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
*/
class Knight extends Moves{
    checkmoves = 0
    constructor(num)
    {
        super(num);
    }
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

        for(let i = 0; i < this.directions.length - 3; ++i) this.directions[i].push(spot);
        console.log("right before knight push moves:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        this.directions[0].push(spot);
        console.log("right after knight push moves:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        this.checkmoves = 0;
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
            ++this.checkmoves;
            return;
        }

        if(col > max || col < min)
        {
            ++this.checkmoves;
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
                    this.directions[this.directions.length - 1].push(next.id);
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
        this.directions[this.checkmoves].push(next.id);
        ++this.checkmoves
    }
}

class Pawn extends Moves{
    constructor(num)
    {
        super(num);
    }
    GetDiagMoves(spot, team, moves_available, theoretical)
    {
        if(spot === null)
        {
            console.error("Error spot passed to getmoves pawn is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.error("team in getmoves pawn is not equal to light or dark! team is: " + team);
            return;
        }

        let row = parseInt(spot.toString().slice(0,1));
        let col = parseInt(spot.toString().slice(1,2));
        let originrow = row;
        let origincol = col;

        console.error("toppawn.team is: " + Toppawn.team + ' team is: ' + team);
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

    GetMoves(spot, team, moves_available, theoretical)
    {
        if(spot === null)
        {
            console.error("Error spot passed to getmoves pawn is null");
            return;
        }
        if(team !== 'light' && team !== 'dark')
        {
            console.error("team in getmoves pawn is not equal to light or dark! team is: " + team);
            return;
        }

        this.FillFirstPosition(spot);
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
                console.error("Entering first MoveDiag in if Toppawn.row > 2")
                console.error("row/col: " + row + "" + col);
                this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
                console.error("Entering second MoveDiag in if Toppawn.row > 2")
                console.error("row/col: " + row + "" + col);
                this.MoveDiag(row, col + 1, team, moves_available, theoretical);
                return;
            }
            this.FirstMoveDown(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            console.error("Entering first MoveDiag in if Toppawn.row == 2")
            console.error("row/col: " + row + "" + col);
            this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
            console.error("Entering second MoveDiag in if Toppawn.row == 2")
            console.error("row/col: " + row + "" + col);
            this.MoveDiag(row, col + 1, team, moves_available, theoretical);

             return;
        }
        if(Bottompawn.row === row.toString() && Bottompawn.team === team)
        {
            if(parseInt(Bottompawn.row) < 7)
            {
                this.FirstMoveDown(row, col, team, moves_available);

                row = originrow;
                col = origincol;
                console.error("Entering first MoveDiag in if Bottompawn.row < 7")
                console.error("row/col: " + row + "" + col);
                this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
                console.error("Entering second MoveDiag in if Bottompawn.row !< 7")
                console.error("row/col: " + row + "" + col);
                this.MoveDiag(row, col + 1, team, moves_available, theoretical);
                return;
            }

            this.FirstMoveUp(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            console.error("Entering MoveDiag not in if statment first")
            console.error("row/col: " + row + "" + col);
            this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
            console.error("Entering MoveDiag not in if statment second")
            console.error("row/col: " + row + "" + col);
            this.MoveDiag(row, col + 1, team, moves_available, theoretical);

            return;
        }

        if(Bottompawn.team === team)
        {
            if(parseInt(Bottompawn.row) < 7)
            {
                this.FindMoveDown(row, col, team, moves_available, theoretical);
                return;
            }
            this.FindMoveUp(row, col, team, moves_available, theoretical);
            return;
        }

        if(parseInt(Toppawn.row) > 2)
        {
            this.FindMoveUp(row, col, team, moves_available, theoretical);
            return;
        }

        this.FindMoveDown(row, col, team, moves_available, theoretical);
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

    FindMoveUp(row, col, team, moves_available, theoretical)
    {
        this.MoveForward(--row, col, team, moves_available);
        this.MoveDiag(row, col + 1, team, moves_available, theoretical);
        this.MoveDiag(row, col - 1, team, moves_available, theoretical);
    }

    FindMoveDown(row, col, team, moves_available, theoretical)
    {
        this.MoveForward(++row, col, team, moves_available);
        this.MoveDiag(row, col + 1, team, moves_available, theoretical);
        this.MoveDiag(row, col - 1, team, moves_available, theoretical);
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
                this.AddMovesForPawn(forward.id, false);
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
                console.error('row: ' + row + ' col: ' + col + "In theoretical");
                console.error("movesdiag moves_available: " + moves_available)
                if(moves_available)
                {
                    diag.classList.add('moves');
                }
                this.AddTheoreticalMoveDia(diag.id, true);
                this.moves.push(diag.id);
            }

            if(diag.children.length)
            {
                if(diag.children.item(0).children.item(0).ariaLabel !== team)
                {
                    console.error('row: ' + row + ' col: ' + col);
                    console.error("movesdiag moves_available: " + moves_available)
                    if(moves_available)
                    {
                        diag.classList.add('moves');
                    }
                    console.log("right before pawn push moves:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    console.log("right after knight push moves:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
                    this.AddMovesForPawn(diag.id, true);
                    this.moves.push(diag.id);
                }
                return;
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

class King extends Dia_vh_Moves{
    constructor(num)
    {
        super(num);
    }
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getDiamoves(spot, team, true, moves_available, theoretical);
        this.Get_HV_Moves(spot, team, true, moves_available, theoretical);
    }
    clear()
    {
        this.ClearMoves();
    }
}

class Queen extends Dia_vh_Moves{
    constructor(num)
    {
        super(num);
    }
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getDiamoves(spot, team, false, moves_available, theoretical);
        this.Get_HV_Moves(spot, team, false, moves_available, theoretical);
    }
}

class Rook extends Dia_vh_Moves{
    constructor(num)
    {
        super(num);
    }
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.Get_HV_Moves(spot, team, false, moves_available, theoretical);
    }
}

class Bishop extends Dia_vh_Moves{
    constructor(num)
    {
        super(num);
    }
    GetMoves(spot, team, moves_available = true, theoretical = false)
    {
        this.ClearMoves();
        this.getDiamoves(spot, team, false, moves_available, theoretical);
    }
}

class BoardPieces
{
    pieceid = "";
    moves = null;
    currentspot = "";

    constructor(p, m, c)
    {
        this.pieceid = p;
        this.moves = m;
        this.currentspot = c;
    }

    AddPiece(id, elem)
    {
        this.pieceid = id;
        this.moves = elem;
        this.currentspot;
    }
    ClearMoves()
    {
        if(!this.moves)
        {
            console.log("moves in boardpieces class is null and being called in its Method ClearMoves!");
            return;
        }
        if(this.moves.directions.length && this.moves.directions[0].length) this.currentspot = this.moves.directions[0][0];
        this.moves.ClearMoves();
    }
    IsMyPiece(id)
    {
        if(id == this.pieceid) return true;

        return false;
    }
    AddCurrentSpot(id)
    {
        this.currentspot = id;
    }
    GetCurrentSpot()
    {
        return this.currentspot;
    }
    UpDateMySpot(spot)
    {
        this.currentspot = spot;
    }
    ReplaceMe(id, elem, spot)
    {
        this.pieceid = id;
        this.moves = elem;
        this.currentspot = spot;
    }
}

let OpponentsPieces = [];
let MYpieces = [];

function UpDateOpponentsPieceMove(spot, id)
{
    for(let i = 0; i < OpponentsPieces.length; ++i)
    {
        if(OpponentsPieces[i].IsMyPiece(id))
        {
            OpponentsPieces[i].UpDateMySpot(spot);
        }
    }
}

function PawnToQueen(id, p, spot, pastid)
{
    let pastpiece = GetMyPiece(pastid);
    if(!pastpiece)
    {
        console.log("Pastpiece is null in PawnToQueen!!!");
        return;
    }
    pastpiece.ReplaceMe(id, p, spot);
}

function OpponentPawnToQueen(id, p, spot, pastid)
{
    let op = GetOpponentsPiece(pastid);
    if(!op)
    {
        console.log("op in OpponentPawnToQueen!!!");
        return;
    }
    op.ReplaceMe(id, p, spot);
}

let king = new King(1);
let queen = new Queen(2);
let rook = new Rook(5);
let bishop = new Bishop(3);
let knight = new Knight(4);
let pawn = new Pawn(6);

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

function GetMyInCheckMoveArrayItem(id)
{
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        if(MyInCheckMovesArray[i].IsMyPiece(id)) return MyInCheckMovesArray[i];
    }
    return null;
}

function GetMyPiece(id)
{
    for(let i = 0; i < MYpieces.length; ++i)
    {
        if(MYpieces[i].IsMyPiece(id)) return MYpieces[i];
    }
    return null;
}

function GetOpponentsPiece(id)
{
    for(let i = 0; i < OpponentsPieces.length; ++i)
    {
        if(OpponentsPieces[i].IsMyPiece(id)) return OpponentsPieces[i];
    }
    return null;
}

function ClearAllMoves(id)
{
    for(let i = 0; i < MYpieces.length; ++i) MYpieces[i].ClearMoves();
    for(let i = 0; i < OpponentsPieces.length; ++i) OpponentsPieces[i].ClearMoves();
    ClearMyCheckMoves();
}

function ClearMyMoves()
{
    for(let i = 0; i < MYpieces.length; ++i) MYpieces[i].ClearMoves();
}

function ClearOpponentsMoves()
{
    for(let i = 0; i < OpponentsPieces.length; ++i) OpponentsPieces[i].ClearMoves();
}

function GetNewMovesClass(id)
{
    if(id == 'darkking' || id == 'lightking') return new King(1);
    if(id == 'darkqueen' || id == 'lightqueen') return new Queen(2);
    if(id == 'darkrook' || id == 'lightrook') return new Rook(5);
    if(id == 'darkbishop' || id == 'lightbishop') return new Bishop(3);
    if(id == 'darkknight' || id == 'lightknight') return new Knight(4);
    if(id == 'darkpawn' || id == 'lightpawn') return new Pawn(6);
        
    console.log("id did not match anything in GetNewMovesClass!!!");
    return null;
}

function FindMoves(id, team, showmoves, theoretical)
{
    let item = null;
    let elem = document.getElementById(id).parentElement;
    console.log("MyPieces::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log(MYpieces);
    console.log("OpponentsPieces:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log(OpponentsPieces);
    if(blackbottom)
    {
        if(team == 'dark')
        {
            for(let i = 0; i < MYpieces.length; ++i)
            {
                if(MYpieces[i].pieceid == id)
                item = MYpieces[i];
            }
        }
        else
        {
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
                if(OpponentsPieces[i].pieceid == id)
                item = OpponentsPieces[i];
            }
        }
    }
    else
    {
        if(team == 'dark')
        {
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
                if(OpponentsPieces[i].pieceid == id)
                item = OpponentsPieces[i];
            }
        }
        else
        {
            for(let i = 0; i < MYpieces.length; ++i)
            {
                if(MYpieces[i].pieceid == id)
                item = MYpieces[i];
            }
        }
    }
    if(!item)
    {
        console.log("Item is null in FindMoves!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        return;
    }

    console.log("right before GetMoves in FindMoves::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    item.moves.ClearMoves();
    item.moves.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, showmoves, theoretical);
    if(team == 'dark')
    {
        for(let i = 0; i < item.moves.moves.length; ++i)
        {
            console.log("what the hell in blackmoves::::::::::::::::::::::::::::::::::::::::::::::::");
            blackmoves.push(item.moves.moves[i]);
        }
    }
    else
    {
        for(let i = 0; i < item.moves.moves.length; ++i)
        {
            console.log("what the hell in whitemoves::::::::::::::::::::::::::::::::::::::::::::::::");
            whitemoves.push(item.moves.moves[i]);
        }
    }

    console.log("returning from FindMoves::::::");
}

function GetPieceMoves(elem, theoretical, team)
{
    elem.moves.ClearMoves();
    console.error("Pieceid in GetPieceMoves: " + elem.pieceid)
    elem.moves.GetMoves(document.getElementById(elem.pieceid).parentElement.parentElement.id, team, false, theoretical);
  //  FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
    /*
    if(elem.children.item(0).className === 'lightking' || elem.children.item(0).className === 'darkking')
    {
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        king.ClearMoves();
        king.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightking')
        {
            for(let i = 0; i < king.moves.length; ++i)
            {
                whitemoves.push(king.moves[i]);
            }
        }
        else{
            for(let i = 0; i < king.moves.length; ++i)
            {
                blackmoves.push(king.moves[i]);
            }
        }
        AddToDirectionalMoves(king, elem, theoretical);
        */
    /*}
    if(elem.children.item(0).className === 'lightqueen' || elem.children.item(0).className === 'darkqueen')
    {
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        queen.ClearMoves();
        queen.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightqueen')
        {
            for(let i = 0; i < queen.moves.length; ++i)
            {
                whitemoves.push(queen.moves[i]);
            }
            
        }
        else{
            for(let i = 0; i < queen.moves.length; ++i)
            {
                blackmoves.push(queen.moves[i]);
            }
        }
        AddToDirectionalMoves(queen, elem, theoretical);
        */
    /*}
    if(elem.children.item(0).className === 'lightrook' || elem.children.item(0).className === 'darkrook')
    {
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        rook.ClearMoves();
        rook.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightrook')
        {
            for(let i = 0; i < rook.moves.length; ++i)
            {
                whitemoves.push(rook.moves[i]);
            }
        }
        else{
            for(let i = 0; i < rook.moves.length; ++i)
            {
                blackmoves.push(rook.moves[i]);
            }
        }
        AddToDirectionalMoves(rook, elem, theoretical);
        */
   /* }
    if(elem.children.item(0).className === 'lightbishop' || elem.children.item(0).className === 'darkbishop')
    {
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        bishop.ClearMoves();
        bishop.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightbishop')
        {
            for(let i = 0; i < bishop.moves.length; ++i)
            {
                whitemoves.push(bishop.moves[i]);
            }
        }
        else{
            for(let i = 0; i < bishop.moves.length; ++i)
            {
                blackmoves.push(bishop.moves[i]);
            }
        }
        AddToDirectionalMoves(bishop, elem, theoretical);
        */
    /*}
    if(elem.children.item(0).className === 'lightknight' || elem.children.item(0).className === 'darkknight')
    {
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        knight.ClearMoves();
        knight.GetMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightknight')
        {
            for(let i = 0; i < knight.moves.length; ++i)
            {
                whitemoves.push(knight.moves[i]);
            }
        }
        else{
            for(let i = 0; i < knight.moves.length; ++i)
            {
                blackmoves.push(knight.moves[i]);
            }
        }
        AddToDirectionalMoves(knight, elem, theoretical);
        */
    /*}
    if(elem.children.item(0).className === 'lightpawn' || elem.children.item(0).className === 'darkpawn')
    {
        console.error("Entered Pawn in GetPieceMoves");
        FindMoves(elem.children.item(0).id, elem.children.item(0).ariaLabel, false, theoretical);
        /*
        pawn.ClearMoves();
        pawn.GetDiagMoves(elem.parentElement.id, elem.children.item(0).ariaLabel, false, theoretical);
        if(elem.children.item(0).className === 'lightpawn')
        {
            for(let i = 0; i < pawn.moves.length; ++i)
            {
                whitemoves.push(pawn.moves[i]);
            }
        }
        else{
            for(let i = 0; i < pawn.moves.length; ++i)
            {
                blackmoves.push(pawn.moves[i]);
            }
        }
        AddToDirectionalMoves(pawn, elem, theoretical);
        */
    /*}*/
}

function GetApposingMoves(team)
{
    whitemoves = [];
    blackmoves = [];
    ClearOpponentsMoves();
    console.log('team: [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ ' + team);

    let t = blackbottom ? 'light' : 'dark';
    for(let i = 0; i < OpponentsPieces.length; ++i)
    {
        console.log("OpponentsPieces...");
        console.log(OpponentsPieces[i]);
        GetPieceMoves(OpponentsPieces[i], true, t);
    }
    /*
    if(team === 'dark')
    {
        for(let i = 0; i < whiteonboard.length; ++i)
        {
            GetPieceMoves(whiteonboard[i], true);
        }
        console.log('whitemoves array: ');
        console.log(whitemoves);
        return;
    }
    else{
        for(let i = 0; i < blackonboard.length; ++i)
        {
            GetPieceMoves(blackonboard[i], true);
        }
        console.log('blackmoves array: ');
        console.log(blackmoves)
        return;
    }*/
}

function GetMyMoves()
{
    ClearMyMoves();
    let team = blackbottom ? 'dark' : 'light';
    for(let i = 0; i < MYpieces.length; ++i)
    {
        GetPieceMoves(MYpieces[i], false, team);
    }
}

function GetMyKing()
{
    let id = blackbottom ? 'dk' : 'lk';
    return GetMyPiece(id);
}

function IsPieceOffBoard(elem)
{
    for(let i = 0; i < whiteoffboard.length; ++i)
    {
        if(elem == whiteoffboard[i]) return true;
    }
    for(let i = 0; i < blackoffboard.length; ++i)
    {
        if(elem == blackoffboard[i]) return true;
    }
    return false;
}

function MovesOffForCheckPiece(id)
{
    let newpiece = GetMyInCheckMoveArrayItem(id);
    if(!newpiece)
    {
        console.log("newpiece in MovesOffForCheckPiece from GetMyIncheckMoveArrayItem is null!");
        return;
    }
    newpiece.MovesOff();
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
            if(chesspiece.id == 'lt' && blackbottom) return;
            if(chesspiece.id == 'dt' && !blackbottom) return;

            console.log("this supposed to be when the child enters IsPieceOffBoard()@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            console.log(child);
            if(IsPieceOffBoard(child))
            {
                console.log("Enterd prevent default move@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                e.preventDefault;
                return;
            }

            if(check)
            {
                if(IsValidInCheckPiece(chesspiece)) 
                {
                    focusenter = chesspiecehome;
                    return;
                }
                focusenter = chesspiecehome;
                return;
            }

            if(child.children.item(0).id === 'lk' || child.children.item(0).id === 'dk')
            {
                GetApposingMoves(child.children.item(0).ariaLabel);
                king.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves);
                return;
            }
            if(child.children.item(0).className === 'lightqueen' || child.children.item(0).className === 'darkqueen')
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
                pawn.GetMoves(chesspiecehome.id, child.children.item(0).ariaLabel, availablemoves, false);
                return;
            }
        });
    }

    function HandleCastleMoveSpot(kingid, kingspot, rkid, rkspot)
    {
        let kingpiece = GetMyPiece(kingid);
        if(!kingpiece)
        {
            console.log("kingpiece in HandleCastleMove is nullptr");
            return;
        }
        kingpiece.UpDateMySpot(kingspot);
        let rkpiece = GetMyPiece(rkid);
        if(!rkpiece)
        {
            console.log("rkpiece in HandleCastleMove is nullptr");
            return;
        }
        rkpiece.UpDateMySpot(rkspot);
    }

    function UpdateMySpot(mYpieceid, myspot)
    {
        let thepiece = GetMyPiece(mYpieceid);
        if(!thepiece)
        {
            console.log("thepiece in UpdateMySpot is null ptr");
            return;
        }
        thepiece.UpDateMySpot(myspot);
    }
        
    elem.addEventListener("dragend", function(e)
    {
        if(lock || IsPieceOffBoard(chesspiece))
        {
            return;
        }
        if(focusenter === null)
        {
            console.log('focusenter is equal to null!!!!');
            return;
        }

        if(chesspiece.id == 'lt' && blackbottom) return;
        if(chesspiece.id == 'dt' && !blackbottom) return;

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
                if(check) 
                {
                    MovesOffForCheckPiece(chesspiece.children.item(0).id);
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

            console.log("Right before if(check) in Dragend>>>>>>>>>>>>>>>>>>>>>>......");
            console.log("check is: " + check);
            if(check)
            {
                console.log("Entered if(check) in Dragend listener;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");
                if(Validate_Piece_spot(focusenter.id, chesspiece.children.item(0).id))
                {
                    let incheckpiece = GetMyPiece(chesspiece.children.item(0).id); 
                    if(!incheckpiece)
                    {
                        console.error("incheckpiece in GetMyInCheckMovesArrayItem called from dragend is null!");
                        return;
                    }
                    if(chesspiece.children.item(0).id == 'lk' || chesspiece.children.item(0).id == 'dk')
                    {
                        //check for castle move...
                        if(focusenter.children.length)
                        {
                            let rk = focusenter.children.item(0);

                            //Attempting a castle move...
                            if(chesspiece.id == rk.id)
                            {
                                focusenter.removeChild(rk);
                                chesspiecehome.removeChild(chesspiece);
                                focusenter.appendChild(chesspiece);
                                chesspiecehome.appendChild(rk);
                                HandleFirstMove(chesspiece);
                                HandleCastleMoveSpot(chesspiece.id, focusenter.id, rk.id, chesspiecehome.id);
                                ClearAllMoves();
                                lock = true;
                                check = false;
                                status.innerHTML = Opponent + "'s Move";
                                socket.emit('castle move', {P: Player, king: chesspiece.children.item(0).id, rook: rk.children.item(0).id, rookhome: chesspiecehome.id, kinghome: focusenter.id});
                                return;  
                            }
                        }
                    }
                    console.log("In check Entered into valid piece and spot in Dragend!");
                    if(focusenter.children.length)
                    {
                        console.log("Entered Incheck focus.children.length in dragend!");
                        socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                        RemoveFromBoard(focusenter.children.item(0));
                    }

                    check = false;
                    console.log("check is equal false");

                    chesspiecehome.removeChild(chesspiece);

                    if((focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1') && (chesspiece.children.item(0).className == 'lightpawn' ||
                    chesspiece.children.item(0).className == 'darkpawn'))
                    {
                        let team = chesspiece.children.item(0).ariaLabel
                        let id = "lq";
                        if(team == 'dark') id = "dq";
                        let pastid = chesspiece.children.item(0).id;
                        chesspiece.children.item(0).removeChild(chesspiece.children.item(0).children.item(0));
                        chesspiece.children.item(0).classList.replace(team + 'pawn', team + 'queen');
                        chesspiece.children.item(0).id = GetNewQueenID(GetTeamonBoard(team), team);
                        let image = document.createElement('img');
                        image.src = 'Chess_Pieces/sm' + team + 'queen.png';
                        image.ariaLabel = team;
                        chesspiece.children.item(0).appendChild(image);
                        let h = (.75 * window.innerHeight) / 8;
                        h = parseInt(h.toString().substr(0, 2));
                        focusenter.appendChild(chesspiece);
                        switchpiece(focusenter, h); 
                        PawnToQueen(chesspiece.children.item(0).id, new Queen(2), focusenter.id, pastid);
                        socket.emit('queen-me', {T: team, id: pastid, nid: chesspiece.children.item(0).id});
                    }   

                    focusenter.appendChild(chesspiece);
                    console.log("My new piece");
                    console.log(MYpieces[MYpieces.length-1]);
                    UpdateMySpot(chesspiece.id, focusenter.id);
                    ClearAllMoves();
                    lock = true;
                    let piecename = chesspiece.children.item(0).className.toString();
                    status.innerHTML = Opponent + "'s Move";
                    piecename = chesspiece.children.item(0).ariaLabel == 'light' ? piecename.toString().substr(5) : piecename.toString().substr(4);
                    socket.emit('move finished', {P: Player, id: chesspiece.children.item(0).id, Name: piecename, spot: focusenter.id});
                    freshboard = false;
                    HandleFirstMove(chesspiece);
                    return;
                }
                MovesOffForCheckPiece(chesspiece.children.item(0).id);
                socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                alert("Invalid move while you are in check!");
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

                        //Attempting a castle move...
                        if(chesspiece.id == rk.id)
                        {
                            focusenter.removeChild(rk);
                            chesspiecehome.removeChild(chesspiece);
                            focusenter.appendChild(chesspiece);
                            chesspiecehome.appendChild(rk);
                            HandleFirstMove(chesspiece);
                            HandleCastleMoveSpot(chesspiece.id, focusenter.id, rk.id, chesspiecehome.id);
                            cp.ClearMoves();
                            lock = true;
                            status.innerHTML = Opponent + "'s Move";
                            socket.emit('castle move', {P: Player, king: chesspiece.children.item(0).id, rook: rk.children.item(0).id, rookhome: chesspiecehome.id, kinghome: focusenter.id});
                            return;  
                        }
                    }
                }
                if(focusenter.children.length)
                {
                    socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                    RemoveFromBoard(focusenter.children.item(0));
                }

                chesspiecehome.removeChild(chesspiece);
                        
                if((focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1') && (chesspiece.children.item(0).className == 'lightpawn' ||
                chesspiece.children.item(0).className == 'darkpawn'))
                {
                    let team = chesspiece.children.item(0).ariaLabel
                    let id = "lq";
                    if(team == 'dark') id = "dq";
                    let pastid = chesspiece.children.item(0).id;
                    chesspiece.children.item(0).removeChild(chesspiece.children.item(0).children.item(0));
                    chesspiece.children.item(0).classList.replace(team + 'pawn', team + 'queen');
                    chesspiece.children.item(0).id = GetNewQueenID(GetTeamonBoard(team), team);
                    let image = document.createElement('img');
                    image.src = 'Chess_Pieces/sm' + team + 'queen.png';
                    image.ariaLabel = team;
                    chesspiece.children.item(0).appendChild(image);
                    let h = (.75 * window.innerHeight) / 8;
                    h = parseInt(h.toString().substr(0, 2));
                    focusenter.appendChild(chesspiece);
                    switchpiece(focusenter, h); 
                    PawnToQueen(chesspiece.children.item(0).id, new Queen(), focusenter.id, pastid);
                    socket.emit('queen-me', {T: team, id: pastid, nid: chesspiece.children.item(0).id});
                }   
                focusenter.appendChild(chesspiece);
                UpdateMySpot(chesspiece.id, focusenter.id);
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
        if(lock || IsPieceOffBoard(chesspiece))
        {
            return;
        }

        if(chesspiece.id == 'lt' && blackbottom) return;
        if(chesspiece.id == 'dt' && !blackbottom) return;

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

        console.log("What The fuck if you made it to this statement");
    });

    elem.addEventListener('dragover', (e) => {
        if(!lock) e.preventDefault();
        if(chesspiece.id == 'lt' && !blackbottom) e.preventDefault();
        if(chesspiece.id == 'dt' && blackbottom) e.preventDefault();
    });
}

function AssignPieces()
{
    let Item = blackbottom ? blackonboard[blackonboard.length - 1] : whiteonboard[whiteonboard.length - 1];
    MYpieces.push(new BoardPieces(Item.children.item(0).id, GetNewMovesClass(Item.children.item(0).className), Item.parentElement.id));
  //  MYpieces[MYpieces.length - 1].AddPiece(Item.children.item(0).id, GetNewMovesClass(Item.children.item(0).className));
    Item = blackbottom ? whiteonboard[whiteonboard.length - 1] : blackonboard[blackonboard.length - 1];
    OpponentsPieces.push(new BoardPieces(Item.children.item(0).id, GetNewMovesClass(Item.children.item(0).className), Item.parentElement.id));
   // OpponentsPieces[OpponentsPieces.length - 1].AddPiece(Item.children.item(0).id, GetNewMovesClass(Item.children.item(0).className));
}

function init()
{
        movesbutton.addEventListener('click', (e) => {
    
        if(availablemoves)
        { 
            availablemoves = false;
            movesbutton.innerHTML = "Moves Off";
            return;
        }
        movesbutton.innerHTML = "Moves On";
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
    let Item = null;
    for(let i = 1; i < 9; ++i)
    {
        blackonboard.push(document.getElementById('dp' + i.toString()).parentElement);
        whiteonboard.push(document.getElementById('lp' + i.toString()).parentElement);
        AssignPieces();
        if(i === 1)
        {
            blackonboard.push(document.getElementById('dr' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lr' + i.toString()).parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('dk' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lk' + i.toString()).parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('db' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lb' + i.toString()).parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('dk').parentElement);
            whiteonboard.push(document.getElementById('lk').parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('dq').parentElement);
            whiteonboard.push(document.getElementById('lq').parentElement);
            AssignPieces();
        }
        if(i === 2)
        {
            blackonboard.push(document.getElementById('dr' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lr' + i.toString()).parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('dk' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lk' + i.toString()).parentElement);
            AssignPieces();
            blackonboard.push(document.getElementById('db' + i.toString()).parentElement);
            whiteonboard.push(document.getElementById('lb' + i.toString()).parentElement);
            AssignPieces();
        }
    }
    console.log("MYpieces:::::::::::::::::::::::::::::::::::::::::");
    console.log(MYpieces);
    console.log("OpposingPieces:::::::::::::::::::::::::::::::::::");
    console.log(OpponentsPieces);
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

function AddToMyCheckMoves(id, spot)
{
    console.log("Entered AddToMyCheckMoves(){{{{{{{{{{{{{{{{{{");
    console.log(MyInCheckMovesArray);
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        if(MyInCheckMovesArray[i].piece == id)
        {
            console.log("in AddToMyCheckMoves checkmoves= " + numofcheckmoves);
            ++numofcheckmoves;
            console.log("in AddToMyCheckMoves after increment checkmoves= " + numofcheckmoves);
            MyInCheckMovesArray[i].AddMove(id, spot);
            console.log("Adding spot: " + spot + " to piece: " + id + " i = " + i +  " [[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]");
            return;
        }
    }
    let elem = new MyAvailableCheckMoves();
    console.log("Using Push Adding spot: " + spot + " to piece: " + id + " [[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]");
    elem.AddMove(id, spot);
    MyInCheckMovesArray.push(elem);
    ++numofcheckmoves;
    console.log("in AddToMyCheckMoves right before return checkmoves= " + numofcheckmoves);
}

function AddKingInCheckMoves(id)
{
    console.log("Adding AddKingInCheckMoves " + id + " ppppppppppppppppppppppppppppppppp");
    let k = null;
    for(let i = 0; i < MYpieces.length; ++i)
    {
        if(MYpieces[i].pieceid == id)
        k = MYpieces[i];
    }

    if(!k)
    {
        console.log(id + " was not found in AddKingINCheckMoves!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        return;
    }

    for(let i = 0; i < k.moves.directions.length - FirstEight; ++i)
    {
        for(let j = 1; j < k.moves.directions[i].length; ++j)
        {
            console.log("in AddKingInCheckMoves checkmoves= " + numofcheckmoves);
            AddToMyCheckMoves(id, k.moves.directions[i][j]);
            console.log("in AddToMyCheckMoves after add from AddToMyCheckMoves checkmoves= " + numofcheckmoves);
        }
    }
    if(id == 'lk' || id == 'dk')
    {
        
        for(let j = 0; j < k.moves.directions[10].length; ++j)
        {
            console.log("in AddKingInCheckMoves checkmoves= " + numofcheckmoves);
            AddToMyCheckMoves(id, k.moves.directions[10][j]);
            console.log("in AddToMyCheckMoves after add from AddToMyCheckMoves checkmoves= " + numofcheckmoves);
        }
        
    }

    console.log("in AddKingInCheckMoves right before return checkmoves= " + numofcheckmoves);
}

function ClearMyCheckMoves()
{
    MyInCheckMovesArray = [];
}

socket.on('remove-piece', (data) =>{
    console.log("Move recieved to second board!:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
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
    let cp = GetMyKing();
    let myking = document.getElementById(cp.pieceid);
    UpDateOpponentsPieceMove(obj.spot, obj.id);
    GetApposingMoves();
    console.log("After Getting OpposingMoves in checkforcheck!!!!!!!!!!");
    let angleofattack = [];
    for(let i = 0; i < OpponentsPieces.length - 2; ++i)
    {
        for(let j = 0; j < OpponentsPieces[i].moves.directions.length - FirstEight; ++j)
        {
            for(let k = 0; k < OpponentsPieces[i].moves.directions[j].length; ++k)
            {
                console.log(OpponentsPieces[i].moves.directions[j][k] + " == " + myking.parentElement.parentElement.id);
                if(OpponentsPieces[i].moves.directions[j][k] == myking.parentElement.parentElement.id)
                {
                    check = true;
                    angleofattack = OpponentsPieces[i].moves.directions[j];
                }
            }
        }
    }

    numofcheckmoves = 0;
    if(check)
    {
        console.log("Entered check if statement%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        console.log(angleofattack);
        //check for checkmate...
        GetMyMoves();
        console.log("Right before checking for check loop::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        AddKingInCheckMoves(blackbottom ? 'dk' : 'lk');
        console.log("right after addkingincheckmoves checkmoves= " + numofcheckmoves);

        let iter = 0;
        console.log(MYpieces);
        console.log(OpponentsPieces);
        //check for checkmate...
        for(let i = 0; i < MYpieces.length - 1; ++i)
        {
            if(MYpieces[i].moves.IsKing()) continue;
            ++iter;
            console.log("iter is:::::::::::::::::::::::::::::::::::::::");
            console.log(iter);
            console.log("i is " + i);
            console.log(("MYpieces.length: " + MYpieces.length));
            console.log("Isking(): " + MYpieces[i].moves.IsKing());
            console.log("inside first loop " + MYpieces[i].moves.directions.length);
            for(let j = 0; j < MYpieces[i].moves.directions.length - FirstEight; ++j)
            {
                console.log(MYpieces[i].moves);
                console.log("inside second loop " + MYpieces[i].moves.directions[j].length);
                for(let k = 1; k < MYpieces[i].moves.directions[j].length; ++k)
                {
                    console.log("inside third loop " + angleofattack.length);
                    for(let l = 0; l < angleofattack.length && angleofattack.length; ++l)
                    {
                        console.log("inside fourth loop");
                        console.log(MYpieces[i].moves.directions[j][k] + " == " + angleofattack[l])
                        if(MYpieces[i].moves.directions[j][k] == angleofattack[l])
                        {
                            console.log("Inside if == after fourthloop");
                            console.log("in fourthloop checkmoves= " + numofcheckmoves);
                            AddToMyCheckMoves(MYpieces[i].pieceid, angleofattack[l]);
                        }
                    }
                }
            }
        }  
        console.log("right before check for checkmate addkingincheckmoves checkmoves= " + numofcheckmoves);
        if(!numofcheckmoves)
        {
            lock = true;
            checkalert.style.display = 'block';
            socket.emit('i-lost', ('You Win!'));
            return;
        }
        status.innerHTML = obj.P.PlayerName  + " Put You in Check with thier " + obj.Name + ", Your Move";
        alert(obj.P.PlayerName + " put you in check!");
        return;
    }
    
    
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
    let obj = {wob: [], bob: [], w: [], b: [], pol: [], por: []};
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
    for(let i = 0; i < leftsideboard.length; ++i)
    {
        if(leftsideboard[i].children.length)
        {
            obj.por.push(leftsideboard[i].id);
            obj.por.push(leftsideboard[i].children.item(0).children.item(0).id);
        }
    }
    for(let i = 0; i < rightsideboard.length; ++i)
    {
        if(rightsideboard[i].children.length)
        {
            obj.pol.push(rightsideboard[i].id);
            obj.pol.push(rightsideboard[i].children.item(0).children.item(0).id);
        }
    }
    socket.emit('board_data', (obj));
});

socket.on('queen-it', (obj) => {
    console.log("entered queen-it::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log("queen-it obj!!!");
    console.log(obj);
    let team = obj.T;
    let id = obj.id;
    let cp = document.getElementById(id);
    if(cp == null)
    {
        console.log("cp is nullptr in socket.in(room).emit('queen-it)");
        return;
    }
    console.log(cp);
    cp.removeChild(cp.children.item(0));
    cp.classList.replace(team + 'pawn', team + 'queen');
    cp.id = obj.nid;
    let image = document.createElement('img');
    image.src = 'Chess_Pieces/sm' + team + 'queen.png';
    image.ariaLabel = team;
    cp.appendChild(image);
    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    switchpiece(cp.parentElement.parentElement, h);
    console.log(document.getElementById(obj.id));
    OpponentPawnToQueen(obj.nid, new Queen(2), cp.parentElement.parentElement.id, id);
});

socket.on('update-board', (boarddata) => {
    console.log('entered updata_board clientside');
    console.error("Right before wob board loops'''''''''")
    for(let i = 0; i < boarddata.wob.length; ++i)
    {
        let cp = document.getElementById(boarddata.wob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.wob[i].spot == pastparent.id) continue;
        pastparent.removeChild(cp);
        let cpparent = document.getElementById(boarddata.wob[i].spot);
        cpparent.appendChild(cp);
    }
    console.error("Right before bob board loops'''''''''");
    for(let i = 0; i < boarddata.bob.length; ++i)
    {
        let cp = document.getElementById(boarddata.bob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.bob[i].spot == pastparent.id) continue;
        pastparent.removeChild(cp);
        let cpparent = document.getElementById(boarddata.bob[i].spot);
        cpparent.appendChild(cp);
    }
    console.error("Right before w board loops'''''''''");
    for(let i = 0; i < boarddata.w.length; ++i)
    {
        let cp = document.getElementById(boarddata.w[i]).parentElement;
        RemoveFromBoard(cp);
    }
    console.error("Right before b board loops'''''''''");
    for(let i = 0; i < boarddata.b.length; ++i)
    {
        let cp = document.getElementById(boarddata.b[i]).parentElement;
        RemoveFromBoard(cp);
    }
    console.error("Right before off board loops'''''''''");
    for(let i = 0; i < boarddata.por.length; ++i)
    {
        let cp = document.getElementById(boarddata.por[i].id);
        if(i + 1 < boarddata.por.lenth) cp.appendChild(document.getElementById(boarddata.por[i + 1].id));
    }
    console.error("Left before pol board loops'''''''''")
    for(let i = 0; i < boarddata.pol.length; ++i)
    {
        let cp = document.getElementById(boarddata.pol[i].id);
        if(i + 1 < boarddata.pol.lenth) cp.appendChild(document.getElementById(boarddata.pol[i + 1].id));
    }
});

socket.on('you-win',(something) => {
    innercheckalert.innerHTML = something;
    checkalert.style.display = 'block';
    lock = true;
});



