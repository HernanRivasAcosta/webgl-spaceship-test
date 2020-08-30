//==============================================================================
// Setup
//==============================================================================
let drawDistance = 4000;
let _camera = new Camera(drawDistance);
let _renderer = new Renderer(window, document, drawDistance);
_renderer.camera = _camera;

//==============================================================================
// Objects
//==============================================================================
let tileSize = 100;
let maxHeight = 1000;

let objects = [];

let _player = new Player(_camera);
objects[0] = _player;

let _terrain = new TerrainModel(tileSize, maxHeight, 128, 3473)
let _ground = new Drawable(_terrain);
_renderer.addObject(_ground);

let worldSize = _terrain.getSize();
for (let i = 1; i <= 100; i++)
{
  let enemy = new Enemy(worldSize);
  enemy.setPosition((Math.random() - 0.5) * worldSize,
                    (Math.random() - 0.5) * worldSize,
                    maxHeight * (0.4 + Math.random() * 0.4));
  objects[i] = enemy;
  _renderer.addObject(enemy);
}


_player.z = maxHeight;

//==============================================================================
// Update
//==============================================================================

let then = 0;
function render(now)
{
  // Get the time delta
  now *= 0.001;
  const delta = now - then;
  then = now;

  // Update all objects
  let l = objects.length;
  for (let i = 0; i < l; i++)
  {
    objects[i].update(delta);
  }

  _renderer.update(delta);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);