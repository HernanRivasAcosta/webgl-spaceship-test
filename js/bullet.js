class Bullet extends Drawable
{

  constructor(worldSize)
  {
    super(new BulletModel());

    this._minx = -worldSize * 0.5;
    this._maxx = worldSize * 0.5;
    this._miny = -worldSize * 0.5;
    this._maxy = worldSize * 0.5;

    this._ra = 0.007; // Rotation accel
    this._rsz = 0.0;
    this._dir = this._randomDirection();

    this._rz = Math.random() * 2.0 * Math.PI;
  }

  _randomDirection()
  {
    let r = Math.random();
    if (r < 0.1)
      return -1.0;
    else if (r > 0.9)
      return 1.0;
    else
      return 0.0;
  }

  update(delta)
  {
    let s = 425.0;

    if (this._dir == 0.0)
    {
      if (this._rsz > 0.0)
      {
        this._rsz -= this._ra;
        if (this._rsz < 0.0)
        {
          this._rsz = 0.0;
        }
      }
      else if (this._rsz < 0.0)
      {
        this._rsz += this._ra;
        if (this._rsz > 0.0)
        {
          this._rsz = 0.0;
        }
      }
    }
    else
    {
      this._rsz += this._ra * this._dir;
      this._rsz = Math.max(-1.0, Math.min(1.0, this._rsz));
    }


    this._rz += this._rsz * 5.0 * delta;
    this._ry = this._rsz * 1.7;

    this._x += Math.sin(this._rz) * s * delta;
    this._y -= Math.cos(this._rz) * s * delta;

    if (Math.random() < 0.02)
    {
      this._dir = this._randomDirection();
    }

    if (this._x < this._minx)
      this._x = this._maxx;
    if (this._x > this._maxx)
      this._x = this._minx;

    if (this._y < this._miny)
      this._y = this._maxy;
    if (this._y > this._maxy)
      this._y = this._miny;
  }

}

class BulletModel extends Model
{

  constructor()
  {
    super('enemy');

    this._generate();
  }

  _generate()
  {
    this._initVertices(6 * 3 * 3);

    let a = [];

    this._vertices.set(a, 0);

    // Barycentric data
    this._bCoordinates.set([], 0);

    // Colour data
    let r = 0.8;
    let g = 0.1;
    let b = 0.1;
    this._colours.set([r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b,
                       r, g, b, r, g, b, r, g, b], 0);

  }

}