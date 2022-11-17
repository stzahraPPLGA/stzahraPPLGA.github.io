//Level 2
var myGamePiece;
var myBackground;
var myObstacles = [];

function startGame(){
    myGamePiece = new component(85, 80, "Shiroswim1,png", 100, 300, "image");
    myBackground = new component(1350, 600, "Sungai.png", 0, 0, "background");
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
        window.addEventListener('keydown', function (e){
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode]= true;
        })
        window.addEventListener('keyup', function (e){
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

function component(width, height, color, x, y, type){
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0;
    this.gravitySpeed = 0;

    this.update = function(){
        ctx =myGameArea.context;
        if(type == "image" || type == "background") {
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
        }
        var skyLimit = 0;
        if(this.y < skyLimit){
            this.y = skyLimit;
            this.gravitySpeed = 0;
        }
    }
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
    var x, size, i, random1, random2;
    for (i = 0; i < myObstacles.length; i += 1){
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            document.querySelector('#restart h2').innerHTML= "GAME OVER";
            return; 
        }
    }
    if(myGameArea.frameNo >= 5000){
        myGameArea.stop();
        document.querySelector('#restart h2').innerHTML = "YOU WIN";
        document.getElementById('restart').style.display='';
    }
    
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(500)) {
        if(myGameArea.frameNo < 800){
        x = myGameArea.canvas.width;
        size = Math.random()*(80-40)+40;
        i = Math.round(Math.random()*2+1);
        random1 = Math.floor(Math.random()*250);
        random2 = Math.floor(Math.random()*250+250);
        myObstacles.push(new component( 60, 40, "BATU.png", x, random1, "image"));
        myObstacles.push(new component( 60, 70, "BOTOL.png", x, random2, "image"));
        }
    }
    for (i = 0; i < myObstacles.length; i += 1){
        myObstacles[i].x += -3;
        myObstacles[i].update();
    }
    function everyinterval(n){
        if((myGameArea.frameNo / n) % 1 == 0){return true;}
        return false;
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    myGamePiece.image.src = "Shiroswim1.png";
    if (myGameArea.keys && myGameArea.keys [38])//keatas
    {myGamePiece.speedY = -6;
        myGamePiece.image.src = "Shiroswim1.png";}
    if (myGameArea.keys && myGameArea.keys [40])//kebawah
    {myGamePiece.speedY = 6;
        myGamePiece.image.src = "Shiroswim2.png";}
    myGamePiece.newPos();
    myGamePiece.update();
}
