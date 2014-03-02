function Model(name) {

    this.name = name;
    this.vertices = null;
    this.texturecoordinates = [];
    this.normals = [];
    this.indices = [];
    this.xPos = 0;
    this.yPos = 0;

    this.rotation = 0;


    this.vertexPositionBuffer = gl.createBuffer();
    this.texturePositionBuffer = gl.createBuffer();
    this.indexPositionBuffer = gl.createBuffer();

    this.loadedImages = [];


}


Model.prototype.loadMesh = function () {


    var request = new XMLHttpRequest();
    request.open("GET", this.name + ".js", false);
    request.send();

    this.inputData(request.responseText);


};

Model.prototype.inputData = function (data) {


    var d = JSON.parse(data);

    this.vertices = d.vertices;
    this.texturecoordinates = d.texturecoordinates;
    this.indices = d.indices;


};


Model.prototype.buildBuffers = function () {

    /*
     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
     var vertices = [
     0.0,  1.0,  0.0,
     -1.0, -1.0,  0.0,
     1.0, -1.0,  0.0
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
     this.vertexPositionBuffer.itemSize = 3;
     this.vertexPositionBuffer.numItems = 3;
     */


    /*

     var that = this;
     this.texture.image = new Image();
     this.texture.image.src = this.name + ".png";
     */

//alert(this.name + ".png"

    //);
    //this.loadImages(this.name + ".png",this.handleLoadedTexture);
    /*
     var images = [this.name + '.png'];


     for(var i0;i<images.length-1;++--) {
     this.loadedImages[i] = new Image();
     this.loadedImages[i].src = images[i];
     this.loadedImages[i].onload = function() {

     s.numReadyImages++;
     };
     */


    // if(image!=undefined)
    //  this.handleLoadedTexture();


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = this.vertices.length / 3;


    gl.bindBuffer(gl.ARRAY_BUFFER, this.texturePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texturecoordinates), gl.STATIC_DRAW);
    this.texturePositionBuffer.itemSize = 2;
    this.texturePositionBuffer.numItems = this.texturecoordinates.length / 2;


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexPositionBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    this.indexPositionBuffer.itemSize = 1;
    this.indexPositionBuffer.numItems = this.indices.length;


};

/*
 Model.prototype.loadImage = function (url, callback) {

 var image = gl.createTexture();
 image.image = new Image();
 image.image.src = url;
 image.image.onload = callback;
 return image;

 };
 */


/*
 Model.prototype.loadImages = function(url, callback) {



 var onImageLoad = function() {

 callback(image);

 };



 var image = this.loadImage(url, onImageLoad);




 };




 Model.prototype.handleLoadedTexture = function(texture) {



 gl.bindTexture(gl.TEXTURE_2D, texture);
 gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
 gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
 gl.bindTexture(gl.TEXTURE_2D, null);
 numReadyImages = 1;


 };
 */