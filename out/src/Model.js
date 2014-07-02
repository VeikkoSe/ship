var Model = function Model(name) {
  "use strict";
  this.name = name;
  this.vertices = null;
  this.texturecoordinates = [];
  this.normals = [];
  this.indices = [];
  this.xPos = 0;
  this.yPos = 0;
  this.ambient = null;
  this.diffuse = null;
  this.specular = null;
  this.rotation = 0;
  this.vertexPositionBuffer = gl.createBuffer();
  this.texturePositionBuffer = gl.createBuffer();
  this.indexPositionBuffer = gl.createBuffer();
  this.normalPositionBuffer = gl.createBuffer();
  this.loadedImages = [];
  this.loadMesh();
  var t = new Texture(this.name);
  this.texture = t.loadedTexture;
  this.textureLoaded = t.loaded;
};
($traceurRuntime.createClass)(Model, {
  loadMesh: function() {
    "use strict";
    var request = new XMLHttpRequest();
    request.open("GET", "resources/models/" + this.name + ".js", false);
    request.send();
    this.inputData(request.responseText);
    this.buildBuffers();
  },
  inputData: function(data) {
    "use strict";
    var d = JSON.parse(data);
    this.vertices = d.vertices;
    this.texturecoordinates = d.texturecoordinates;
    this.indices = d.indices;
    this.normals = this.createNormals(this.vertices, this.indices);
    this.ambient = d.ambient;
    this.diffuse = d.diffuse;
    this.specular = d.specular;
  },
  createNormals: function(vs, ind) {
    "use strict";
    var x = 0;
    var y = 1;
    var z = 2;
    var ns = [];
    for (var i = 0; i < vs.length; i++) {
      $traceurRuntime.setProperty(ns, i, 0.0);
    }
    for (var i = 0; i < ind.length; i = i + 3) {
      var v1 = [];
      var v2 = [];
      var normal = [];
      $traceurRuntime.setProperty(v1, x, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + x)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i)] + x)]);
      $traceurRuntime.setProperty(v1, y, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + y)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i)] + y)]);
      $traceurRuntime.setProperty(v1, z, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + z)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i)] + z)]);
      $traceurRuntime.setProperty(v2, x, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 2)] + x)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + x)]);
      $traceurRuntime.setProperty(v2, y, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 2)] + y)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + y)]);
      $traceurRuntime.setProperty(v2, z, vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 2)] + z)] - vs[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + 1)] + z)]);
      $traceurRuntime.setProperty(normal, x, v1[$traceurRuntime.toProperty(y)] * v2[$traceurRuntime.toProperty(z)] - v1[$traceurRuntime.toProperty(z)] * v2[$traceurRuntime.toProperty(y)]);
      $traceurRuntime.setProperty(normal, y, v1[$traceurRuntime.toProperty(z)] * v2[$traceurRuntime.toProperty(x)] - v1[$traceurRuntime.toProperty(x)] * v2[$traceurRuntime.toProperty(z)]);
      $traceurRuntime.setProperty(normal, z, v1[$traceurRuntime.toProperty(x)] * v2[$traceurRuntime.toProperty(y)] - v1[$traceurRuntime.toProperty(y)] * v2[$traceurRuntime.toProperty(x)]);
      for (var j = 0; j < 3; j++) {
        $traceurRuntime.setProperty(ns, 3 * ind[$traceurRuntime.toProperty(i + j)] + x, ns[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + j)] + x)] + normal[$traceurRuntime.toProperty(x)]);
        $traceurRuntime.setProperty(ns, 3 * ind[$traceurRuntime.toProperty(i + j)] + y, ns[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + j)] + y)] + normal[$traceurRuntime.toProperty(y)]);
        $traceurRuntime.setProperty(ns, 3 * ind[$traceurRuntime.toProperty(i + j)] + z, ns[$traceurRuntime.toProperty(3 * ind[$traceurRuntime.toProperty(i + j)] + z)] + normal[$traceurRuntime.toProperty(z)]);
      }
    }
    for (var i = 0; i < vs.length; i = i + 3) {
      var nn = [];
      $traceurRuntime.setProperty(nn, x, ns[$traceurRuntime.toProperty(i + x)]);
      $traceurRuntime.setProperty(nn, y, ns[$traceurRuntime.toProperty(i + y)]);
      $traceurRuntime.setProperty(nn, z, ns[$traceurRuntime.toProperty(i + z)]);
      var len = Math.sqrt((nn[$traceurRuntime.toProperty(x)] * nn[$traceurRuntime.toProperty(x)]) + (nn[$traceurRuntime.toProperty(y)] * nn[$traceurRuntime.toProperty(y)]) + (nn[$traceurRuntime.toProperty(z)] * nn[$traceurRuntime.toProperty(z)]));
      if (len == 0)
        len = 0.00001;
      $traceurRuntime.setProperty(nn, x, nn[$traceurRuntime.toProperty(x)] / len);
      $traceurRuntime.setProperty(nn, y, nn[$traceurRuntime.toProperty(y)] / len);
      $traceurRuntime.setProperty(nn, z, nn[$traceurRuntime.toProperty(z)] / len);
      $traceurRuntime.setProperty(ns, i + x, nn[$traceurRuntime.toProperty(x)]);
      $traceurRuntime.setProperty(ns, i + y, nn[$traceurRuntime.toProperty(y)]);
      $traceurRuntime.setProperty(ns, i + z, nn[$traceurRuntime.toProperty(z)]);
    }
    return ns;
  },
  buildBuffers: function() {
    "use strict";
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
    if (this.normals.length > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalPositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
      this.normalPositionBuffer.itemSize = 1;
      this.normalPositionBuffer.numItems = this.normals.length / 3;
    }
  }
}, {});
