
import glsl from '../../../resources/glislify.min.js'

export default glsl`
//varying vec2 vUv; 

void main() {
  // vUv = position; 

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`