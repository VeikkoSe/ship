class GameState extends StateEngine {

    constructor(canvas) {

        //super();

        this.asteroids = null;
        this.ship = null;
        this.sun = null;
        this.gun = null;
        this.particles = null;
        this.background = null;
        this.actionMapper = null;
        this.lastTime = 0;
        this.mvMatrixStack = [];
        this.mvMatrix = mat4.create();
        this.pMatrix = mat4.create();
        this.frameCount = 0;
        this.xRot = 0;
        this.pTexture = null;

        this.actionMapper = new ActionMapper();



    }

    init() {

        particleProgram = initParticleShaders("particle");
        shaderProgram = initShaders("per-fragment-lighting");

        gl.enable(gl.CULL_FACE);

        document.onkeydown = this.actionMapper.handleKeyDown;
        document.onkeyup = this.actionMapper.handleKeyUp;


        this.ship = new Ship();
        this.gun = new Gun();
        this.asteroids = new Asteroids(2);
        this.background = new Model('background');
        this.sun = new Model('asteroid');
        this.particles = new Particles('asteroid');

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        //gl.enable(0x8642);

    }


    simpleWorldToViewX(x) {
        return  x / screenWidth;
    }

    simpleWorldToViewY(y) {

        return  y / screenHeight;
    }
    animate() {
        var timeNow = new Date().getTime();
        this.frameCount++;
        if (this.lastTime != 0) {
            var elapsed = timeNow - this.lastTime;
            this.elapsedTotal += elapsed;
            this.xRot += (90 * elapsed) / 2000.0;

            this.actionMapper.handleKeys(elapsed);

            var posX = 0;
            var posY = 0;

            for (var i = 0; i < this.particles.asteroidExplosion.length; i++) {
                if(this.particles.asteroidExplosion[i].time>5)
                    this.particles.asteroidExplosion.splice(i,1);
                else {
                    this.particles.asteroidExplosion[i].time += elapsed / 3000;
                }
            }

            for (var i = 0; i < this.ship.engineSmoke.length; i++) {
                if(this.ship.engineSmoke[i].time>5)
                    this.ship.engineSmoke.splice(i,1);
                else {
                    this.ship.engineSmoke[i].time += elapsed / 3000;
                }
            }


            this.asteroids.move(elapsed);
            this.ship.move(elapsed);

            this.gun.moveAmmo();
            this.gun.checkHit();
            this.ship.checkHit();


        }

        this.lastTime = timeNow;

    }


    degToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    drawShip() {

        //draw ship

        if (this.ship.visible == 1) {

            this.mvPushMatrix();


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

    drawBackground() {
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

    drawBullets() {
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

    drawSun2() {


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

    drawSun() {


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

    drawAsteroids() {

        for (var i = 0; i < this.asteroids.asteroids.length; i++) {
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




        gl.useProgram(shaderProgram);
        mat4.translate(this.mvMatrix, [0.0, 0.0, -150.0]);

        this.drawBackground();


        this.drawAsteroids();
        //this.drawSun();

        this.drawBullets();
        this.drawShip();
        gl.useProgram(particleProgram);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        this.drawAsteroidExplosion();

        this.drawSmokeTrail();
        gl.disable(gl.BLEND);

    }

    drawAsteroidExplosion() {





        for (var i = 0; i < this.particles.asteroidExplosion.length; i++) {
            this.mvPushMatrix();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.particles.asteroidExplosion[i].pointLifetimeBuffer);
            gl.vertexAttribPointer(particleProgram.pointLifetimeAttribute, this.particles.asteroidExplosion[i].pointLifetimeBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.particles.asteroidExplosion[i].pointStartPositionsBuffer);
            gl.vertexAttribPointer(particleProgram.pointStartPositionAttribute, this.particles.asteroidExplosion[i].pointStartPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.particles.asteroidExplosion[i].pointEndPositionsBuffer);
            gl.vertexAttribPointer(particleProgram.pointEndPositionAttribute, this.particles.asteroidExplosion[i].pointEndPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);




            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.particles.asteroidTexture);
            gl.uniform1i(particleProgram.samplerUniform, 0);


            //alert(this.particles.asteroidExplosion[i].yPos);
            gl.uniform3f(particleProgram.centerPositionUniform, this.simpleWorldToViewX(this.particles.asteroidExplosion[i].xPos), this.simpleWorldToViewY(this.particles.asteroidExplosion[i].yPos), 0);
            gl.uniform4f(particleProgram.colorUniform, 1, 0.5, 0.1, 0.7);
            gl.uniform1f(particleProgram.timeUniform, this.particles.asteroidExplosion[i].time);

            gl.drawArrays(gl.POINTS, 0, this.particles.asteroidExplosion[i].pointLifetimeBuffer.numItems);
            this.mvPopMatrix();
        }



    }

    drawSmokeTrail() {





        for (var i = 0; i < this.ship.engineSmoke.length; i++) {
            this.mvPushMatrix();

            gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.engineSmoke[i].pointLifetimeBuffer);
            gl.vertexAttribPointer(particleProgram.pointLifetimeAttribute, this.ship.engineSmoke[i].pointLifetimeBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.engineSmoke[i].pointStartPositionsBuffer);
            gl.vertexAttribPointer(particleProgram.pointStartPositionAttribute, this.ship.engineSmoke[i].pointStartPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.ship.engineSmoke[i].pointEndPositionsBuffer);
            gl.vertexAttribPointer(particleProgram.pointEndPositionAttribute, this.ship.engineSmoke[i].pointEndPositionsBuffer.itemSize, gl.FLOAT, false, 0, 0);




            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.ship.smokeTexture);
            gl.uniform1i(particleProgram.samplerUniform, 0);


            //alert(this.particles.asteroidExplosion[i].yPos);
            gl.uniform3f(particleProgram.centerPositionUniform, this.simpleWorldToViewX(this.ship.engineSmoke[i].xPos), this.simpleWorldToViewY(this.ship.engineSmoke[i].yPos), 0);
            gl.uniform4f(particleProgram.colorUniform, 1, 1, 1, 0.7);
            gl.uniform1f(particleProgram.timeUniform, this.ship.engineSmoke[i].time);

            gl.drawArrays(gl.POINTS, 0, this.ship.engineSmoke[i].pointLifetimeBuffer.numItems);
            this.mvPopMatrix();
        }



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

;


    mvPopMatrix() {
        if (this.mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        this.mvMatrix = this.mvMatrixStack.pop();
    }


}