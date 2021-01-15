var flower = document.createElement("audio");
flower.setAttribute("src", "flower.mp3");
flower.volume = 0.02
var fwip = document.createElement("audio");
fwip.setAttribute("src", "fwip.mp3");
fwip.volume = 0.1
var light = document.createElement("audio");
light.setAttribute("src", "lighter.mp3");
light.volume = 0.1


//DEFINE CANVAS AND CONTEXT
//-------------------------------------------------------------------------
var cvs = document.getElementById('gamecvs');
//sets a variable which calls the game canvas/container
var ctx = cvs.getContext('2d');
//allows the 2d image variant to be drawn on the canvas
//--------------------------------------------------------------------------

//FRAMERATE EDITING VARIABLES
//--------------------------------------------------------------------------
lastFrameTimeMs = 0,
    maxFPS = 100,
    delta = 0,
    timestep = 1000 / maxFPS,
    framesThisSecond = 0,
    lastFpsUpdate = 0;
//--------------------------------------------------------------------------
//DEFINE GLOBAL VARIABLES
//--------------------------------------------------------------------------
var levelnumber = 0;
const sprite = new Image();
sprite.src = "black.png";
const grav = 0.04/100*cvs.height;      //sets gravitational acceleration
var background = true;       // TRUE is BLACK, FALSE is WHITE
var platforms = [];
var walls = [];
var controls = {
    left: false,
    right: false,
};
var frames = 0
var map =
{
    width: cvs.width*2,
    height: cvs.height,
}
var animation = [
    { sX: 0, sY: 0 },
    { sX: 0, sY: 0 },
    { sX: 160, sY: 0 },
    { sX: 320, sY: 0 },
    { sX: 320, sY: 0 },
    { sX: 480, sY: 0 },
    { sX: 480, sY: 0 },
    { sX: 640, sY: 0 },
    { sX: 0, sY: 160 },
    { sX: 160, sY: 160 },
    { sX: 320, sY: 160 },
    { sX: 320, sY: 160 },
    { sX: 480, sY: 160 },
    { sX: 640, sY: 160 },
    { sX: 0, sY: 320 },
    { sX: 160, sY: 320 },
    { sX: 320, sY: 320 },
    { sX: 480, sY: 320 },
    { sX: 640, sY: 320 },
    { sX: 0, sY: 480 },
    { sX: 160, sY: 480 },
    { sX: 320, sY: 480 },
    { sX: 480, sY: 480 },
    { sX: 640, sY: 480 },
    { sX: 0, sY: 640 },
    { sX: 160, sY: 640 },
    { sX: 320, sY: 640 },
]

var edgeleft = null;
var edgeright = null;
var edgebot = null;
var edgetop = null;
var platheight = null;

var bg =
{
    draw: function () {
        ctx.fillRect(0, 0, cvs.width, cvs.height);
    },

    update: function () {
        ctx.fillStyle = ((background) ? "black" : "white");
    }
}

//CHARACTER CLASS
//-----------------
class Character {
    constructor(x, y, w, h) {
        this.x = x/100*cvs.width
        this.y = y/100*cvs.height
        this.width = w/100*cvs.width
        this.height = h/100*cvs.height
        this.velX = 0.3/100*cvs.width;
        this.velY = 0/100*cvs.width;
        this.frame = 0
        this.inAir = true
        this.landHard = 0
        this.right = true;
        this.down = false;
        this.win=false;
    }
    update() {
        if (this.y > edgebot - platheight / 3) { this.down = false; }
        if (this.down) { edgeleft = -100; edgeright = -100; this.inAir = true; }


        if (this.x + this.width * 0.72 < edgeleft
            || this.x + this.width * 0.28 > edgeright) { this.inAir = true }

        if(this.win){this.win=false;levelnumber++; lvlCreate(levels[levelnumber]);console.log("WHY")}

        if (Math.floor(frames * 1.1 % 10) <= 1) {
            if (this.velY > 0 && this.inAir) { if (this.frame < 25 && this.frame >= 19) { this.frame++ } if (this.frame < 19 || this.frame > 25) { this.frame = 19 } if (this.frame == 25) { this.landHard = 2 } }

            if (this.velY < 0 && this.inAir) { if (this.frame < 18 && this.frame >= 16) { this.frame++ } if (this.frame < 16 || this.frame > 18) { this.frame = 16 } }

            if (this.velY == 0) {
                this.frame++
                if (controls.right || controls.left) {
                    this.frame = Math.floor(this.frame % 15); if (this.frame < 4) { this.frame = 4 };
                    if (this.landHard == 2 && !this.down) { this.frame = 26; this.landHard = 0; }
                }
                else { this.frame = Math.floor(this.frame % 5); if (this.landHard != 0 && !this.down) { this.frame = 26; this.landHard--; } }


            }
        }



        // LOAD SPRITE IMAGE
        if (this.right) { sprite.src = (background ? "white.png" : "black.png") }
        if (!this.right) { sprite.src = (background ? "rewhite.png" : "reblack.png") }

        if (this.inAir) { this.y += this.velY; if(this.velY<=10){this.velY += grav;}  }
        //=====================================================================


        //OUTOFBOUNDS-------------------------------------
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x + this.width / 2 > map.width) {
            this.x = map.width - this.width / 2;
        }
        if (this.y + this.height >= cvs.height) {
            this.y = map.height - this.height;
            if (this.inAir) { this.velY = 0 }
            this.inAir = false;
        }


