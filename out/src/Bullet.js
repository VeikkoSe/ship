var Bullet = function Bullet() {
  "use strict";
  this.birthTime = null;
  this.angle = 0;
  this.xPos = 0;
  this.yPos = 0;
  this.visible = 0;
  this.bulletModel = null;
  this.speed = 150;
  this.deathtime = 1500;
};
($traceurRuntime.createClass)(Bullet, {}, {});
