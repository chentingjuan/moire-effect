import * as THREE from 'three'

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
    let texture = new THREE.TextureLoader().load('../../assets/images/pattern-2.png');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    this.material = new THREE.MeshBasicMaterial({
      map: texture, 
      side: THREE.DoubleSide,
      transparent: true
      // wireframe: true
    })
    const planeSize = Math.pow(Math.pow(this.width, 2) + Math.pow(this.height, 2), 0.5)
    const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize, 1, 1)
		
    this.cover1 = new THREE.Mesh(planeGeometry, this.material)
    this.cover2 = new THREE.Mesh(planeGeometry, this.material)
    // this.cover1.rotation.y = 200
    // this.cover2.rotation.z = Math.PI / 2
    this.scene.add(this.cover1)
    this.scene.add(this.cover2)
  }

  render() {
    // this.project.clear()
    // stats.begin()
    this.time += 0.001

    this.cover2.rotation.z = this.time
    // this.scroll.render()
    // this.currentScroll = this.scroll.scrollToRender
   
    // this.objectsMaterial.uniforms.time.value = this.time
    // this.objectsMaterial.opacity = 0.5
    // this.objectsMaterial2.uniforms.time.value = this.time
    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame(this.render.bind(this))
    // stats.end()
  }
}

window.onload = () => {
  new Sketch()
}