class EndState extends StateEngine {

    constructor(canvas) {

        //super();


        this.background = null;

        this.lastTime = 0;
        this.mvMatrixStack = [];
        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();
        this.frameCount = 0;


    }

    cleanup() {
        document.onkeydown = null;
        document.onkeyup = null;
    }

    init() {

        //particleProgram = initParticleShaders("particle");
        shaderProgram = initShaders("per-fragment-lighting");

        gl.enable(gl.CULL_FACE);


        this.background = new Model('end');


        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        this.tick();

        document.onkeydown = this.handleKeyDown;
        document.onkeyup = this.handleKeyUp;
        printMessage("<h1>You destroyed "+game.shotAsteroids +" asteroids</h1>")

    }

    handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;

        //if (currentlyPressedKeys[13]) {
        //currentlyPressedKeys[13] = false;
        //game.stateEngine.changeState("gamestate")
        //}
    }

    handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    animate() {


    }

    tick() {

        var that = this;
        requestAnimFrame(function () {
            that.tick()
        });


        //this.animate();
        this.drawScene();
    }


    drawEnd() {

        //draw background
        this.mvPushMatrix();

        mat4.translate(this.mvMatrix, [0, 0, -10]);
        mat4.scale(this.mvMatrix, [0.219, 0.212, 0.212]);

        gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.background.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.background.normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.background.texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);


        gl.bindTexture(gl.TEXTURE_2D, this.background.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.background.indexPositionBuffer);
        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.background.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        this.mvPopMatrix();

    }


    drawScene() {

        gl.useProgram(shaderProgram);

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1i(shaderProgram.useLightingUniform, true);
        gl.uniform1f(shaderProgram.alphaUniform, 1);
        mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, this.pMatrix);
        gl.disable(gl.DEPTH_TEST);

        //Light uniforms
        var x = $('#slider-x').slider("value");
        var y = $('#slider-y').slider("value");
        var z = $('#slider-z').slider("value");

        gl.uniform3f(shaderProgram.uLightPosition, x, y, z);
        gl.uniform3f(shaderProgram.uLightAmbient, 0, 0, 0);
        gl.uniform3f(shaderProgram.uLightDiffuse, 0.8, 0.8, 0.8);
        gl.uniform3f(shaderProgram.uLightSpecular, 0.8, 0.8, 0.8);


        gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);

        mat4.identity(this.mvMatrix);


        //blending
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        //gl.enable(gl.BLEND);

        //gl.uniform1f(shaderProgram.alphaUniform, parseFloat(1));

        //gl.uniform1i(shaderProgram.useLightingUniform, true);

        //gl.useProgram(shaderProgram);
        mat4.translate(this.mvMatrix, [0.0, 0.0, -100.0]);

        this.drawEnd();


    }


    setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, this.pMatrix);
        gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, this.mvMatrix);

        var normalMatrix = mat3.create();
        mat4.toInverseMat3(this.mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.uNMatrix, false, normalMatrix);
    }


    mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(this.mvMatrix, copy);
        this.mvMatrixStack.push(copy);
    }


    mvPopMatrix() {
        if (this.mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    }


}