        //X MOVEMENT-----------------------------------------------
        if (controls.left) {
            this.x -= this.velX;
        }

        if (controls.right) {
            this.x += this.velX;
        }
        //---------------

    };
    draw() {

        ctx.drawImage(sprite, animation[this.frame].sX, animation[this.frame].sY, 160, 160, this.x - myCam.x, this.y, this.width, this.height);

    }
    jump() {
        this.down = false;
        this.velY = -.016*cvs.height;
        this.frame = 2;
        this.inAir = true;
        // this.y-=
    }
}


//--------------------------------------------------------------------------
class Wall {
    constructor(color, x, y, w, h) {
        this.color = color;
        this.w = w/100*cvs.width
        this.h = h/100*cvs.height
        this.x = x/100*cvs.width
        this.y = y/100*cvs.height
    }
    draw() {
        ctx.fillStyle = ((this.color == 1) ? "grey" : ((this.color == 2) ? 'black' : 'white'));
        ctx.fillRect(this.x - myCam.x, this.y, this.w, this.h);
    }
    update() {
        if (
            myChar.y + myChar.height >= walls[i].y
            && myChar.y + myChar.height <= walls[i].y + walls[i].h
            && walls[i].color != ((background) ? 2 : 0)
        ) {
            if (controls.left && myChar.x + myChar.width * 0.28 <= walls[i].x + walls[i].w && myChar.x + myChar.width * 0.28 >= walls[i].x + walls[i].w * 0.5) {
                myChar.x = walls[i].x + walls[i].w - myChar.width * 0.25;
            }

            if (controls.right && myChar.x + myChar.width * 0.72 >= walls[i].x && myChar.x + myChar.width * 0.72 <= walls[i].x + walls[i].w * 0.5) {
                myChar.x = walls[i].x - myChar.width * 0.75;
            }
        }
    }
}



class Platform {
    constructor(color, x, y, w, h) {
        this.color = color;
        this.w = w/100*cvs.width
        this.h = h/100*cvs.height
        this.x = x/100*cvs.width
        this.y = y/100*cvs.height
    }
    draw() {
        if (this.color != ((background) ? 2 : 0)) {
            ctx.fillStyle = ((this.color == 1) ? "grey" : ((this.color == 2) ? 'black' : 'white'));
            ctx.fillRect(this.x - myCam.x, this.y, this.w, this.h);
        }
    }
    update() {
        // (0 = BLACK, 1 = GRAY, 2 = WHITE)
        if (
            myChar.y + myChar.height >= this.y
            && Math.floor(myChar.y + myChar.height) <= this.y + this.h*0.5
            && myChar.velY >= 0
            && this.color != ((background) ? 2 : 0)
            && myChar.down == false
        ) {

            if (myChar.x + myChar.width * 0.72 >= this.x
                && myChar.x + myChar.width * 0.28 <= this.x + this.w) { console.log("reset edges"); 
                edgetop = this.y; edgebot = this.y + this.h; edgeleft = this.x; platheight = this.h; edgeright = this.w + this.x; 
                if (myChar.inAir = true) { myChar.velY = 0 }; 
                myChar.inAir = false; 
                myChar.y = this.y - myChar.height - 0.01 
            }
            else {

                myChar.inAir = true;
            }
        }




    }

}

