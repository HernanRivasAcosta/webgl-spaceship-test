// A basic implementation of Lehmer's prng
class Rand
{
  constructor(seed = null)
  {
    this._seed = (seed ||
                  Math.floor(Math.random() * Math.pow(2, 32))) % 2147483647;
  }

  int(min = 0, max = 0)
  {
    this._seed = (this._seed * 16807) % 2147483647;
    if (min || max)
    {
      return (this._seed % (max - min)) + min;
    }
    else
    {
      return this._seed;
    }
  }

  float()
  {
    return (this.int() - 1) / 2147483646;
  }
}