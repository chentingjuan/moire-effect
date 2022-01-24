precision mediump float;
uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359

void main(void) {
	vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
  //uv.y += 0.4 * sin(uv.x * sin(time) + time);
  //uv.y += 0.1 * sin(uv.x + time/100.);
  uv.x += sin(uv.y * 1.6 + time/10.) * sin(uv.x) * 0.4;
  //float scroll = time / 20.;
  //vec2 noisePos = vec2(scroll + uv.x * 0.015, 0.5 + 0.5 * sin(scroll * PI));
  //float numLines = 40. + 160. * sin(PI * noisePos.x);
  float numLines = 100.;
  float col = 0.7 + 1. * sin(uv.x * numLines);
  float aA = 1./(resolution.y / numLines);

  
	gl_FragColor = vec4(smoothstep(0.5 - aA, 0.5 + aA, col) * .6);
  //gl_FragColor = vec4(vec3(smoothstep(0.5 - aA, 0.5 + aA, col)), .6);
}