class Win {
    constructor(x, y, w, h) {
        this.w = w/100*cvs.width
        this.h = h/100*cvs.height
        this.x = x/100*cvs.width
        this.y = y/100*cvs.height
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - myCam.x, this.y, this.w, this.h);
    }
    update() {
        if (
            myChar.y + myChar.height >= this.y
            && myChar.y + myChar.height <= this.y + this.h
            && myChar.velY >= 0
        ) {
            if (myChar.x + myChar.width * 0.72 >= this.x
                && myChar.x + myChar.width * 0.28 <= this.x + this.w) {myChar.win=true;edgetop = this.y; edgebot = this.y + this.h; edgeleft = this.x; platheight = this.h; edgeright = this.w + this.x; if (myChar.inAir = true) { myChar.velY = 0 }; myChar.inAir = false; myChar.y = this.y - myChar.height - 1 }
            else {
                myChar.inAir = true;
            }
        }




    }

}


//CAMERA CLASS
//----------------------------------------------------------------------
class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.left2charx = 0
        this.top2chary = 0
    }
    update() {
        this.left2charx = myChar.x + myChar.width / 2 - cvs.width / 2
        if (this.left2charx < 0 || this.left2charx + cvs.width > map.width) { return; }
        else { this.x = this.left2charx }
        
    }

}

//----------------------------------------------------------------------
var winPlat = new Win(-1000,-1000,1000,1000)
var myChar=new Character(.66,1,6.66,10);
var myCam = new Camera();


function drawAll() {
    ctx.clearRect(0, 0, cvs.width, cvs.height)
    bg.draw()
    for (i = 0; i < platforms.length; i++) { platforms[i].draw() }
    for (i = 0; i < walls.length; i++) { walls[i].draw() }
    winPlat.draw()
    myChar.draw()
}

function updateAll() {
    myCam.update()
    bg.update()
    for (i = 0; i < platforms.length; i++) { platforms[i].update() }
    for (i = 0; i < walls.length; i++) { walls[i].update() }
    winPlat.update()
    myChar.update()
}


drawAll()
updateAll()


var down = false;
var down2 = false;
window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = true;
            myChar.right = false
            break;
        case 39: // right arrow
            controls.right = true;
            myChar.right = true
            break;
        case 32: //space bar
            if (down) { return; }
            down = true
            if (!myChar.inAir) {
                myChar.jump()

                fwip.currentTime = 0;
                fwip.play()
            }
            break;
        case 13: // enter
            if (down2) { return; }
            down2 = true
            background = !background;
            light.currentTime = 0;
            light.play()
            break;
        case 20: // enter
            if (down2) { return; }
            down2 = true
            background = !background;
            light.currentTime = 0;
            light.play()
            myChar.inAir = true;
            break;
        case 40:
            myChar.down = true;
            myChar.inAir = true;
            break;
    }
}, false);

window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = false;
            break;
        case 39: // right arrow
            controls.right = false;
            break;
        case 32: //space bar
            down = false
            break;
        case 13: //enter
            down2 = false
            break;
        case 20: //enter
            down2 = false
            break;
        case 40: //down
            if (myChar.y > edgebot - 10) { myChar.down = false; }
            break;
        case 82: //R
            lvlCreate(levels[levelnumber])
            break;

    }
}, false);

var running = false,
    started = false;

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function (timestamp) {
            drawAll();
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}

function mainLoop(timestamp) {
    flower.play()
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        frameID = requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    while (delta >= timestep) {
        drawAll()
        updateAll(timestep);
    }
    delta -= timestep;
    frames++;
    drawAll()
    updateAll(timestep);
    frameID = requestAnimationFrame(mainLoop);
}



