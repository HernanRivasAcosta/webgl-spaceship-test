//==============================================================================
// Setup
//==============================================================================
let _camera = new Camera();
let _renderer = new Renderer(window, document);
_renderer.camera = _camera;

//==============================================================================
// Objects
//==============================================================================
let worldSize = 8000;

let objects = [];

let _player = new Player(_camera);
objects[0] = _player;

for (let i = 1; i <= 100; i++)
{
  let enemy = new Enemy(worldSize);
  enemy.setPosition((Math.random() - 0.5) * worldSize,
                    (Math.random() - 0.5) * worldSize,
                    Math.random() * 250 + 50);
  objects[i] = enemy;
  _renderer.addObject(enemy);
}

let _terrain = new Drawable(new TerrainModel(worldSize, worldSize, 99));
_renderer.addObject(_terrain);

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