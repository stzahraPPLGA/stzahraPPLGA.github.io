var myGamePiece;
var myBackground;

var myObstacles = []; 
var myScore;//rev

function startGame(){
    myGamePiece = new component(75, 55, "Shirojalan.png", 80, 450, "image");
    myBackground = new component(1350, 600, "DalamHutan.png", 0, 0, "image");
    //rev
    myScore = new component("50px", "Courier New", "white", 1030, 50, "text")
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
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    //this.bounce = 0.5;
    this.update = function() {
        ctx = myGameArea.context;
        if(this.type == "text"){ //rev
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } //rev
        if(type == "image"){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }  
    }
    this.newPos = function(){
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if(this.type == "image"){
            if(this.x == (this.width)){
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
            // this.gravitySpeed = -(this.gravitySpeed * this.bounce);
        }
        var skyLimit = 0;
        if (this.y < skyLimit) {
            this.y = skyLimit;
            this.gravitySpeed = 0.2
        }
    }
    //rev
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
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea(){
    //rev
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    //if (myGameArea.frameNo == 1000){
    myGameArea.clear();
    myBackground.newPos();
    myBackground.update();
    //rev
    myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(500)) {
            x = myGameArea.canvas.width;
            minHeight = 300;
            maxHeight = 200;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 200;
            maxGap = 300;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            myObstacles.push(new component(50, x - height - gap, "Batangpohon.png", x, height + gap, "image")); 
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }
    function everyinterval(n) {
        if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
        return false;
    }
    //rev
    myScore.text="SCORE:" + myGameArea.frameNo;
    myScore.update();
    //rev
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

