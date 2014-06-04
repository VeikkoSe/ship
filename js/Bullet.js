var Bullet = function () {


    this.deathtime = 1500; //how long will the bullet travel
    this.reloadspeed = 1000; //ms
    this.speed = 500; //how fast the bullet is (ms)
    this.birthtime =null; //time of birth

    this.angle = 0; //angle of the bullet
    this.xPos = 0; //bullet x pos
    this.yPos = 0; // bullet y pos
    this.visible = 0; //if we draw the bullet
    this.bulletMesh = new Model('bigbullet');

};


Bullet.prototype.setBullet = function (time) {

    var timeNow = new Date().getTime();
    this.birthtime = time;
    this.visible = 1;


}

Bullet.prototype.moveBullet = function () {

    var timeNow = new Date().getTime();

    if (timeNow - this.deathtime > this.birthtime)
        this.visible = 0;


    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;
        this.elapsedTotal += elapsed;


        posX = this.bulletSpeed * ( elapsed / 1000.0 ) * Math.cos(this.degToRad(this.angle));
        posY = this.bulletSpeed * ( elapsed / 1000.0 ) * Math.sin(this.degToRad(this.angle));

        this.xPos += posX;
        this.yPos += posY;
        var screenWidth = 80; //worldcoordinates
        var screenHeight = 60; //worldcoordinates

        if (this.xPos > screenWidth) {
            this.xPos = -1 * screenWidth;
        }

        if (this.yPos > screenHeight) {
            this.yPos = -1 * screenHeight;
        }

        if (this.xPos < -1 * screenWidth) {
            this.bullets[i].xPos = screenWidth;
        }
        if (this.yPos < -1 * screenHeight) {
            this.yPos = screenHeight;
        }

        this.lastTime = timeNow;
    }
}

/*

 bool Luoti::Tarkistaosuma(Kone * vastustaja)
 {



 if(x>vastustaja->haex() && x<vastustaja->haex() +64
 && y>vastustaja->haey() && y<vastustaja->haey() +64)
 return true;
 else
 return false;
 }
 */