var ActionMapper = function ActionMapper() {
  "use strict";
  this.shooting = null;
};
($traceurRuntime.createClass)(ActionMapper, {
  handleKeyDown: function(event) {
    "use strict";
    $traceurRuntime.setProperty(currentlyPressedKeys, event.keyCode, true);
  },
  handleKeyUp: function(event) {
    "use strict";
    $traceurRuntime.setProperty(currentlyPressedKeys, event.keyCode, false);
  },
  handleKeys: function(elapsed) {
    "use strict";
    if (currentlyPressedKeys[38]) {
      game.stateEngine.gameState.ship.setAccelerationOn(elapsed);
    }
    if (currentlyPressedKeys[40]) {}
    if (currentlyPressedKeys[37]) {
      game.stateEngine.gameState.ship.rotateShipLeft(elapsed);
    }
    if (currentlyPressedKeys[39]) {
      game.stateEngine.gameState.ship.rotateShipRight(elapsed);
    }
    if (currentlyPressedKeys[32]) {
      game.stateEngine.gameState.gun.shootBullet(elapsed);
    }
  }
}, {});
