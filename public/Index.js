
import {io} from 'socket.io-client';
const deploy = 'http://chessgames.herokuapp.com';
const local = 'localhost:8080';
const socket = io(deploy);
let testpiece = document.getElementById('lk');
let board = document.getElementById('cb');
let Square = document.getElementById("11");
let testSqure = document.getElementById('33');
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
let Opponent = "Other Player";
let status = document.getElementById('p');
let update = '';
let parentstatus = document.getElementById('pdiv');
let check = false;
let numofcheckmoves = 0;
let mychesspiece = null;
let enemyspot = null;
let enemypiece = null;
let draginprogress = false;
let pingtimeout = false;
let waslockon = false;
let movecounter = 0;

let enemyPiece = {
    piece: null,
    id: '',
    x: 0, 
    y: 0,
    home: null
}


//index in off theoretical move horizontal array in Moves.directions array...
let theomovehor = 8;
//index in off theoretical move diagnal array in Moves.directions array...
let theomovedia = 9;

//index for moves past the king to ensure he cant move backwards from angle of attack as he would still be in check...
let PKM = 10;
let FirstEight = 4;

let castle = 11;
let large = false;
let medium = false;
let small = false;
let extrasmall = false;

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

class PawnToQueenMap{
    pastid = ''; 
    newid = '';
    team = '';
    constructor(pid, nid, t)
    {
        this.pastid = pid;
        this.newid = nid;
        this.team = t;
    }
}

let MYpQ = [];
let OpponentpQ = [];

//used to map pieces where they start on board...
let piecehome = [];

//used to see if the pieces are in thier starting positions or have moves been made...
let freshboard = true;

