// import * as THREE from 'three'

class Sketch {
  constructor() {
    this.time = 0
    this.container = document.querySelector('#container')
    
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 100, 4000)
    this.camera.position.z = 600
    this.camera.fov = 2*Math.atan( (this.height/2)/600 )* (180/Math.PI)

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    })
    
    this.container.appendChild(this.renderer.domElement)

    this.settings()
    
    this.mouse = { x: 0, y: 0 }
    // this.addCursor()
    this.addObjects()
   
    this.setupResize()
    this.render()     
  }

  settings() {
    // this.settings = {
    //   velo: 0,
    //   scale: 0,
    //   colorful: ()=>{
    //     // that.makeColorful()
    //     that.customPass.uniforms.uType.value = 0;
    //   },
    //   zoom: ()=>{
    //     that.customPass.uniforms.uType.value = 1;
    //   },
    //   random: ()=>{
    //     that.customPass.uniforms.uType.value = 2;
    //   },
    // };
    // this.gui = new dat.GUI()
    // this.gui.add(this.settings, "progress", -1, 2, 0.01);
    // this.gui.add(this.settings, "velo", 0, 1, 0.01);
    // this.gui.add(this.settings, "scale", 0, 1, 0.01);
    // this.gui.add(this.settings, "colorful");
    // this.gui.add(this.settings, "zoom");
    // this.gui.add(this.settings, "random");
  }

  setupResize() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects () {
    var texture = new THREE.TextureLoader().load( '../../assets/images/pattern-2.png' );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 40, 40 );
	  // floorTexture.repeat.set( 10, 10 );
    this.objectsMaterial = new THREE.MeshBasicMaterial({
      map: texture, 
      side: THREE.DoubleSide
      // uniforms:{
      //   time: { value: 0 },
      //   resolution: { type: "v4", value: new THREE.Vector4() },
      //   mixAmount: 	 { type: "f", value: 0.0 }
      // },
      // vertexShader: `
      //   uniform float mixAmount;
      //   // varying vec2 vUv;

      //   void main() {
      //     vec2 vUV = uv;

      //     // vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      //     vec3 goalPosition = 200.0 * vec3( 0, uv.y, -uv.x ) + vec3(0.0, -100.0, 100.0);
	    //     vec3 newPosition = mix( position, goalPosition, mixAmount );
      //     gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 ); 
      //     // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

          
      //   }
      // `,
      // fragmentShader: `
      //   precision mediump float;
      //   uniform float time;
      //   uniform vec2 resolution; // window 解析度

      //   uniform sampler2D baseTexture;
      //   // varying vec2 vUv;

      //   #define PI 3.14159265359

      //   void main(void) {
      //     vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
      //     uv.y += sin(uv.y * 1.6 + 1./10.) * sin(uv.x) * 0.4;
      //     float numLines = 100.;
      //     float col = 0.7 + 1. * sin(uv.y * numLines);
      //     float aA = 1./(resolution.y / numLines);

      //     gl_FragColor = vec4(smoothstep(0.5 - aA, 0.5 + aA, col) * .6);
      //   }
      // `,
      
      // transparent: true
      // wireframe: true
    })
    // this.objectsMaterial.uniforms.resolution.value.x = this.container.offsetWidth
    // this.objectsMaterial.uniforms.resolution.value.y = this.container.offsetHeight

    // this.objectsMaterial.needsUpdate = true

    this.objectsMaterial2 = new THREE.ShaderMaterial({
      uniforms:{
        time: { value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // side: THREE.DoubleSide,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform vec2 resolution;
        
        #define PI 3.14159265359
        
        void main(void) {
          vec2 uv = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;

          uv.x += sin(uv.y * 1.6 + time/10.) * sin(uv.x) * 0.4;
          
          float numLines = 100.;
          float col = 0.7 + 1. * sin(uv.x * numLines);
          float aA = 1./(resolution.y / numLines);
        
          
          gl_FragColor = vec4(smoothstep(0.5 - aA, 0.5 + aA, col) * .6);
          //gl_FragColor = vec4(vec3(smoothstep(0.5 - aA, 0.5 + aA, col)), .6);
        }
      `,
      vertexShader: `
        //varying vec2 vUv; 
        
        void main() {
          // vUv = position; 
        
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition; 
        }
      `,
      transparent: true,
      // wireframe: true
    })
    this.objectsMaterial2.uniforms.resolution.value.x = this.container.offsetWidth
    this.objectsMaterial2.uniforms.resolution.value.y = this.container.offsetHeight
    this.objectsMaterial2.needsUpdate

    // const gridGeometry = new THREE.PlaneBufferGeometry(this.contentWrapperStore.origin.width, this.contentWrapperStore.origin.height, 6, 14).toGrid()
		// this.grid = new THREE.LineSegments(gridGeometry, this.objectsMaterial)
    const planeGeometry = new THREE.PlaneBufferGeometry(this.width, this.height, 5, 5)
		
    this.cover1 = new THREE.Mesh(planeGeometry, this.objectsMaterial)
    this.cover2 = new THREE.Mesh(planeGeometry, this.objectsMaterial2)
    this.cover1.rotation.y = 200
    this.scene.add(this.cover1)
    // this.scene.add(this.cover2)
  }

  render() {
    // this.project.clear()
    // stats.begin()
    this.time += 0.05

    // this.scroll.render()
    // this.currentScroll = this.scroll.scrollToRender
   
    // this.objectsMaterial.uniforms.time.value = this.time
    // this.objectsMaterial.opacity = 0.5
    this.objectsMaterial2.uniforms.time.value = this.time
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame(this.render.bind(this))
    // stats.end()
  }
}

window.onload = () => {
  new Sketch()
}