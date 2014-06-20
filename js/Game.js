var Game = function (name) {


    //this.asteroids = [];
    this.asteroids = null;
    this.ship = null;
    this.sun = null;
    this.gun = null;

    this.xRot = 0;


    this.lastTime = 0;
    this.mvMatrixStack = [];
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.frameCount = 0;
    this.elapsedTotal = 0;
    this.background = null;


    this.actionMapper = null;
    this.pointEndPositionsBuffer;
    this.pointLifetimeBuffer;
    this.pointStartPositionsBuffer;
    //this.time = 0;
    //this.centerPos = 0;
    //this.color = 0;

}

Game.prototype.animate = function () {
    var timeNow = new Date().getTime();
    this.frameCount++;
    if (this.lastTime != 0) {
        var elapsed = timeNow - this.lastTime;
        this.elapsedTotal += elapsed;
        this.xRot += (90 * elapsed) / 2000.0;

        this.actionMapper.handleKeys(elapsed);

        var posX = 0;
        var posY = 0;

        this.time += elapsed / 3000;




        lastTime = timeNow;


        this.asteroids.move(elapsed);
        this.ship.move(elapsed);

        this.gun.moveAmmo();
        this.gun.checkHit();
        this.ship.checkHit();


        if (this.elapsedTotal >= 1000) {
            var fps = this.frameCount;
            this.frameCount = 0;
            this.elapsedTotal -= 1000;

            //if (fps < 59)
            // document.getElementById('fps').style.color = 'red';
            //else
            // document.getElementById('fps').style.color = 'green';
            //document.getElementById('fps').innerHTML = fps;
        }
    }


    if (this.time >= 1.0) {
        this.time = 0;
        this.centerPos = [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5];
        this.color = [Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, Math.random() / 2 + 0.5, 0.5];
        this.startParticles();
    }
    this.lastTime = timeNow;
}


Game.prototype.tick = function () {

    var that = this;
    requestAnimFrame(function () {
        that.tick()
    });


    this.animate();
    this.drawScene();
}


Game.prototype.degToRad = function (degrees) {
    return degrees * Math.PI / 180;
}

Game.prototype.drawShip = function () {
    //draw ship

    if (this.ship.visible == 1) {

        this.mvPushMatrix();
        //

        // mat4.translate(this.mvMatrix, [0, 0, 0]);
        mat4.translate(this.mvMatrix, [this.ship.xPos, this.ship.yPos, 0]);
        mat4.rotate(this.mvMatrix, this.degToRad(-90), [0, 1, 0]);
        mat4.rotate(this.mvMatrix, this.degToRad(-90), [1, 0, 0]);
        //$('#debugarea').html(this.ship.angle);
        mat4.rotate(this.mvMatrix, this.degToRad(this.ship.angle), [1, 0, 0]);

        gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.shipModel.vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.shipModel.normalPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


        gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.shipModel.texturePositionBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.ship.shipModel.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ship.shipModel.indexPositionBuffer);

        this.setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, this.ship.shipModel.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        // gl.disable(gl.BLEND);
        this.mvPopMatrix();
    }
}

Game.prototype.drawBackground = function () {
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


Game.prototype.drawBullets = function () {
    //draw bullets

    gl.uniform1i(shaderProgram.useLightingUniform, false);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1f(shaderProgram.alphaUniform, 1);


    for (var i = 0; i < this.gun.bulletsAmount; i++) {
        if (this.gun.bullets[i].visible == 1) {

            this.mvPushMatrix();

            mat4.translate(this.mvMatrix, [this.gun.bullets[i].xPos, this.gun.bullets[i].yPos, 0]);

            gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);


            gl.bindBuffer(gl.ARRAY_BUFFER, this.gun.bullets[i].bulletModel.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);


            gl.bindBuffer(gl.ARRAY_BUFFER, this.gun.bullets[i].bulletModel.normalPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


            gl.bindBuffer(gl.ARRAY_BUFFER, this.gun.bullets[i].bulletModel.texturePositionBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);


            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, this.gun.bullets[i].bulletModel.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.gun.bullets[i].bulletModel.indexPositionBuffer);
            this.setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, this.gun.bullets[i].bulletModel.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);


            this.mvPopMatrix();
        }
    }

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.uniform1i(shaderProgram.useLightingUniform, true);


}


Game.prototype.drawSun2 = function () {


    this.mvPushMatrix();


    mat4.translate(this.mvMatrix, [0, 0, 0]);
    mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);
    //mat4.scale(this.mvMatrix,[5, 5,5]);

    gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);

    //textures are in global variable and we just get it by index after ship and bullet
    gl.bindTexture(gl.TEXTURE_2D, this.sun.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sun.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.sun.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();


}


