//==============================================================================
// Utils
//==============================================================================
function seq(from, to, step = 1)
{
  let a = [from];
  let l = to - from;
  for (let i = 1; i < to; i++)
    a[i] = a[i - 1] + step;
  return a;
}

function repeat(item, times)
{
  var a = [];
  for (let i = 0; i < times; i++)
  {
    a[i] = item;
  }
  return a;
}

function flatten(arr)
{
  let a = [];
  let l = arr.length;
  for (let i = 0; i < l; i++)
  {
    a = a.concat(arr[i]);
  }
  return a;
}

// Returns the smallest power of 2 bigger than n
function enclosingPowerOf2(n)
{
  let a = 1;
  while (n > a)
    a <<= 1;
  return a;
}

function getSpeed(currentSpeed, acceleration, deceleration, maxSpeed, input, deltaTime)
{
  if (input != 0)
  {
    currentSpeed += acceleration * input * deltaTime;

    if (currentSpeed > maxSpeed)
    {
      currentSpeed = maxSpeed;
    }
    else if (currentSpeed < -maxSpeed)
    {
      currentSpeed = -maxSpeed;
    }
    return currentSpeed;
  }
  else if (currentSpeed > 0.0)
  {
    currentSpeed -= deceleration * deltaTime;
    return Math.max(0, currentSpeed);
  }
  else if (currentSpeed < 0.0)
  {
    currentSpeed += deceleration * deltaTime;
    return Math.min(0, currentSpeed);
  }
  return 0.0;
}

function duplicate(a, times)
{
  let r = [];
  while(times--)
    r = r.concat(a);
  return r;
}