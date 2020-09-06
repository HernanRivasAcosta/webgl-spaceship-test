class Model
{
  //============================================================================
  // Static utils
  //============================================================================
  static _modelCache = {};

  // TODO: This default colour is only for testing
  static fromObj(name, data, colour = [0.9, 0.2, 0.2])
  {
    if (!this._modelCache[name])
      this.cache(name, data);
    let cachedModel = this._modelCache[name];
    return new Model(name, cachedModel, colour);
  }

  static cache(name, data)
  {
    this._modelCache[name] = this._parseModel(data);
  }

  // Debug only
  static flushCache()
  {
    this._modelCache = {};
  }

  //============================================================================
  // Getters/setters
  //============================================================================
  get name() { return this._name; }
  get size() { return this._size; }

  //============================================================================
  // API
  //============================================================================
  constructor(name, vertices = null, colour = null)
  {
    this._name = name;

    if (vertices)
    {
      // Divide by 3 because each vertex is 3 numbers
      this._size = vertices.length / 3;
      this._vertices = vertices;
      this._generateColours(colour);
      this._generateBaryocentricCoordinates();
    }
    else
    {
      this._size = -1;
      this._colours = null;
      this._vertices = null;
      this._bCoordinates = null;
    }

    this._positionBuffer = null;
    this._barycenterBuffer = null;
    this._colourBuffer = null;
    this._indexBuffer = null;
  }

  bindBuffers(gl)
  {
    // Create and bind the buffers
    this._positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertices, gl.STATIC_DRAW);

    this._barycenterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._barycenterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._bCoordinates, gl.STATIC_DRAW);

    this._colourBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._colourBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._colours, gl.STATIC_DRAW);

    this._indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    let indexData = new Uint16Array(seq(0, this._size));
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);

    this._colours = null;
    //this._vertices = null;
    this._bCoordinates = null;

    // Return the buffer object
    return {position:   this._positionBuffer,
            barycenter: this._barycenterBuffer,
            colour:     this._colourBuffer,
            index:      this._indexBuffer};
  }

  unbindBuffers(gl)
  {
    gl.deleteBuffer(this._positionBuffer);
    gl.deleteBuffer(this._barycenterBuffer);
    gl.deleteBuffer(this._colourBuffer);
    gl.deleteBuffer(this._indexBuffer);

    this._positionBuffer = null;
    this._barycenterBuffer = null;
    this._colourBuffer = null;
    this._indexBuffer = null;
  }

  //============================================================================
  // Internal functions
  //============================================================================
  _initVertices(size, colour = null, autoBuildBCoordinates = true)
  {
    this._size = size;
    this._vertices = new Float32Array(this._size * 3);

    let l;
    if (colour)
      this._generateColours(colour);
    else
      this._colours = new Float32Array(this._size * 3);

    if (autoBuildBCoordinates)
      this._generateBaryocentricCoordinates();
    else
      this._bCoordinates = new Float32Array(this._size * 3);
  }

  _generateColours(colour)
  {
    this._colours = new Float32Array(this._size * 3);
    let l = this._size * 3;
    for (let i = 0; i < l; i += 3)
      this._colours.set(colour, i);
  }

  _generateBaryocentricCoordinates()
  {
    this._bCoordinates = new Float32Array(this._size * 3);
    let l = this._size * 3;
    for (let i = 0; i < l; i += 18)
    {
      this._bCoordinates.set([1.0, 0.0, 0.0,
                              1.0, 1.0, 0.0,
                              0.0, 0.0, 1.0,
                              1.0, 0.0, 0.0,
                              0.0, 1.0, 1.0,
                              0.0, 0.0, 1.0], i);
    }
  }

  static _parseModel(data)
  {
    // Create the temporary variables to store the data
    let v = []; // vertices
    let f = []; // faces
    // Loop over every line of the obj file
    let lines = data.split('\n');
    let l = lines.length;
    for (let i = 0; i < l; i++)
    {
      let parts = lines[i].split(' ');
      let k = parts.shift();
      if (k == 'v')
      {
        // This is a vertex
        // TODO: The models are tiny, once they are properly sized, remove this
        v[v.length] = parts.map(s => parseFloat(s) * 150);
      }
      else if (k == 'f')
      {
        f[f.length] = parts.map(s => s.split('/')[0] - 1);
      }
    }

    l = f.length;
    // 2 tris per quad, 3 vertices per tri, l number of quads, and 3 components
    let r = new Float32Array(2 * 3 * l * 3);
    for (let i = 0; i < l; i++)
    {
      // Needs to be drawn in a specific order matching the default baryocentric
      // coordinates
      // TODO: THIS ORDER IS WRONG! (the baryocentric coordinates are wrong too)
      r.set([v[f[i][0]], v[f[i][1]], v[f[i][3]],
             v[f[i][3]], v[f[i][1]], v[f[i][2]]].flat(), i * 18);
    }
    return r;
  }
}