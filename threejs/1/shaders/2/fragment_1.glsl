precision mediump float;
uniform float time;
uniform vec2 resolution;

#define PI 3.14159265359

void main(void) {
	vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
  //uv.y += 0.4 * sin(uv.x * sin(time) + time);
  uv.x += 0.1 * sin(uv.y + time/100.);
  float scroll = time / 20.;
  vec2 noisePos = vec2(scroll + uv.y * 0.015, 0.5 + 0.5 * sin(scroll * PI));
  float numLines = 40. + 160. * sin(PI * noisePos.x);
  float col = 0.5 + 0.5 * sin(uv.x * numLines);
  float aA = 1./(resolution.y / numLines);

  
	gl_FragColor = vec4(smoothstep(0.5 - aA, 0.5 + aA, col));
  gl_FragColor.a = 0.6;
}