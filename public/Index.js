
import {io} from 'socket.io-client';
const socket = io('http://chessgames.herokuapp.com');
let whitespots = document.querySelectorAll("white");
let blackspots = document.querySelectorAll("black");
let queen = document.getElementById("lq");
let board = document.getElementById("cb");
let itemclicked = document.getElementById("lq");
let Square = document.getElementById("11");
let dragsquare = document.getElementById("11");
let home = document.getElementById("11");
let focusenter = Square;
let focusleave = Square;
let chesspiece = null;
let item = 1;


const room = 'board';
socket.on('connect', (first) =>{
    socket.emit('join', (room));
    console.log("connection made on clientside!");
});

socket.on('pov', (team) => {
    if(team === 'black')
    {
        
    }
    return;
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
        elem.addEventListener("dragstart", function(e)
        {
            home = this;
        });
        elem.addEventListener("dragend", function(e)
        {
            console.log("this id is: " + this.id);
            console.log("focusenter id is: " + focusenter.id);
            if(this.children.length)
            {
                if(focusenter.children.length)
                {
                    if(focusenter.children.item(0).ariaLabel == this.children.item(0).ariaLabel)
                    return;
                    else{
                        focusenter.removeChild(focusenter.children.item(0));
                        focusenter.appendChild(this.children.item(0));
                        return;
                    }
                }
                if(focusenter.className == 'black drag-over' || focusenter.className == 'white drag-over')
                {
                    focusenter.appendChild(this.children.item(0));
                    const data = focusenter.children.item(0).children.item(0).id;
                    socket.emit('movemade', {
                        piece: focusenter.children.item(0).children.item(0).id,
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
                        let pelement = focusenter.parentElement.parentElement.parentElement
                        pelement.removeChild(pelement.children.item(0));
                        pelement.appendChild(this.children.item(0));
                        socket.emit('movemade', {
                            piece: pelement.children.item(0).children.item(0).id,
                            from: this.id,
                            to: pelement.id
                        });
                    }
                }
            }
        });
        
        elem.addEventListener("mouseleave", SetSquareLeave, true);
        elem.addEventListener("drop", function(e)
        {
        
            
        })
        elem.addEventListener("dragenter", function(e)
        {
            e.preventDefault();
            focusenter = e.target;
            this.classList.add('drag-over');
            console.log("Drag enter " + focusenter.id);
        });

        elem.addEventListener("dragover", function(e)
        {
            e.preventDefault();
            focusenter = e.target;
        });

        elem.addEventListener("dragleave", function(e)
        {
            this.classList.remove('drag-over');
        });


        if(item2 === itemend && item != itemend)
        {
            ++item;
            item2 = 0;
            console.log("item " + item.toString());
            console.log("item2 " + item2.toString());
        }
        else if(item2 == itemend && item == itemend){
            break;
        }

        item2 = item2 + 1;
        console.log("item2 + item2 + 1 " + item2.toString());
    }


function Drop() 
{
    chesspiece = this;
    if(focusenter.firstElementChild != null)
    {
        console.log("FocusEnter has child!!!!");
        return;
    }
    focusenter.appendChild(chesspiece);
    console.log("Focusenter's child has been replaced!!!!!")
    focusenter.classList.remove('moves');
    console.log("Drop Method has focusenter at " + focusenter.id);
}

function SetSquareLeave()
{
    focusleave = this;
    focusleave.classList.remove('drag-over');
    console.log("leave " + focusleave.id);
}

socket.on('movesent', (data) =>{
    console.log("Move recieved to second board!");
    let cp = document.getElementById(data.piece);
    console.log("cp id is: " + cp.id);
    cp = cp.parentElement;
    console.log("cp piece is: " + cp.children.item(0).id);
    const from = document.getElementById(data.from);
    console.log("from id: " + from.id);
    const to = document.getElementById(data.to);
    console.log("to id: " + to.id);
    console.log("from number of children: " + from.children.length);
    from.removeChild(cp);
    if(to.children.length)
    {
        to.removeChild(to.children.item(0));
    }
    to.appendChild(cp);
});
