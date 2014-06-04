var Ship = function () {

    this.xPos;
    this.yPos;
    this.angle;
    this.speed;


    this.turnspeed;
    this.lastFireTime;

    this.xPos = 0;
    this.yPos = 0;
    this.angle = 90;
    this.turnspeed = 350;
    this.speed = 250;
    this.lastFireTime = 0;


}


Ship.prototype.turnShip = function () {


    var timeNow = new Date().getTime();


    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;


        if (xPos <= 80) {
            xPos = 80;
        }
        else if (x >= 80) {
            xPos = 0;
        }
        if (yPos <= 0) {
            yPos = 80;
        }
        else if (yPos >= 80) {
            yPos = 0;
        }


        posX = this.asteroidSpeed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.angle));
        posY = this.bulletSpeed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.angle));
        this.xPos += posX;
        this.yPos += posY;


        this.lastTime = timeNow;
    }

}
