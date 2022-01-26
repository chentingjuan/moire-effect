// import * as THREE from 'three'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'

const patternFileName = 'pattern-3.png'

class Sketch {
  constructor() {
    this.time = 0
    this.container = document.querySelector('#container')
    
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.planeSize = Math.pow(Math.pow(this.width, 2) + Math.pow(this.height, 2), 0.5) * 1.2

    this.camera = new THREE.OrthographicCamera( - this.width / 2, this.width / 2, this.height / 2, - this.height / 2, 0, 3 * this.planeSize);

    this.camera.position.z = this.planeSize

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    })
    
    this.container.appendChild(this.renderer.domElement)

    this.settings()
    
    this.mouse = new THREE.Vector2(0, 0)
    this.tx = 0
    this.ty = 0
    this.easing = 0.03
    this.raycaster = new THREE.Raycaster()
    this.initEventListener() 

    // this.addCursor()
    this.addObjects()
   
    this.setupResize()
    this.render()     
  }

  initEventListener() {
    window.addEventListener('mousemove', e => this.onMouseMove(e) )
  }

  onMouseMove(e) {
    this.mouse = {
      x: e.clientX - this.width/2,
      y: - e.clientY + this.height/2
    }

    const offsePart = 5
    const dx = this.mouse.x/offsePart - this.tx
    this.tx += dx * this.easing
    const dy = this.mouse.y/offsePart - this.ty
    this.ty += dy * this.easing
    gsap.to(
      this.cover2.position, 
      1, 
      {
        x: this.tx,
        y: this.ty,
        z: this.cover2.position.z
      }
    )
  }

  settings() {
    this.settings = {
      // velo: 0,
      // scale: 0,
      // colorful: ()=>{
      //   // that.makeColorful()
      //   that.customPass.uniforms.uType.value = 0;
      // },
      // zoom: ()=>{
      //   that.customPass.uniforms.uType.value = 1;
      // },
      // random: ()=>{
      //   that.customPass.uniforms.uType.value = 2;
      // },
    };
    this.gui = new dat.GUI()
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
    // this.camera.aspect = this.width / this.height
    // this.camera.updateProjectionMatrix()
  }

  addObjects () {
    let texture = new THREE.TextureLoader().load(`../../assets/images/${patternFileName}`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    this.material = new THREE.MeshBasicMaterial({
      map: texture, 
      // alphaTest: 0.5,
      // side: THREE.DoubleSide,
      transparent: true
      // wireframe: true
    })
    
    const planeGeometry = new THREE.PlaneBufferGeometry(this.planeSize, this.planeSize, 1, 1)
		
    this.cover1 = new THREE.Mesh(planeGeometry, this.material)
    this.cover2 = new THREE.Mesh(planeGeometry, this.material)
    this.cover2.position.z = - this.planeSize
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

    this.raycaster.setFromCamera(this.mouse, this.camera)
    this.intersects



    this.renderer.render( this.scene, this.camera )
    window.requestAnimationFrame(this.render.bind(this))
    // stats.end()
  }
}

window.onload = () => {
  new Sketch()
}