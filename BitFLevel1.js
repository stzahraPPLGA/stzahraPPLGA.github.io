//Level 1
var myGamePiece; //game character
var myBackground; //background
var myObstacles = []; //rintangan
var myScore; //score game
var mySound; //suara game over
var myMusic; //menambahkan musik selama bermain

function startGame(){
    myGamePiece = new component(75, 55, "", 80, 450, "image");
    myBackground = new component(1350, 600, "DalamHutan.png", 0, 0, "background");
    myScore = new component("50px", "Courier New", "white", 1030, 50, "text");
    mySound = new sound("Gameoversound.mp3", "audio");
    myMusic = new sound("backsound_rainyday.mp3", "audio");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function(){
        this.canvas.width = 1350;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        //setting game keyboard
        window.addEventListener('keydown', function (e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function(e){
            myGameArea.keys[e.keyCode]= false;
        })
    },
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
        document.getElementById('restart').style.display = "";
        document.getElementById('skor').innerHTML = this.frameNo;
    }
}

function component(width, height, color, x, y, type) {
    this.type = type; 
    if (type == "image" || type == "background"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;

    this.update = function() {
        ctx = myGameArea.context;
        //component untuk text score game
        if(this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
        if(type == "image" || type == "background"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height); 
        if (type == "background") {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }  
    }
    this.newPos = function(){
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(this.type == "background"){
            if(this.x == -(this.width)){
                this.x = 0;
            }
        }
        this.hitBottom();
    }
    this.hitBottom = function(){
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom){
            this.y = rockbottom;
            this.gravitySpeed = 0;
            //component untuk tdk menembus ke atas
        }
        var skyLimit = 0;
        if (this.y < skyLimit) {
            this.y = skyLimit;
            this.gravitySpeed = 0.2;
            //component untuk tdk menembus ke bawah
        }
    }
    //component saat terkena rintangan bisa terhenti
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea(){
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    myMusic.play();
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            document.querySelector('#restart h2').innerHTML= "GAME OVER";
            return;
        }
    }
    if(myGameArea.frameNo >= 2500){
        myGameArea.stop();
        document.querySelector('#restart h2').innerHTML = "YOU WIN";
        document.getElementById('restart').style.display='';
    }

    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(180)){
        if(myGameArea.frameNo < 2000){
        x = myGameArea.canvas.width;
        minHeight = 300;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 200;
        maxGap = 300;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(100, gap, "Ranting.png", x, 5, "image"));
        myObstacles.push(new component(50, x - height - gap, "Batangpohon.png", x, height + gap, "image"));
        }
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -3;
        myObstacles[i].update();
    }
    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
    }
    myScore.text = "SCORE:" + myGameArea.frameNo;
    myScore.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGamePiece.image.src = "Shirojalan1.png"
    if (myGameArea.keys && myGameArea.keys [37] )
    {myGamePiece.speedX = -6;
        myGamePiece.image.src = "Shirodown2.png"} //ke kiri
    if (myGameArea.keys && myGameArea.keys [39])
    {myGamePiece.speedX = 6;
        myGamePiece.image.src = "Shirodown1.png"} //ke kanan
    if (myGameArea.keys && myGameArea.keys [38])
    {myGamePiece.speedY = -10;
        myGamePiece.image.src = "Shiroup.png";} //ke atas
    if (myGameArea.keys && myGameArea.keys[40])
    {myGamePiece.speedY = 1;
        myGamePiece.image.src = "Shirodown1.png";} // ke bawah
    myGamePiece.newPos();
    myGamePiece.update();
}
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