var level0 = {
    platforms: [
        { color: 0, x: 40, y: 60, width: 20, height: 5},
        { color: 2, x: 13, y: 80, width: 13, height: 5},
        { color: 2, x: 73, y: 40, width: 16, height: 5},
        { color: 1, x: 100, y: 60, width: 20, height: 5},
    ],
    walls: [
        { color: 2, x: 33, y: 0, width: 2, height: 100 },
    ],
    winPlat:
    {x: 110, y: 20, width: 33, height: 4} 
}
var level1 = {
    walls: [],
    platforms: [
        { color: 1, x: 100, y: 100, width: 100, height: 20 },  //1, 10, 10, 10, 2
        { color: 0, x: 250, y: 100, width: 70, height: 20 },  //0, 25, 10, 7, 2
        { color: 0, x: 370, y: 100, width: 70, height: 20 },  //37, 10, 7, 2, 0
        { color: 0, x: 490, y: 150, width: 70, height: 20 },  //49, 15, 7, 2, 0
        { color: 0, x: 610, y: 120, width: 70, height: 20 },  //61, 12, 7, 2, 0
        { color: 0, x: 710, y: 130, width: 70, height: 20 },  //71, 13, 7, 2, 0
        { color: 1, x: 000, y: 200, width: 750, height: 50 },  //0, 20, 75, 5, 1
        { color: 1, x: 800, y: 130, width: 300, height: 20 },  //80, 13, 30, 2, 1
        { color: 1, x: 800, y: 600, width: 300, height: 50 },  //80, 3, 30, 2, 1
        { color: 0, x: 910, y: 600, width: 300, height: 50 },  //91, 5, 3, 8, 0
        { color: 2, x: 1070, y: 600, width: 300, height: 50 },  //107, 5, 3, 8, 2
        { color: 0, x: 1200, y: 600, width: 300, height: 50 },  //120, 15, 20, 7, 0
        { color: 1, x: 1500, y: 600, width: 300, height: 50 },  //150, 15, 20, 7, 1
        { color: 2, x: 1800, y: 600, width: 300, height: 50 },  //180, 15, 20, 7, 2
        { color: 2, x: 1800, y: 600, width: 300, height: 50 },  //250, 5, 10, 50, 2
        { color: 2, x: 2500, y: 600, width: 300, height: 50 },  //180, 100, 40, 10, 2
        { color: 2, x: 1800, y: 600, width: 300, height: 50 },  //170, 100, 10, 15, 0
        { color: 0, x: 1700, y: 600, width: 300, height: 50 },  //140, 105, 10, 15, 0
        { color: 0, x: 1400, y: 600, width: 300, height: 50 },  //103, 100, 20, 15, 0
        { color: 0, x: 1030, y: 600, width: 300, height: 50 },  //103, 100, 5, 20, 0
        { color: 0, x: 1030, y: 600, width: 300, height: 50 },  //90, 120, 15, 10, 1
        { color: 1, x: 1900, y: 600, width: 300, height: 50 },  //95, 107, 10, 5, 1
        { color: 1, x: 1950, y: 600, width: 300, height: 50 },  //66, 100, 24, 15, 2
        { color: 2, x: 1660, y: 600, width: 300, height: 50 },  //85, 100, 5, 20, 2
        { color: 2, x: 1850, y: 600, width: 300, height: 50 },  //0, 25, 10, 175, 1
        { color: 1, x: 1000, y: 600, width: 300, height: 50 },  //10, 100, 15, 10, 2
        { color: 2, x: 1100, y: 600, width: 300, height: 50 },  //25, 100, 41, 10, 1
        { color: 1, x: 1600, y: 600, width: 300, height: 50 },  //66, 115, 10, 85, 1
        { color: 1, x: 100, y: 600, width: 300, height: 50 },  //10, 130, 41, 10, 1
        { color: 1, x: 100, y: 600, width: 300, height: 50 },  //51, 130, 15, 10, 0
        { color: 0, x: 100, y: 600, width: 300, height: 50 },  //51, 130, 15, 10, 0
        { color: 0, x: 100, y: 600, width: 300, height: 50 },  //10, 150, 15, 10, 2
        { color: 2, x: 100, y: 600, width: 300, height: 50 },  //25, 150, 41, 10, 1
        { color: 1, x: 100, y: 600, width: 300, height: 50 },  //25, 150, 41, 10, 1
        { color: 1, x: 100, y: 600, width: 300, height: 50 },  //7, 175, 15, 10, 1
    ],
    winPlat:
    {x: 1750, y: 300, width: 500, height: 50} 
    
}

var levels = [level0, level1]

function lvlCreate(level) {
    platforms=[]
    walls=[]
    myCam=new Camera()
    for (i = 0; i < level.platforms.length; i++) {
        platforms.push(new Platform(level.platforms[i].color, level.platforms[i].x, level.platforms[i].y, level.platforms[i].width, level.platforms[i].height));
    }
    for (i = 0; i < level.walls.length; i++) {
        walls.push(new Wall(level.walls[i].color, level.walls[i].x, level.walls[i].y, level.walls[i].width, level.walls[i].height));
    }
    winPlat=new Win(level.winPlat.x, level.winPlat.y, level.winPlat.width, level.winPlat.height);
    myChar=new Character(.66,1,7.92,12);

    return "ran";
}
lvlCreate(levels[levelnumber])

mainLoop()