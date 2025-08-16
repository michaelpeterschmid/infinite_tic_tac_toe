let gamefield = new Map();
let currentPlayer = [`<img src="cross.png">`, "cross"];
let counter = 0;
let cells = document.getElementsByClassName("cell");

let cross_array = [];
let circle_array = [];

cells = Array.from(cells);
cells.forEach(cell => {
    cell.addEventListener("click", () => play(cell)); /*Need to write like this so that it is not executet right away but only after click*/
});

async function play(cell){
    if(cell.innerHTML !== ""){
        alert("cell already played!"); 
        return;
    }
    if(counter%2==0){


        if(cross_array.length>=3){
            gamefield.delete(cross_array[0].id); //delete entry from gamefield
            cross_array[0].innerHTML = ""; //delete from html dell div.
            cross_array = cross_array.splice(1,);
        }

        cell.innerHTML = currentPlayer[0];
        gamefield.set(cell.id, currentPlayer[1])
        /* Draw first before  checking win*/
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        // alternative: await new Promise(r => setTimeout(r, 0)); It pauses your async function until the next macrotask, giving the browser a chance to render.
        if(checkWin(currentPlayer[1], cell)){
            location.reload()
            return;
        }
        cross_array.push(cell);



        counter++
        currentPlayer = [`<img src="circle.png">`, "circle"];



    
    }else{

        if(circle_array.length>=3){
            gamefield.delete(circle_array[0].id); //delete entry from gamefield
            circle_array[0].innerHTML = ""; //delete from html dell div.
            circle_array = circle_array.splice(1,);
        }

        
        cell.innerHTML = currentPlayer[0];
        gamefield.set(cell.id, currentPlayer[1])
        /* Draw first before  checking win*/

        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));


        if(checkWin(currentPlayer[1], cell)){
            location.reload()
            return;
        }

        circle_array.push(cell);



        counter++
        currentPlayer = [`<img src="cross.png">`, "cross"];
    }

    console.log(gamefield.entries());
}

function checkWin(player, cell) {
    if(checkHorizontal(player, cell)){
        return true;
    }if(checkVertical(player, cell)){
        return true;
    }if(checkDiagonal(player, cell)){
        return true;
    }
}
function checkHorizontal(player, cell) {
    let stepsBackwards = 0;
    let stepsForwards = 0;

    let id_y = Number(cell.id.split(".")[0]); // row
    let id_x = Number(cell.id.split(".")[1]); // col

    // forward (right)
    let x = id_x + 1;
    let y = id_y;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsForwards++;
        x++;
    }

    // backward (left)
    x = id_x - 1;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsBackwards++;
        x--;
    }

    return checkLength(player, stepsBackwards, stepsForwards);
}

function checkVertical(player, cell) {
    let stepsBackwards = 0;
    let stepsForwards = 0;

    let id_y = Number(cell.id.split(".")[0]); // row
    let id_x = Number(cell.id.split(".")[1]); // col

    // forward (right)
    let x = id_x;
    let y = id_y + 1;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsForwards++;
        y++;
    }

    // backward (left)
    y = id_y - 1;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsBackwards++;
        y--;
    }

    return checkLength(player, stepsBackwards, stepsForwards);
}

function checkDiagonal(player, cell) {
    //check from top left to corner right and vice versa
    let stepsBackwards = 0;
    let stepsForwards = 0;

    let id_y = Number(cell.id.split(".")[0]); // row
    let id_x = Number(cell.id.split(".")[1]); // col

    // forward (right)
    let x = id_x + 1
    let y = id_y + 1;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsForwards++;
        y++;
        x++;
    }

    // backward (left)
    y = id_y - 1;
    x = id_x - 1
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsBackwards++;
        y--;
        x--;
    }
    if(checkLength(player, stepsBackwards, stepsForwards)){
        return true;
    }
    //check from top right to corner right and vice versa
    stepsBackwards = 0;
    stepsForwards = 0;

    // forward (right)
    x = id_x - 1
    y = id_y + 1;
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsForwards++;
        y++;
        x--;
    }

    // backward (left)
    y = id_y - 1;
    x = id_x + 1
    while (gamefield.get(`${y}.${x}`) === player) {
        stepsBackwards++;
        y--;
        x++;
    }
    return checkLength(player, stepsBackwards, stepsForwards);
}

function checkLength(player, stepsBackwards, stepsForwards){
    if (stepsBackwards+stepsForwards>=2){
        winner = player;
        alert(winner + " has won the game!");
        return true;
    }else{
        return false;
    }
}
