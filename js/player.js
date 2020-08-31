class Player
{

  get x() { return this._camera.x; };
  set x(v) { this._camera.x = v; };

  get y() { return this._camera.y; };
  set y(v) { this._camera.y = v; };

  get z() { return this._camera.z; };
  set z(v) { this._camera.z = v; };

  getPosition()
  {
    return '(' + this._camera.x.toFixed(1) + ', ' +
                 this._camera.y.toFixed(1) + ', ' +
                 this._camera.z.toFixed(1) + ')';
  }

  //============================================================================
  // Constructor
  //============================================================================
  constructor(camera)
  {
    this._camera = camera;
    this._camera._z = 150;
    this._camera._rz = 2*Math.PI;

    // Speed
    this._sx = 0.0;
    this._sy = 0.0;
    this._sz = 0.0;
    this._s = 0.0;

    // Rotation speed
    this._rsx = 0.0;
    this._rsy = 0.0;

    // Misc
    this._a = 6.0; // Acceleration
    this._dc = this._a * 0.3; // Deceleration
    this._ms = 5.0; // Max speed
    this._ra = 0.03; // Rotation accel
    this._mrs = 0.02; // Max rotation speed
  }

  update(delta)
  {
    let throttling = keyboard.keyIsDown(Keys.THROTTLE);
    let boosting = keyboard.keyIsDown(Keys.BOOST);

    // Rotation
    let ra = boosting ? this._ra * 0.3 : this._ra;
    let xinput = keyboard.getInput(Keys.DOWN, Keys.UP);
    this._rsx = getSpeed(this._rsx, ra, this._ra * 0.5, this._mrs,
                         xinput, delta);
    let zinput = -keyboard.getInput(Keys.LEFT, Keys.RIGHT);
    this._rsz = getSpeed(this._rsz, ra, this._ra * 0.5, this._mrs,
                         zinput, delta);

    // Acceleration
    let a = boosting ? this._a * 3.0 : this._a;
    let ms = boosting ? this._ms * 3.0 : this._ms;

    if (throttling || boosting)
    {
      this._sx += Math.cos(this._camera._rz) * a * delta;
      this._sy -= Math.sin(this._camera._rz) * a * delta;
      this._sz -= Math.sin(this._camera._rx) * a * delta;
    }

    let s = Math.sqrt(this._sx * this._sx +
                      this._sy * this._sy +
                      this._sz * this._sz);

    // Enforce the max speed
    if (s > ms)
    {
      this._s = Math.max(0, s - a * 1.5 * delta);
    }
    else if (!throttling || boosting)
    {
      this._s = Math.max(0, s - this._dc * delta);
    }
    else
    {
      this._s = s;
    }

    if (s > 0)
    {
      this._sx *= this._s / s;
      this._sy *= this._s / s;
      this._sz *= this._s / s;
    }

    // Update the position and rotation
    this._camera._x += this._sx;
    this._camera._y += this._sy;
    this._camera._z += this._sz;

    this._camera._rx += this._rsx;
    this._camera._ry = -this._rsz * 10.0;
    this._camera._rz += this._rsz;
  }
}