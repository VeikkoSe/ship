var Bullet = function () {

    this.birthTime = null; //time of birth
    this.reloadspeed = 1000; //ms
    this.angle = 0; //angle of the bullet
    this.xPos = 0; //bullet x pos
    this.yPos = 0; // bullet y pos
    this.visible = 0; //if we draw the bullet
    this.bulletModel = new Model('bigbullet');
    this.speed = 59; //how fast the bullet is (ms)
    this.deathtime = 1500; //how long will the bullet travel

};

