function init(height, width, char) {
    var mtx = [];
    for(var i = 0; i < height; i++) {
        mtx[i] = [];
        for(var j = 0; j < width; j++) {
            mtx[i][j] = char;
        }
    }
    return mtx;
}

function printMtx() {
    var string = "";
    for(var i = 0; i < matrix.length; i++) {
        for(var j = 0; j < matrix[0].length; j++) {
            string += matrix[i][j];
        }
        console.log(string);
        string ="";
    }
}

function initPlayer(height, width) {
    var randX = Math.round(Math.random()*(height - 1));
    var randY = Math.round(Math.random()*(width - 1));
    matrix[randX][randY] = 'P';
}

function initTraps(height, width) {
    var randX = Math.round(Math.random() * (height - 1));
    var randY = Math.round(Math.random() * (width - 1));
    if(matrix[randX][randY] == '.') {
        matrix[randX][randY] = 'T';
        traps++;
    } else {
        initTraps(height, width);
    }
}

function initGoal(height, width) {
    var randX = Math.round(Math.random() * (height - 1));
    var randY = Math.round(Math.random() * (width - 1));
    if(matrix[randX][randY] == '.') {
        matrix[randX][randY] = 'X';
        hasGoal = true;
    }
}

//helper ------------------------------------------------------------------- 

var positionP = function()
{
    for(var i = 0; i<matrix.length; i++) {
        for(var j = 0; j<matrix[0].length; j++) {
            if(matrix[i][j] === PLAY) {
                return {
                    "x":i,
                    "y":j
                };
            }
        }
    }
};

var positionT = function() {
    var trapArray = []; 
    for(var i = 0; i < matrix.length; i++) {
        for(var j = 0; j < matrix[0].length; j++) {
            if(matrix[i][j] === TRAP) {
                //var pos = "x":i,"y":j;
               trapArray.push({"x":i,"y":j});
            }
        }
    }
    return trapArray;
};

function moveTrap() {
    
    var pos = positionT();
    
    for(var i = 0; i < pos.length; i++) {
        
        var index = i;
        var which_dir = Math.round((Math.random()*3)+1);
        
        
        switch(which_dir) {
            case 1: moveTrapInDirection(pos[i].x+1,pos[i].y, index);
            break;
            case 2: moveTrapInDirection(pos[i].x-1,pos[i].y, index);
            break;
            case 3: moveTrapInDirection(pos[i].x,pos[i].y+1, index);
            break;
            case 4: moveTrapInDirection(pos[i].x,pos[i].y-1, index);
        }
    }
    
}

function moveTrapInDirection(xd,yd, index) {
    var tArray = positionT();
    var oldx = tArray[index].x;
    var oldy = tArray[index].y;
    
    if((xd >= 0 && xd < matrix.length) && (yd >= 0 && yd < matrix[0].length))
    var poz = matrix[xd][yd];
    if(poz === DOT) {
        matrix[xd][yd] = TRAP;
        matrix[oldx][oldy] = DOT;
    }

}

var moveInDirection = function (xd, yd)
{
    var P = positionP();
    var oldx = P.x;
    var oldy = P.y;
    
    if((xd >= 0 && xd < matrix.length) && (yd >= 0 && yd < matrix[0].length))
    var poz = matrix[xd][yd];
    if(poz === GOAL) {
        console.log("Holly Cow, You WON!");
        gameOver = true;
    } else if(poz === TRAP) {
        console.log("You died miserably! :( RIP");
        gameOver = true;
    } else if(poz === DOT) {
        matrix[xd][yd] = PLAY;
        matrix[oldx][oldy]= DOT;
    }
};
// helper end --------------------------------------------------------------- */

function generateGameTable() {
    initPlayer(height,width);
    while(traps != Math.round((height+width)/4)) {
        initTraps(height,width);
    }
    while(!hasGoal) {
        initGoal(height,width);
    }
    printMtx();
}

function changePosition(input) {
    var pos = positionP();
    
    if(input == 'w') {
        moveInDirection(pos.x-1,pos.y);
    } else if(input == 'a') {
        moveInDirection(pos.x,pos.y-1);
    } else if(input == 's') {
        moveInDirection(pos.x+1,pos.y);
    } else if(input == 'd') {
        moveInDirection(pos.x,pos.y+1);
    }
    printMtx();
}


var playerInput = function () 
{
    
    var rl = require('readline');
    var prompts = rl.createInterface(process.stdin, process.stdout);
    
    prompts.question("Please type a letter ( 'w', 'a', 's', 'd') : ", function(input) {
        
        moveTrap();
        changePosition(input);
        step_count++;
        prompts.close();
        
        if(!gameOver) {
            playerInput();
        } else {
            console.log("You have made " + step_count + " moves");
            process.exit();
        }
        
    });
};

// legyen majd tobb palya es egyre nagyobb egyre nehezebb meg legyen 3 eleted

//globalis valtozok ---------------------------
var traps = 0;
var height = 7;
var width = 10;
var hasGoal = false;
var DOT = '.',
    PLAY = 'P',
    TRAP = 'T',
    GOAL = 'X';
var gameOver = false;
var matrix = init(height,width,'.');
var step_count = 0;

// globalis valtozok vege ---------------------

generateGameTable();
playerInput();
