class Bullet {
    constructor() {
        this.birthTime = null;
        this.angle = 0;
        this.xPos = 0;
        this.yPos = 0;
        this.visible = 0;
        this.bulletModel = new Model('bigbullet');
        this.speed = 150;
        this.deathtime = 1500;

    }
}
