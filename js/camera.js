class Camera extends WorldObject
{
  //============================================================================
  // Constructor
  //============================================================================
  constructor()
  {
    super();
  }

  //============================================================================
  // API
  //============================================================================
  getMatrix(renderer)
  {
    let mat = mat4.create();
    mat4.perspective(mat, 0.785, renderer.aspectRatio, 0.1, 2500.0);

    mat4.rotateX(mat, mat, this._rx + Math.PI / 2.0);
    mat4.rotateY(mat, mat, this._ry);
    mat4.rotateZ(mat, mat, this._rz + Math.PI / 2.0);
    mat4.translate(mat, mat, [this._x, this._y, this._z]);

    return mat;
  }
}