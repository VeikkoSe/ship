var ActionMapper = function() {

    this.currentlyPressedKeys = {};
    this.shooting = null;

}





ActionMapper.prototype.handleKeyDown =  function(event) {
    this.currentlyPressedKeys[event.keyCode] = true;

}


ActionMapper.prototype.handleKeyUp = function (event) {
    this.currentlyPressedKeys[event.keyCode] = false;
}


ActionMapper.prototype.handleKeys = function () {
    this.shooting = 0;

    if (this.currentlyPressedKeys[38]) {
        alert('w');
        // Up cursor key
        this.shooting = 1;
    }

}

ActionMapper.prototype.initGL = function (canvas) {
    try {
        //gl = canvas.getContext("webgl");
        gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
        //gl = WebGLDebugUtils.makeDebugContext(gl, undefined, logGLCall);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {

    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }


}





