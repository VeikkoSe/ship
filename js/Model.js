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
    this.normalPositionBuffer = gl.createBuffer();


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
    if(typeof d.indices !== 'undefined')
      this.indices = d.indices;
    if(typeof d.normals !== 'undefined')
      this.normals = d.normals;


};


Model.prototype.buildBuffers = function () {



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

    if(this.normals.length>0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        this.normalPositionBuffer.itemSize = 1;
        this.normalPositionBuffer.numItems = this.normals.length/3;
    }
};