function Fillboardsquaresarray()
{
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

class MyAvailableCheckMoves 
{
    piece = null;
    move = [];
    constructor(elem, spot)
    {
        this.piece = elem;
        this.move.push(spot);
    }

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

function SetPieceSize(num)
{
    switch(num)
    {
        case 1:
        {
            extrasmall = true;
            large = small = medium = false;
            return;
        }
        case 2:
        {
            small = true;
            large = extrasmall = medium = false;
            return; 
        }
        case 3:
        {
            medium = true;
            large = extrasmall = small = false;
            return; 
        }
        case 4:
        {
            large = true;
            medium = extrasmall = small = false;
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
        SetPieceSize(1);
    }
    else if(h < 85)
    {
        stringname = 'smr';
        SetPieceSize(2);
    }
    else if(h < 152)
    {
        stringname = 'sm';
        SetPieceSize(3);
    }
    else{
        stringname = '';
        SetPieceSize(4);
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

function findchar(s, ch)
{
    for(let t in s) if(s[t] == ch)  return t

    return -1;
}

window.addEventListener('resize', (e) => {
    console.log("Entered window addevent listener :::::::::::::::::::::::::::::::::::::::");
    let ismobile = window.visualViewport.height > window.visualViewport.width ? true : false;
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

function GetRandomNum(max)
{
    return Math.floor(Math.random() * max);
}

function GetRightSide()
{
    while(true)
    {
        let rand = GetRandomNum(16);
        let spot = '';
        switch(rand)
        {
            case 0: spot = '19'; break;
            case 1: spot =  '20'; break;
            case 2: spot =  '29'; break;
            case 3: spot = '30'; break;
            case 4: spot = '39'; break;
            case 5: spot = '40'; break;
            case 6: spot = '49'; break;
            case 7: spot = '50'; break;
            case 8: spot = '59'; break;
            case 9: spot = '60'; break;
            case 10: spot = '69'; break;
            case 11: spot = '70'; break;
            case 12: spot = '79'; break;
            case 13: spot = '80'; break;
            case 14: spot = '89'; break;
            case 15: spot = '90'; break;
        }
        let item = document.getElementById(spot);
        if(!item.children.length) return item;
    }
}

function GetLeftSide()
{
    while(true)
    {
        let rand = GetRandomNum(16);
        let spot = '';
        switch(rand)
        {
            case 0: spot = '01'; break;
            case 1: spot =  '00'; break;
            case 2: spot =  '020'; break;
            case 3: spot = '02'; break;
            case 4: spot = '030'; break;
            case 5: spot = '03'; break;
            case 6: spot = '040'; break;
            case 7: spot = '04'; break;
            case 8: spot = '050'; break;
            case 9: spot = '05'; break;
            case 10: spot = '060'; break;
            case 11: spot = '06'; break;
            case 12: spot = '070'; break;
            case 13: spot = '07'; break;
            case 14: spot = '080'; break;
            case 15: spot = '08'; break;
        }
        let item = document.getElementById(spot);
        if(!item.children.length) return item;
    }
}

function CheckingKingMove(team, id)
{
    console.error("Team: " + team + " spot " + id + " is being checked by team ")
    for(let l = 0; l < OpponentsPieces.length; ++l)
    {
        console.error("CheckKingMoveloop item.id: " + OpponentsPieces[l].pieceid);
        if(!OpponentsPieces[l].moves.CheckKingMove(id)) return false;
    }
    return true;
}

function GetPawnToQueenMap(team)
{
    if(blackbottom)
    {
        if(team === 'light') return OpponentpQ;
        return MYpQ;
    }
    if(team === 'light') return MYpQ;
    return OpponentpQ;
}

function GetNewQueenID(team)
{
    let id = team === 'light' ? 'lq' : 'dq';
    return id + GetPawnToQueenMap(team).length.toString();
}

function setaside(piece, rightleft)
{
    let spot = null;
    if(rightleft) spot = GetRightSide()
    else spot = GetLeftSide();
    spot.appendChild(piece);
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
  //  console.error("Youve Entered RemoveFromBoard****************************** ");
  //  console.error("elem.id: " + elem.id);
  //  console.error("MYpieces.length: " + MYpieces.length);
   // console.error("OpponentsPieces.length: " + OpponentsPieces.length);
    if(elem.id === 'lt')
    {
       // console.log("In elem.id: " + elem.id);
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
       // console.log(whiteonboard);
        if(blackbottom)
        {
            console.log("blackbottom: " + blackbottom);
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
               // console.log("team id is: " + elem.id + " blackbottom is true");
               // console.error("OpponentsPieces id " + OpponentsPieces[i].pieceid + " == elem.children.item(0).id" + elem.children.item(0).id);
                if(OpponentsPieces[i].pieceid == elem.children.item(0).id) 
                {
                  //  console.error("Removing OpponentsPieces id is: " + OpponentsPieces[i].pieceid);
                    OpponentsPieces.splice(i, 1);
                    break;
                }
            }
            if(putonside) setaside(elem, true);
            return;
        }
        else
        {
           // console.log("blackbottom: " + blackbottom);
            for(let i = 0; i < MYpieces.length; ++i)
            {
              //  console.log("team id is: " + elem.id + " blackbottom is false");
               // console.error("MYpieces id " + MYpieces[i].pieceid + " == elem.children.item(0).id" + elem.children.item(0).id);
                if(MYpieces[i].IsMyPiece(elem.children.item(0).id)) 
                {
                   // console.error("Removing MYpiece id is: " + MYpieces[i].pieceid);
                    MYpieces.splice(i, 1);
                    break;
                }
            }
            RemoveItemMyInCheckArray(elem.children.item(0).id);
            if(putonside) setaside(elem, false);
            return;
        }
    }
    else{
        console.log("In elem.id: " + elem.id);
        blackteam.push(elem);
        for(let i = 0; i < blackonboard.length; ++i)
        {
            if(blackonboard[i].children.item(0).id == elem.children.item(0).id)
            {
                blackonboard.splice(i, 1);
                elem.parentElement.removeChild(elem);
                blackoffboard.push(elem);
            }
        }
        if(blackbottom)
        {
            for(let i = 0; i < MYpieces.length; ++i)
            {
                if(MYpieces[i].pieceid == elem.children.item(0).id) 
                {
                    //console.error("Removing MYpiece id is: " + MYpieces[i].pieceid);
                    MYpieces.splice(i, 1);
                    break;
                }
            }
            RemoveItemMyInCheckArray(elem.children.item(0).id);
            if(putonside) setaside(elem, false);
            return;
        }
        else
        {
           // console.log("blackbottom: " + blackbottom);
            for(let i = 0; i < OpponentsPieces.length; ++i)
            {
               // console.log("team id is: " + elem.id + " blackbottom is false");
               // console.error("OpponentsPieces id " + OpponentsPieces[i].pieceid + " == elem.children.item(0).id" + elem.children.item(0).id);
                if(OpponentsPieces[i].pieceid == elem.children.item(0).id) 
                {
                   // console.error("Removing OpponentsPieces id is: " + OpponentsPieces[i].pieceid);
                    OpponentsPieces.splice(i, 1);
                    break;
                }
            }
            if(putonside) setaside(elem, true);
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

function GetPieceName(id)
{
    let cp = document.getElementById(id);
    let piecename = cp.className.toString();
    piecename = cp.ariaLabel == 'light' ? piecename.toString().substr(5) : piecename.toString().substr(4);
    return piecename;
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
}

function IsMoved(elem)
{
    let findpiece = false;
    for(let i = 0; i < piecehome.length; ++i)
    {
        if(piecehome[i].piece == elem.children.item(0).id) 
        {
            findpiece = true;
            if(piecehome[i].spot != elem.parentElement.id) return true;
        }
    }

    if(!findpiece) return true;
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
    lock = waslockon ? true : false;
    socket.emit('join', (Player));
    if(socket.connected)
    {
        document.getElementById('title').innerText = 'Joined Room: ' + Player.room;
        console.log("IN socket.on connect ");
        alert("You connected to room " + Player.room);
    }
});

socket.on('error', (message) => {
    alert(Player.PlayerName + "has a problem with connecting! " + message);
    return;
});

socket.on('leaveroom', (message) => {
    let m = message.message + message.r;
    alert(m);
});

socket.on('enterroom', (Obj) => {
    Opponent = Obj.Name;
    alert(Obj.sentence);
    console.log("IN socket.on enterroom ");
    socket.emit('my-name-is', (Player.PlayerName));
    return;
});

socket.on('hello', (opponentname) => {
    Opponent = opponentname;
});

socket.on('roomfull', (message) => {
    alert(message);
    socket.disconnect();
    return;
});

if(socket.connected)
{
    alert("You connected to room " + Player.room);
}

function KingsDecision(currentspot, proposedmove)
{
    for(let i = 0; i < OpponentsPieces.length; ++i)
    {
       // console.error("OpponentsPieces[i]id: " +  OpponentsPieces[i].pieceid + " currentspot: " + currentspot + " proposedmove: " + proposedmove);
        if(OpponentsPieces[i].moves.IsMovingIntoCheck(currentspot, proposedmove)) 
        {
            console.error("returning false in KingsDecision");
            return false;
        }
    }
    console.error("returning true in KingsDecision");
    return true; 
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
    pastkingmoves = [];
    castlemoves = [];
    directions = [];

    // the following array is for making sure player can not move himself in check...
    AoA = [];
    
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
        this.AoA = [];
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
        this.directions.push(this.pastkingmoves);
        this.directions.push(this.castlemoves);
    }

    IsMovingIntoCheck(start, end)
    {
        let isinline = false;
        let isoutofline = true;
    //    console.error("this.AoA.length: " + this.AoA.length);
        for(let i = 0; i < this.AoA.length; ++i)
        {
    //        console.error("this.AoA[i]: " + this.AoA[i] + " == end: " + end );
    //        console.error("this.AoA[i]: " + this.AoA[i] + " == start: " + start );
            if(this.AoA[i] == end) isoutofline = false;
            if(this.AoA[i] == start) isinline = true;
        }

    //    console.error("isinline: " + isinline + " isoutofline: " + isoutofline);
        if(isinline && isoutofline) console.error("Returning true!");
        if(isinline && isoutofline) return true;

    //    console.error("returning false!");
        return false;
    }

    CheckKingMove(id)
    {
        if(this.IsPawn())
        {
//            console.log(this.directions);
            for(let i = 0; i < 4; ++i)
            {
                for(let j = 1; j < this.directions[i].length; ++ i)
                {
                    if(this.directions[i][j] == id) return false;
                }
            }
            for(let k = 0; k < this.directions[theomovedia].length; ++k)
            {
                if(this.directions[theomovedia][k] == id) return false;
            }
            return true;
        }

        for(let i = 0; i < this.directions.length - FirstEight; ++i)
        {
            for(let j = 1; j < this.directions[i].length; ++j)
            {
  //              console.error("id " + id + " == this.directions[i][j] " + this.directions[i][j]);
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

        if(this.IsQueen()) console.error("this.directions[PKM].length: " + this.directions[PKM].length);
        for(let i = 0; i < this.directions[PKM].length; ++i)
        {
            if(this.IsQueen()) console.error("this.directions[PKM][i]: " + this.directions[PKM][i] + " == id: " + id);
            if(this.directions[PKM][i] == id) return false;
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

    CancelAoA()
    {
        this.AoA = [];
    }

    Add_AoA(id)
    {
        console.log("Add_AoA(" + id + ")");
        this.AoA.push(id);
    }

    ConsolidateAoA()
    {
        if(!this.AoA.length) return;

        let aoa = [];
        let found = false;
        for(let i = 0; i < this.directions.length - FirstEight; ++i)
        {
     //       console.error("found: " + found + " i: " + i);
            if(found) break;
            for(let j = 0; j < this.directions[i].length; ++j)
            {
    //            console.error("found: " + found + " j: " + j);
                if(found) break;
                for(let k = 0; k < this.AoA.length; ++k)
                {
    //                console.error("AoA[k] " + this.AoA[k] + " == this.directions[i][j] " + this.directions[i][j]);
                    if(this.AoA[k] == this.directions[i][j]) 
                    {
                        aoa = this.directions[i];
                        found = true;
                        break;
                    }
                }
            }
        }

        console.error("found is: " + found);
        if(!found) return;

        let iter = 0;
        console.log(aoa);
        for(let i = 0; i < aoa.length; ++i)
        { let bool = true;
       //     console.error("for aoa i: " + i + " aoa[i]: " + aoa[i]);
        //    console.error("AoA.length: " + this.AoA.length);
            for(let j = 0; j < this.AoA.length - iter; ++j)
            {
                console.error("AoA[j]: " + this.AoA[j] + " == aoa[i]: " + aoa[i])
                if(this.AoA[j] == aoa[i]) 
                {
                    console.error("breaking...");
                    bool = false;
                    break;
                }
            }
            if(bool)
            {
                console.error("pushing: " + aoa[i]);
                ++iter;
                this.AoA.push(aoa[i]);
            }
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

    startspot = '';
    //used for Extend function, if it hits two pieces before it finds the king then it no longer continues, this is for preventing a player from moving themselves in check...
    piechit = 0;
    //past king moves boolean...
    pkm = false;
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

        this.startspot = spot;
        for(let iteration = 1; iteration < 5; ++iteration)
        {
            this.onemove = false;
            this.pkm = false;
            this.directions[iteration - 1].push(spot);
            this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }

        if(!kingmove && theoretical) this.ConsolidateAoA();
    }

    DIA_Extend(row, col, team, iteration)
    {
        if(!this.Check(row, col, iteration))
        {
            this.CancelAoA();
            return;
        }
        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            this.CancelAoA();
            console.log("Next is null in diagnalRU!");
            return;
        }
        if(next.children.length)
        {
            if((next.children.item(0).children.item(0).id == 'lk' || next.children.item(0).children.item(0).id == 'dk'))
            {
                if(team == next.children.item(0).children.item(0).ariaLabel)
                {
                    this.CancelAoA();
                    return;
                }
                return;
            }
            this.CancelAoA();
            return;
            this.piechit++;
            if(this.piecehit == 2) 
            {
                this.CancelAoA();
                return;
            }
        }
        this.Add_AoA(next.id);
        this.DIA_Extend(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, iteration);
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
                    this.directions[theomovedia].push(next.id);
                    this.moves.push(next.id);
                    return;
                }
                return;
            }
            /*
            if(kingmove)
            {
                if(!CheckingKingMove(team, next.id)) return;
            }*/
            if(kingmove)
            {
                if(!CheckingKingMove(team, next.id)) return;

                this.AddMove(next, moves_available, iteration - 1);
                return;
            }

            if(!theoretical) 
            {
                if(!KingsDecision(this.startspot, next.id)) return;
            }

            this.AddMove(next, moves_available, iteration - 1);
            if(this.pkm) return;

            if(theoretical && (next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk'))
            {
                if(!kingmove)
                {
                    this.pkm = true;
                    this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            if(theoretical && !kingmove) 
            {
                if(this.AoA.length) return;
                this.Add_AoA(next.id);
                this.DIA_Extend(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, iteration);
            }
            return
        }
        if(kingmove)
        {
            if(!CheckingKingMove(team, next.id)) return;

            this.AddMove(next, moves_available, iteration - 1);
            return;
        }

        if(!theoretical) 
        {
            if(KingsDecision(this.startspot, next.id)) this.AddMove(next, moves_available, iteration - 1);
        }
        else this.AddMove(next, moves_available, iteration - 1);

        if(this.pkm) return;
        if(!kingmove)
        {
            this.DiaMoves(this.Rowincrement(row, iteration), this.Colincrememt(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }
    
    Rowincrement(row, iter)
    {
    //    console.log("This is a Diag func increment row!!!");
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
 //       console.log("This is a Diag func increment col!!!");
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
        this.startspot = spot;
        for(let iteration = 1; iteration < 5; ++iteration)
        {
            this.onemove = false;
            this.pkm = false;
            this.directions[iteration + 3].push(spot);
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
        if(kingmove && !theoretical)
        {
            this.CastleMove(row, col, team, moves_available);
        }
        if(!kingmove && theoretical) this.ConsolidateAoA();
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
        if(next.children.length)
        {
            if(next.children.item(0).children.item(0).ariaLabel != team) return;
            if(next.children.item(0).children.item(0).className != team + 'rook') return;
            if(col.toString() === '8' || col.toString() === '1')
            {
                if(!CheckingKingMove(team, next.id)) return;
                if(moves_available) next.classList.add('moves');
                this.directions[this.directions.length - 1].push(next.id);
                this.moves.push(next.id);
                return;
            }
            return;
        }
        this.CastleCheck(row, this.incremen_th_vcol(col, iter), iter, moves_available, team);
    }

    HV_Extend(row, col, team, iteration)
    {
        if(!this.check_h_v(row, col, iteration))
        {
            console.log("Calling CancelAoA in HV_Extend because it is out of bounds... + " + row + "" + col);
            this.CancelAoA();
            return;
        }
        let next = document.getElementById(row.toString() + col.toString());
        if(next === null)
        {
            this.CancelAoA();
            console.log("Next is null in diagnalRU!");
            return;
        }
        if(next.children.length)
        {
            console.log("Next spot has children; next.id: " + next.id + " child.id: " + next.children.item(0).children.item(0).id);
            if((next.children.item(0).children.item(0).id == 'lk' || next.children.item(0).children.item(0).id == 'dk'))
            {
                if(team == next.children.item(0).children.item(0).ariaLabel)
                {
                    console.log("Calling CancelAoA in HV_Extend because it is this pieces king...");
                    this.CancelAoA();
                    return;
                }
                return;
            }
            console.log("Calling CancelAoA in HV_Extend because it is not a king in the next spot...");
            this.CancelAoA();
            return;
        }
        console.log("next spot has no children...");
        this.Add_AoA(next.id);
        console.log("recursively calling HV_Extend...");
        this.HV_Extend(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, iteration);
    }

    AddMove(next, moves_available, index)
    {
        if(moves_available)
        {
            next.classList.add('moves');
        }

        if(!this.pkm)
        {
            this.directions[index].push(next.id);
            this.moves.push(next.id);
        }
        else{
            this.directions[PKM].push(next.id);
        }
    }

    HV_Moves(row, col, team, kingmove, moves_available, theoretical, iteration)
    {
        if(!this.check_h_v(row, col, iteration))
        {
            console.log("row: " + row + " col: " + col + " is out of bounds");
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
                    this.AddMove(next, moves_available, theomovehor);
                    return;
                }
                return;
            }
            if(kingmove)
            {
                if(!CheckingKingMove(team, next.id)) return;

                this.AddMove(next, moves_available, iteration + 3);
                return;
            }
            if(!theoretical) 
            {
                if(!KingsDecision(this.startspot, next.id)) return;
            }
            this.AddMove(next, moves_available, iteration + 3);
            if(this.pkm) return;
            
            if(theoretical && next.children.item(0).children.item(0).id === 'lk' || theoretical && next.children.item(0).children.item(0).id === 'dk')
            {
                if(!kingmove)
                {
                    this.pkm = true;
                    this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
                }
                return;
            }
            if(theoretical) 
            {
                if(this.AoA.length) return;
                this.Add_AoA(next.id);
                this.HV_Extend(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, iteration);
            }
            return
        }
        if(kingmove)
        {
            if(!CheckingKingMove(team, next.id)) return;
            this.AddMove(next, moves_available, iteration);
            return;
        }

        if(!theoretical) 
        {
            if(KingsDecision(this.startspot, next.id)) this.AddMove(next, moves_available, iteration + 3);
        }
        else this.AddMove(next, moves_available, iteration + 3);
        
        if(this.pkm) return;
        if(!kingmove)
        {
            this.HV_Moves(this.increment_hv_row(row, iteration), this.incremen_th_vcol(col, iteration), team, kingmove, moves_available, theoretical, iteration);
        }
    }

    increment_hv_row(row, iter)
    {
    //    console.log("This is a horizontal func increment row!!!");
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
   //     console.log("This is a horizontal func increment col!!!");
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

class Knight extends Moves{
    checkmoves = 0
    startspot = '';
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

        this.startspot = spot;
        this.FillFirstPosition(spot);
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
                    this.AddTheoreticalMoveDia(next.id);
                    return;
                }
                return;
            }
            else
            {
                if(!KingsDecision(this.startspot, next.id)) 
                {
                    ++this.checkmoves;
                    return;
                }
                if(moves_available)
                {
                    next.classList.add('moves');
                }
                this.moves.push(next.id);
                this.directions[this.checkmoves].push(next.id);
            }
        }
        if(!KingsDecision(this.startspot, next.id)) 
        {
            ++this.checkmoves;
            return;
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
    startspot = '';
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
        this.startspot = spot;
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
                this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
                this.MoveDiag(row, col + 1, team, moves_available, theoretical);
                return;
            }
            this.FirstMoveDown(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
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
                this.MoveDiag(++row, col - 1, team, moves_available, theoretical);
                this.MoveDiag(row, col + 1, team, moves_available, theoretical);
                return;
            }

            this.FirstMoveUp(row, col, team, moves_available);

            row = originrow;
            col = origincol;
            this.MoveDiag(--row, col - 1, team, moves_available, theoretical);
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
                if(!KingsDecision(this.startspot, forward.id)) return false;
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
                if(moves_available)
                {
                    diag.classList.add('moves');
                }
                this.AddMovesForPawn(diag.id, true);
                this.moves.push(diag.id);
            }

            if(diag.children.length)
            {
                if(diag.children.item(0).children.item(0).ariaLabel !== team)
                {
                    if(!theoretical && !KingsDecision(this.startspot, diag.id)) return;
                    if(moves_available)
                    {
                        diag.classList.add('moves');
                    }
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
    ReplaceMe(id, elem)
    {
        this.pieceid = id;
        this.moves = elem;
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

function PawnToQueen(id)
{
    let cp = document.getElementById(id);
    console.log(document);
    console.log("id: " + id);
    if(!cp) 
    {
        console.error("cp is null in PawnToQueen!. id is: " + id);
        return;
    }
    let team = cp.ariaLabel;
    cp.removeChild(cp.children.item(0));
    cp.classList.replace(team + 'pawn', team + 'queen');
    let pastid = cp.id;
    cp.id = GetNewQueenID(team);
    let image = document.createElement('img');
    cp.appendChild(image);
    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    image.src = 'Chess_Pieces/' + GetPiecesizename(h) + team + 'queen.png';
    image.ariaLabel = team;
    cp.appendChild(image);
    console.log("in pawn to queen right before using pastid");
    let pastpiece = GetMyPiece(pastid);
    console.log(pastpiece);
    console.log("in pawn to queen right after using pastid");
    if(!pastpiece)
    {
        console.error("Pastpiece is null in PawnToQueen!!!");
        return;
    }
    MYpQ.push(new PawnToQueenMap(pastid, id, team));
    pastpiece.ReplaceMe(cp.id, new Queen(2));
    console.log(pastpiece);
    console.log("returnig from Pawn to queen")
}

function OpponentPawnToQueen(id)
{
    let cp = document.getElementById(id);
    if(!cp) 
    {
        console.error("cp is null in OpponentPawnToQueen!. id is: " + id);
        return;
    }
    let team = cp.ariaLabel;
    cp.removeChild(cp.children.item(0));
    cp.classList.replace(team + 'pawn', team + 'queen');
    let pastid = cp.id;
    cp.id = GetNewQueenID(team);
    let image = document.createElement('img');
    let h = (.75 * window.innerHeight) / 8;
    h = parseInt(h.toString().substr(0, 2));
    image.src = 'Chess_Pieces/' + GetPiecesizename(h) + team + 'queen.png';
    image.ariaLabel = team;
    cp.appendChild(image);
    let op = GetOpponentsPiece(pastid);
    if(!op)
    {
        console.error("op in OpponentPawnToQueen!!!");
        return;
    }
    OpponentpQ.push(new PawnToQueenMap(pastid, id, team));
    op.ReplaceMe(cp.id, new Queen(2));
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

function GetPieceMoves(elem, theoretical, team)
{
    elem.moves.ClearMoves();
    console.error("Pieceid in GetPieceMoves: " + elem.pieceid);
    console.error("team in GetPieceMoves is: " + team);
    let thispiece = document.getElementById(elem.pieceid);
    if(!thispiece)
    elem.moves.GetMoves(enemyspot.id, team, false, theoretical);
    else
    elem.moves.GetMoves(thispiece.parentElement.parentElement.id, team, false, theoretical);
}

function GetMyPieceMoves(elem, theoretical, team)
{
    elem.moves.ClearMoves();
    console.error("Pieceid in GetMyPieceMoves: " + elem.pieceid);
    elem.moves.GetMoves(document.getElementById(elem.pieceid).parentElement.parentElement.id, team, availablemoves, theoretical);
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
        GetPieceMoves(OpponentsPieces[i], true, t);
        console.log(OpponentsPieces[i]);
    }
}

function GetMyMoves()
{
    ClearMyMoves();
    let team = blackbottom ? 'dark' : 'light';
    for(let i = 0; i < MYpieces.length; ++i)
    {
        console.error("GetMyMoves...");
        console.log("isKing " + MYpieces[i].moves.IsKing());
        GetPieceMoves(MYpieces[i], false, team);
        console.log(MYpieces[i])
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

function HomeEnemyPiece()
{
    
}

function NullenemyPiece()
{
    enemyPiece.piece = null;
    enemyPiece.position = null;
    enemyPiece.home = null;
}

function HandleOtherplayerDisconnecting(message)
{
    console.error("message is::::" + message);
    if(message == "transport close") 
    {
        pingtimeout = false;
        return;
    }
    else pingtimeout = true;
    if(enemyPiece.home && enemyPiece.piece)
    {
        console.log("enemypiece id: " + enemyPiece.id);
      //  let child = document.getElementById(enemyPiece.id).parentElement;
      enemyPiece.piece.style.zIndex = 1;
        enemyPiece.piece.style.position = 'static';
        console.log("After position set to static: " + enemyPiece.piece.style.position);
        console.log(enemyPiece.piece);
        document.getElementById(enemyPiece.home.id).appendChild(enemyPiece.piece);
     //   console.log(child.id);
        enemyPiece.piece.style.position = 'static';
        console.log(enemyPiece.home);
        console.log(enemyPiece.piece);
    }
    NullenemyPiece();
    ClearMyMoves();
    return;
}

function SetListeners(elem)
{
    let child = elem.firstElementChild;
    if(child !== null)
    {
            child.addEventListener('drag',(e) => {
            if(lock || IsPieceOffBoard(chesspiece))
            {
                return;
            }
            draginprogress = true;
            ++movecounter;
            if(chesspiece.id == 'lt' && blackbottom) return;
            if(chesspiece.id == 'dt' && !blackbottom) return;
            let rect = board.getBoundingClientRect()
            let srect = Square.getBoundingClientRect();

            let l = rect.left < 0 ? -1 * rect.left + srect.width * 2 : rect.left + srect.width * 2;
            let right = rect.left < 0 ? -1 * rect.left + rect.right : rect.right;
            let r = rect.right - srect.width * 2;

            let t = rect.top;
            let bottom = rect.top < 0 ? -1 * rect.top + rect.bottom : rect.bottom;
            if(e.clientX > r || e.clientX < l) return;
            if(e.clientY > bottom || e.clientY < t) return;
            let xp = e.pageX / (right); 
            let yp = (e.pageY) / (bottom);
            socket.emit('moving', ({x: xp, y: yp, ww: rect.left, wh: rect.top, item: child.children.item(0).id, spot:chesspiecehome.id}));
            if(movecounter == 50) socket.emit('TestDisconnect', 'ping timeout');
        });

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

            mychesspiece = GetMyPiece(child.children.item(0).id)
            if(!mychesspiece) 
            {
                console.error("mychesspiece is null in dragend after calling GetMyPiece!");
                return;
            }
            console.log(mychesspiece);
            GetMyPieceMoves(mychesspiece, false, child.children.item(0).ariaLabel);
            return;
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
            console.error("ChessPiece is off board or lock is true!");
            return;
        }
        if(focusenter === null)
        {
            console.error('focusenter is equal to null!!!!');
            return;
        }

        if(chesspiece.id == 'lt' && blackbottom) return;
        if(chesspiece.id == 'dt' && !blackbottom) return;

        focusenter.classList.remove('drop');
        console.error("Before entering ifstatement in Dragend " + focusenter.className);
        if(focusenter.className  === 'black moves' || focusenter.className === 'white moves' || focusenter.className === 'white' || focusenter.className === 'black' 
        || focusenter.className === 'black drag-over' || focusenter.className === 'white drag-over')
        {
            console.error("After Entering ifstatement in Dragend " + focusenter.className);
            if(focusenter.id === chesspiecehome.id)
            {
                socket.emit('moved-back', {cp: chesspiece.id, sp: chesspiecehome.id});
                let cp = mychesspiece.moves; //GetPiece(chesspiece.children.item(0).className);
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

            let cp = mychesspiece.moves;//GetPiece(chesspiece.children.item(0).className);
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
                                waslockon = true;
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
                        draginprogress = false;
                    }

                    check = false;
                    console.error("check is equal false");

                    chesspiecehome.removeChild(chesspiece);
                    focusenter.appendChild(chesspiece);

                    if((focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1') && (chesspiece.children.item(0).className == 'lightpawn' ||
                    chesspiece.children.item(0).className == 'darkpawn'))
                    {
                        let team = chesspiece.children.item(0).ariaLabel;
                        let pastid = chesspiece.children.item(0).id;
                        console.log("pastid: " + pastid);
                        console.log("chesspiece.children.item(0).id: " + chesspiece.children.item(0).id);
                        console.log("after change pastid: " + pastid);
                        PawnToQueen(chesspiece.children.item(0).id);
                        socket.emit('queen-me', {T: team, id: pastid, nid: chesspiece.children.item(0).id});
                    }   

                    console.log("My new piece");
                    console.log(MYpieces[MYpieces.length-1]);
                    UpdateMySpot(chesspiece.id, focusenter.id);
                    ClearAllMoves();
                    lock = true;
                    waslockon = true;
                    let piecename = chesspiece.children.item(0).className.toString();
                    update = Opponent + "'s Move";
                    status.style.opacity = 0;
                    piecename = chesspiece.children.item(0).ariaLabel == 'light' ? piecename.toString().substr(5) : piecename.toString().substr(4);
                    socket.emit('move finished', {P: Player, id: chesspiece.children.item(0).id, Name: piecename, spot: focusenter.id, pspot: chesspiecehome.id});
                    freshboard = false;
                    draginprogress = false;
                    HandleFirstMove(chesspiece);
                    return;
                }
                MovesOffForCheckPiece(chesspiece.children.item(0).id);
                socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                alert("Invalid move while you are in check!");
                draginprogress = false;
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
                            waslockon = true;
                            update = Opponent + "'s Move";
                            status.style.opacity = 0;
                            socket.emit('castle move', {P: Player, king: chesspiece.children.item(0).id, rook: rk.children.item(0).id, rookhome: chesspiecehome.id, kinghome: focusenter.id});
                            draginprogress = false;
                            return;  
                        }
                    }
                }
                if(focusenter.children.length)
                {
                    socket.emit('take-piece', (focusenter.children.item(0).children.item(0).id));
                    console.error("Right Before RemoveFromBoard in Dragend@@@");
                    RemoveFromBoard(focusenter.children.item(0));
                }

                chesspiecehome.removeChild(chesspiece);
                focusenter.appendChild(chesspiece);
                        
                if((focusenter.id.toString().slice(0,1) === '8' || focusenter.id.toString().slice(0,1) === '1') && (chesspiece.children.item(0).className == 'lightpawn' ||
                chesspiece.children.item(0).className == 'darkpawn'))
                {
                    let team = chesspiece.children.item(0).ariaLabel;
                    let pastid = chesspiece.children.item(0).id;
         //           console.log("pastid: " + pastid);
         //           chesspiece.children.item(0).id = GetNewQueenID(GetTeamonBoard(team), GetTeamOffBoard(team), team);
                    console.log("chesspiece.children.item(0).id: " + chesspiece.children.item(0).id)
                    console.log("after change pastid: " + pastid);
                    PawnToQueen(chesspiece.children.item(0).id);
                    console.log("Right before socket.emit queenme");
                    socket.emit('queen-me', {T: team, id: pastid, nid: chesspiece.children.item(0).id, spot: focusenter.id});
                }   

                UpdateMySpot(chesspiece.id, focusenter.id);
                cp.ClearMoves();
                lock = true;
                waslockon = true;
                let piecename = chesspiece.children.item(0).className.toString();
                update = Opponent + "'s Move";
                status.style.opacity = 0;
                piecename = chesspiece.children.item(0).ariaLabel == 'light' ? piecename.toString().substr(5) : piecename.toString().substr(4);
                socket.emit('move finished', {P: Player, id: chesspiece.children.item(0).id, Name: piecename, spot: focusenter.id, pspot: chesspiecehome.id});
                draginprogress = false;
                freshboard = false;
                HandleFirstMove(chesspiece);
                return;
            }
            else{
                cp.ClearMoves();
                socket.emit('invalid-move', ({cp: chesspiece.children.item(0).id, sp: chesspiece.parentElement.id}));
                alert("Invalid move!");
                draginprogress = false;
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
        this.classList.remove('drop');
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
 //       socket.emit('drag-in', ({
  //          piece: chesspiece.children.item(0).id,
  //          square: focusenter.id
  //      }));

        console.log("What The fuck if you made it to this statement");
    });

    elem.addEventListener('dragover', (e) => {
        if(!lock) e.preventDefault();
        if(chesspiece.id == 'lt' && !blackbottom) e.preventDefault();
        if(chesspiece.id == 'dt' && blackbottom) e.preventDefault();
    });
}

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}
 
let transitionevent = whichTransitionEvent();

status.addEventListener('transitionend', function (e){
    if(status.style.opacity == 1) return;
    if(check) status.style.color = 'red';
    else status.style.color = 'darkgrey';
    status.innerHTML = update;
    Fade();
}, false);

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
    console.log("Got to init set listeners...");
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
    console.log("after set listeners");
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

function Fade()
{
    console.error("opacity: " + status.style.opacity);
    if(status.style.opacity == 1)
    {
        console.error("opacity is 1 changing to 0");
        status.style.opacity = 0;
        return;
    }
    if(status.style.opacity == 0)
    {
        console.error("opacity is 0 changing to 1");
        status.style.opacity = 1;
    }
}

function AddToMyCheckMoves(id, spot)
{
    console.log("Entered AddToMyCheckMoves(){{{{{{{{{{{{{{{{{{");
    console.log(MyInCheckMovesArray);
    for(let i = 0; i < MyInCheckMovesArray.length; ++i)
    {
        if(MyInCheckMovesArray[i].IsMyPiece(id))
        {
            console.log("in AddToMyCheckMoves checkmoves= " + numofcheckmoves);
            ++numofcheckmoves;
            console.log("in AddToMyCheckMoves after increment checkmoves= " + numofcheckmoves);
            MyInCheckMovesArray[i].AddMove(id, spot);
            console.log("Adding spot: " + spot + " to piece: " + id + " i = " + i +  " [[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]");
            return;
        }
    }
    console.log("Using Push Adding spot: " + spot + " to piece: " + id + " [[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]");
    MyInCheckMovesArray.push(new MyAvailableCheckMoves(id, spot));
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
        
        for(let j = 0; j < k.moves.directions[castle].length; ++j)
        {
            console.log("in AddKingInCheckMoves checkmoves= " + numofcheckmoves);
            AddToMyCheckMoves(id, k.moves.directions[castle][j]);
            console.log("in AddToMyCheckMoves after add from AddToMyCheckMoves checkmoves= " + numofcheckmoves);
        }
        
    }

    console.log("in AddKingInCheckMoves right before return checkmoves= " + numofcheckmoves);
}

function ClearMyCheckMoves()
{
    MyInCheckMovesArray = [];
}

let UpdatePosition = function(){
    if(!enemyPiece.piece) enemyPiece.piece = document.getElementById(enemyPiece.id).parentElement;
    if(!enemyPiece.home)
    {
     //   document.getElementById('s').
        enemyPiece.home = enemyPiece.piece.parentElement;
        enemyPiece.home.removeChild(enemyPiece.piece);
        enemyPiece.piece.style.zIndex = 10;
        board.appendChild(enemyPiece.piece);
     
    }
    enemyPiece.piece.style.position = 'absolute';
    enemyPiece.piece.style.left = enemyPiece.x  + 'px'
    enemyPiece.piece.style.top = enemyPiece.y + 'px';
}

socket.on('test-disconnect', (reason) => {
    waslockon = lock;
    lock = true;
    HandleOtherplayerDisconnecting(reason);
});

socket.on('test-disconnecting', (reason) => {
    waslockon = lock;
    lock = true;
    ClearMyMoves();
});

socket.on('mid-disconnect', (message) => {
    waslockon = lock;
    lock = true;
    HandleOtherplayerDisconnecting(message);
});

socket.on("mid-disconnecting", (reason) => {
    waslockon = lock;
    lock = true;
    ClearMyMoves();
});

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

    console.error("Right Before RemoveFromBoard in removepiece");
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
    enemyPiece.piece.style.position = 'static'
    enemyPiece.position.appendChild(enemyPiece.piece);
    NullenemyPiece();
    /*
    let cp = document.getElementById(obj.cp);
    let cpparent = cp.parentElement;
    console.log(cp);
    let home = document.getElementById(obj.sp);
    let parent = cp.parentElement.parentElement;
    console.log(obj);
    home.appendChild(cpparent);*/
});


socket.on('checkforcheck', (obj) => {
    console.error("appending to spot: " + obj.spot)
    if(enemyPiece){
        console.log("Before applying static to position: " + enemyPiece.piece);
        console.log(enemyPiece.piece);
        enemyPiece.piece.style.position = 'static';
        document.getElementById(obj.spot).appendChild(enemyPiece.piece);
        console.log("After applying static to position: " + enemyPiece.piece);
        console.log(enemyPiece.piece);
    }
    NullenemyPiece();
    
    check = false;
    lock = false;
    waslockon = false;
    let cp = GetMyKing();
    let myking = document.getElementById(cp.pieceid);
    UpDateOpponentsPieceMove(obj.spot, obj.id);
   // let land = document.getElementById(obj.spot);
   // land.classList.remove('drop');
   // land.classList.add('drop');
    GetApposingMoves();
    console.log("After Getting OpposingMoves in checkforcheck!!!!!!!!!!");
    let angleofattack = [];
    let piecename = '';
    for(let i = 0; i < OpponentsPieces.length; ++i)
    {
        for(let j = 0; j < OpponentsPieces[i].moves.directions.length - FirstEight; ++j)
        {
            for(let k = 0; k < OpponentsPieces[i].moves.directions[j].length; ++k)
            {
                console.log(OpponentsPieces[i].moves.directions[j][k] + " == " + myking.parentElement.parentElement.id);
                if(OpponentsPieces[i].moves.directions[j][k] == myking.parentElement.parentElement.id)
                {
                    if(!check) piecename = GetPieceName(OpponentsPieces[i].pieceid);
                    check = true;
                    angleofattack = OpponentsPieces[i].moves.directions[j];
                }
            }
        }
    }

    numofcheckmoves = 0;
    if(check)
    {
        socket.emit('put-me-in-check', {p: Player.PlayerName, piece: piecename});
    //    console.log("Entered check if statement%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    //    console.log(angleofattack);
        //check for checkmate...
        GetMyMoves();
     //   console.log("Right before checking for check loop::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
        AddKingInCheckMoves(blackbottom ? 'dk' : 'lk');
     //   console.log("right after addkingincheckmoves checkmoves= " + numofcheckmoves);

        let iter = 0;
    //    console.log(MYpieces);
     //   console.log(OpponentsPieces);
        //check for checkmate...
        console.log(MYpieces);
        for(let i = 0; i < MYpieces.length - 1; ++i)
        {
            if(MYpieces[i].moves.IsKing()) continue;
            ++iter;
        //    console.log("iter is:::::::::::::::::::::::::::::::::::::::");
        //    console.log(iter);
        //    console.log("i is " + i);
        //    console.log(("MYpieces.length: " + MYpieces.length));
        //    console.log("Isking(): " + MYpieces[i].moves.IsKing());
       //     console.log("inside first loop " + MYpieces[i].moves.directions.length);
            for(let j = 0; j < MYpieces[i].moves.directions.length - FirstEight; ++j)
            {
              //  console.log(MYpieces[i].moves);
              //  console.log("inside second loop " + MYpieces[i].moves.directions[j].length);
                for(let k = 1; k < MYpieces[i].moves.directions[j].length; ++k)
                {
                 //   console.log("inside third loop " + angleofattack.length);
                    for(let l = 0; l < angleofattack.length && angleofattack.length; ++l)
                    {
                   //     console.log("inside fourth loop");
                   //     console.log(MYpieces[i].moves.directions[j][k] + " == " + angleofattack[l])
                        if(MYpieces[i].moves.directions[j][k] == angleofattack[l])
                        {
                     //       console.log("Inside if == after fourthloop");
                      //      console.log("in fourthloop checkmoves= " + numofcheckmoves);
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
            status.innerHTML = obj.P.PlayerName + " Wins";
            socket.emit('i-lost', ('You Win!'));
            return;
        }
        update = obj.P.PlayerName  + " Put You in Check with thier " + obj.Name + ", Your Move";
        status.style.opacity = 0;
    //    alert(obj.P.PlayerName + " put you in check!");
        return;
    }
    
    
    let LandingSpot = blackbottom ? GetMirror(obj.spot.toString().substr(0,1), obj.spot.toString().substr(1,2)) : document.getElementById(obj.id).parentElement.parentElement.id;
    console.error(status.style.opacity);
    update = obj.P.PlayerName + " moved their " + obj.Name + " to " + LandingSpot + ", Your Move";
    status.style.opacity = 0;
    //status.innerHTML = obj.P.PlayerName + " moved their " + obj.Name + " to " + LandingSpot + ", Your Move";
    console.error(status.style.opacity);
    Opponent = obj.P.PlayerName;
  //  alert(obj.P.PlayerName + " moved their " + obj.Name + " to " + LandingSpot);
  
});

socket.on('you-checked-me', (obj) =>{
    update = "You put " + obj.p + " in check with your " + obj.piece;
    status.style.opacity = 0;
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
    console.log("IN socket.on teamassigned ");
    if(firstconnection)
    {
        return;
    }
    Player = new playerinfo(Player.PlayerName, Player.room, team, socket.id);
    console.log("Right before alert in teamassigned' ");
    alert('You are team ' + team);
    if(team == 'black')
    {
        console.log("Right after team info in socket.on 'team assigned' ");
        firstconnection = true;
        Mirrorboard();
        SetboardTop('light');
        SetboardBottom('dark');
        init();
        return;
    }

    console.log("Right after team info out of socket.on 'team assigned' ");
    firstconnection = true;
    SetboardTop('dark');
    SetboardBottom('light');
    console.log("Right after setboardbottom outside of team-assigned");
    init();
});

socket.on('check_state_of_board', (message) => {
    console.log('entered check_state_of_board on clientside');
    console.log("freshboard is:" + freshboard);
    console.log("pingtimeout is: " + pingtimeout);
    pingtimeout ? socket.emit('state_is', (true)) : socket.emit('state_is', (freshboard));
    pingtimeout = false;
});

socket.on('get_board_data', (message) => {
    console.log('entered get_board_data on clientside');
    let obj = {wob: [], bob: [], w: [], b: [], pol: [], por: [], mpq: [], opq: []};
    for(let i = 0; i < whiteonboard.length; ++i)
    {
        if(IsMoved(whiteonboard[i])) obj.wob.push(new map(whiteonboard[i].parentElement.id, whiteonboard[i].children.item(0).id));
    }
    for(let i = 0; i < blackonboard.length; ++i)
    {
        if(IsMoved(blackonboard[i])) obj.bob.push(new map(blackonboard[i].parentElement.id, blackonboard[i].children.item(0).id));
    }
    for(let i = 0; i < MYpQ.length; ++i)
    {
        obj.mpq.push({pastid: MYpQ[i].pastid, newid: MYpQ[i].newid, team: MYpQ[i].team});
    }
    for(let i = 0; i < OpponentpQ.length; ++i)
    {
        obj.opq.push({pastid: OpponentpQ[i].pastid, newid: OpponentpQ[i].newid, team: OpponentpQ[i].team});
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
        console.error("cp is nullptr in socket.in(room).emit('queen-it)");
        return;
    }
 //   enemyPiece.piece.style.position = 'static';
 //   document.getElementById(obj.spot).appendChild(enemyPiece);
 //   NullenemyPiece();
    OpponentPawnToQueen(obj.id);
});

socket.on('update-board', (boarddata) => {
    freshboard = false;
    console.log('entered updata_board clientside');
    console.error("Right before wob board loops'''''''''");
    let emptyspot = '';

    for(let i = 0; i < boarddata.opq.length; ++i)
    {
        MYpQ.push(new PawnToQueenMap(boarddata.opq[i].pastid, boarddata.opq[i].newid, boarddata.opq[i].team));
        PawnToQueen(boarddata.opq[i].pastid);
    }
    for(let i = 0; i < boarddata.mpq.length; ++i)
    {
        OpponentpQ.push(new PawnToQueenMap(boarddata.mpq[i].pastid, boarddata.mpq[i].newid, boarddata.mpq[i].team));
        OpponentPawnToQueen(boarddata.mpq[i].pastid);
    }
    for(let i = 0; i < boarddata.wob.length; ++i)
    {
        let cp = document.getElementById(boarddata.wob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.wob[i].spot == pastparent.id) continue;
        if(pastparent) pastparent.removeChild(cp);
        let cpparent = document.getElementById(boarddata.wob[i].spot);
        cpparent.appendChild(cp);
    }
    console.error("Right before bob board loops'''''''''");
    for(let i = 0; i < boarddata.bob.length; ++i)
    {
        let cp = document.getElementById(boarddata.bob[i].piece).parentElement;
        let pastparent = cp.parentElement;
        if(boarddata.bob[i].spot == pastparent.id) continue;
        if(pastparent) pastparent.removeChild(cp);
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
    status.innerHTML = something;
    innercheckalert.innerHTML = something;
    checkalert.style.display = 'block';
    lock = true;
});

socket.on('reconnect_fail', (message) => {
    alert(message);
});

socket.on('currentposition', (move) => {
 //   console.error("move.x: " + move.x + " move.y: " + move.y);
    let rect = board.getBoundingClientRect()
    let srect = Square.getBoundingClientRect();
 //   console.table(srect);
 //   console.table(rect);
    let l = rect.left + srect.width * 2;
    let right = rect.left < 0 ? (-1 * rect.left + rect.right) : rect.right// + (move.winwidth - window.innerWidth);
  //  if(window.scrollX + rect.left < 0) right = (-1 * (window.scrollX + rect.left)) + right + ele.getBoundingClientRect().width;

  //  right = right - ((document.body.getBoundingClientRect().width - board.getBoundingClientRect().width)/2);
  //  right = right + ele.getBoundingClientRect().width * 2 + 4 + 10;
    
    let bottom = rect.top < 0 ? -1 * rect.top + rect.bottom : rect.bottom;
    console.log("board.offseTop: " + board.offsetTop);
    console.log("board.offsetLeft: " + board.offsetLeft);
    console.log("board.rect.left: " + rect.left);
    console.log("board.rect.top: " + rect.top);
 //   console.log("win innerwidth: " + window.innerWidth);
 //   console.log("win innerheight: " + window.innerHeight);
 //   console.log("body.width: " + document.body.getBoundingClientRect().width);
 //   console.log("body.bottom: " + document.body.getBoundingClientRect().bottom);
 //   console.log("board.right: " + board.getBoundingClientRect().right);
 //   console.log("board.bottom: " + board.getBoundingClientRect().bottom);
 //   console.log("before enemyPiece.x: " + enemyPiece.x);
//    console.log("before enemyPiece.y: " + enemyPiece.y);
    enemyPiece.x = ((1 - move.x) * right);
    enemyPiece.y = ((1 - move.y) * bottom)// + (document.getElementById('lk').getBoundingClientRect().height / 2); /*- ele.children.item(0).getBoundingClientRect().height) *///- 50));
 //   console.log("board.offsetTop: " + board.offsetTop);
 //   console.log("rect.top: " + rect.top)
    enemyPiece.y = enemyPiece.y; + (board.offsetTop);
  //  enemyPiece.y = enemyPiece.y - ((window.innerHeight - rect.height) + (window.innerHeight - rect.bottom));
 //   console.log("left: " + window.scrollX + rect.left);
//    console.log("top: " + window.scrollY + rect.top);
 //   console.log("right: " + right);
 //   console.log("bottom: " + bottom);
 //   console.log("enemyPiece.x: " + enemyPiece.x);
//    console.log("enemyPiece.y: " + enemyPiece.y);
    enemyPiece.id = move.item;
   // requestAnimationFrame(UpdatePosition);
   UpdatePosition();
})



