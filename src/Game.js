class Game {
    constructor(canvas) {

        this.running = true;

        this.stateEngine = null;
        this.init(canvas);
        this.initGL(canvas);
    }

    init(canvas) {

        this.initGL(canvas);
        this.stateEngine = new StateEngine();
        //this.stateEngine.changeState("gamestate");
        this.stateEngine.changeState("initstate");

        this.tick();
        //this.stateEngine.draw();


    }

    tick() {

        var that = this;
        requestAnimFrame(function () {
            that.tick()
        });


        //this.stateEngine.currentState.tick();
        this.stateEngine.currentState.animate();
        this.stateEngine.currentState.drawScene();


    }


    initGL(canvas) {
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
}