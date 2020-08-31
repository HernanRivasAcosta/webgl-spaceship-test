class Drawable extends WorldObject
{
  //============================================================================
  // Getters/setters
  //============================================================================
  get model() { return this._model; }

  //============================================================================
  // Constructor
  //============================================================================
  constructor(model)
  {
    super();
    this._model = model;
  }

  //============================================================================
  // API
  //============================================================================
  bindBuffers(gl)
  {
    this._model.bindBuffers(gl);
  }

  unbindBuffers(gl)
  {
    this._model.unbindBuffers(gl);
  }

  getMatrix(renderer)
  {
    let mat = mat4.create();

    mat4.translate(mat, mat, [this._x, this._y, -this._z]);
    mat4.rotateZ(mat, mat, this._rz);
    mat4.rotateX(mat, mat, this._rx + Math.PI);
    mat4.rotateY(mat, mat, this._ry);

    return mat;
  }
}