Game.prototype.drawSun = function () {


    this.mvPushMatrix();

    var x = $('#slider-x').slider("value");
    var y = $('#slider-y').slider("value");
    var z = $('#slider-z').slider("value");

    mat4.translate(this.mvMatrix, [x, y, z]);

    mat4.scale(this.mvMatrix, [5, 5, 5]);

    gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.normalPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.sun.texturePositionBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);

    //textures are in global variable and we just get it by index after ship and bullet
    gl.bindTexture(gl.TEXTURE_2D, this.sun.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sun.indexPositionBuffer);
    this.setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, this.sun.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    this.mvPopMatrix();


}


Game.prototype.drawAsteroids = function () {

    for (var i = 0; i < this.asteroids.amount; i++) {
        if (this.asteroids.asteroids[i].visible == 1) {

            this.mvPushMatrix();
            mat4.translate(this.mvMatrix, [this.asteroids.asteroids[i].xPos, this.asteroids.asteroids[i].yPos, 0]);
            mat4.scale(this.mvMatrix, [4, 4, 4]);
            mat4.rotate(this.mvMatrix, this.degToRad(this.xRot), [1, 1, 1]);


            gl.uniform1f(shaderProgram.uMaterialShininess, 200.0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids.asteroids[i].model.vertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids.asteroids[i].model.texturePositionBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.asteroids.asteroids[i].model.normalPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.aVertexNormal, 3, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            //textures are in global variable and we just get it by index after ship and bullet
            gl.bindTexture(gl.TEXTURE_2D, this.asteroids.asteroids[i].model.texture);
            gl.uniform1i(shaderProgram.samplerUniform, 0);


            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.asteroids.asteroids[i].model.indexPositionBuffer);

            this.setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, this.asteroids.asteroids[i].model.indexPositionBuffer.numItems, gl.UNSIGNED_SHORT, 0);

            this.mvPopMatrix();
        }
    }

}


Game.prototype.drawScene = function () {


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

    gl.useProgram(shaderProgram);
    mat4.translate(this.mvMatrix, [0.0, 0.0, -100.0]);

    this.drawBackground();
    this.drawShip();

    this.drawAsteroids();
    this.drawSun();

    this.drawBullets();

    gl.useProgram(particleProgram);

    this.drawAsteroidExplosion();


}

Game.prototype.startParticles = function () {

    var numParticles = 1000;

    lifetimes = [];
    startPositions = [];
    endPositions = [];
    for (var i = 0; i < numParticles; i++) {
        lifetimes.push(Math.random());

        startPositions.push((Math.random() * 0.25) - 0.125);
        startPositions.push((Math.random() * 0.25) - 0.125);
        startPositions.push((Math.random() * 0.25) - 0.125);

        endPositions.push((Math.random() * 2) - 1);
        endPositions.push((Math.random() * 2) - 1);
        endPositions.push((Math.random() * 2) - 1);
    }

    this.pointLifetimeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifetimeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
    this.pointLifetimeBuffer.itemSize = 1;
    this.pointLifetimeBuffer.numItems = numParticles;

    this.pointStartPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startPositions), gl.STATIC_DRAW);
    this.pointStartPositionsBuffer.itemSize = 3;
    this.pointStartPositionsBuffer.numItems = numParticles;

    this.pointEndPositionsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endPositions), gl.STATIC_DRAW);
    this.pointEndPositionsBuffer.itemSize = 3;
    this.pointEndPositionsBuffer.numItems = numParticles;

}

Game.prototype.drawAsteroidExplosion = function () {

    this.mvPushMatrix();


    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifetimeBuffer);
    gl.vertexAttribPointer(particleProgram.pointLifetimeAttribute, this.pointLifetimeBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartPositionsBuffer);
    gl.vertexAttribPointer(particleProgram.pointStartPositionAttribute, this.pointStartPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndPositionsBuffer);
    gl.vertexAttribPointer(particleProgram.pointEndPositionAttribute, this.pointEndPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.uniform3f(particleProgram.centerPositionUniform, 0, 0, 0);
    //gl.uniform4f(particleProgram.colorUniform, this.color[0], this.color[1], this.color[2], this.color[3]);
    gl.uniform1f(particleProgram.timeUniform, this.time);

    gl.drawArrays(gl.POINTS, 0, this.pointLifetimeBuffer.numItems);


    this.mvPopMatrix();


}


Game.prototype.setMatrixUniforms = function () {
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, this.pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, this.mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.uNMatrix, false, normalMatrix);


}


Game.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
};

Game.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();

}




Game.prototype.init = function (canvas) {
    this.initGL(canvas);

    this.startParticles();


    particleProgram = initParticleShaders("particle");
    shaderProgram = initShaders("per-fragment-lighting");

    gl.enable(gl.CULL_FACE);


    //gl.enable(gl.DEPTH_TEST);

    this.actionMapper = new ActionMapper();


    this.ship = new Ship();
    this.gun = new Gun();
    this.asteroids = new Asteroids(10);

    this.background = new Model('background');


    this.sun = new Model('asteroid');





    gl.clearColor(0.0, 0.0, 0.0, 1.0);


    this.tick();


}


Game.prototype.initGL = function (canvas) {
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





