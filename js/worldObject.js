class WorldObject
{
  //============================================================================
  // Getters/setters
  //============================================================================
  get x() { return this._x; };
  set x(v) { this._x = v; };

  get y() { return this._y; };
  set y(v) { this._y = v; };

  get z() { return this._z; };
  set z(v) { this._z = v; };

  get rx() { return this._rx; };
  set rx(v) { this._rx = v; };

  get ry() { return this._ry; };
  set ry(v) { this._ry = v; };

  get rz() { return this._rz; };
  set rz(v) { this._rz = v; };

  constructor()
  {
    this._x = 0.0;
    this._y = 0.0;
    this._z = 0.0;

    this._rx = 0.0;
    this._ry = 0.0;
    this._rz = 0.0;
  }

  setPosition(x, y, z)
  {
    this._x = x;
    this._y = y;
    this._z = z;
  }
}