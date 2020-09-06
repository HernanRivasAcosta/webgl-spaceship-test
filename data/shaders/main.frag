#extension GL_OES_standard_derivatives : enable
precision mediump float;

varying vec3 vColor;
varying vec3 vCenter;
varying float vdistToCamera;

void main(void)
{
  if(vCenter.x <= 0.02 || vCenter.y <= 0.02 || vCenter.z <= 0.02)
    gl_FragColor.rgb = vColor * vec3(vdistToCamera);
  else
    gl_FragColor.rgb = vec3(0.0);
  gl_FragColor.a = 1.0;
}