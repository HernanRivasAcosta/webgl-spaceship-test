const Keys = {UP: 38,
              DOWN: 40,
              LEFT: 37,
              RIGHT: 39,
              THROTTLE: 65,
              BOOST: 16};

class Keyboard
{
  constructor()
  {
    this._keys = [];
    let that = this;
    document.body.addEventListener('keydown', function(e) { that._onKeyDown(e); });
    document.body.addEventListener('keyup', function(e) { that._onKeyUp(e); });
  }

  _onKeyDown(e)
  {
    this._keys[e.keyCode] = true;
  }

  _onKeyUp(e)
  {
    delete this._keys[e.keyCode];
  }

  keyIsDown(key)
  {
    return this._keys[key] == true
  }

  getInput(kNeg, kPos)
  {
    let r = 0;
    if (this.keyIsDown(kNeg))
      r -= 1;
    if (this.keyIsDown(kPos))
      r += 1;
    return r;
  }
}

let keyboard = new Keyboard();