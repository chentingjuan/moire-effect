// import * as THREE from 'three'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'

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
      'selected-1': 'a',
      'filename 1': 'default',
      '✿ CLICK ME TO UPLOAD 1': () => {
        const input = document.getElementById('pattern-1')
        input.addEventListener('change', () => {
          const file = input.files[0]
          this.settings['pattern-1'] = file.name

          const image = document.createElement('img')
          var reader = new FileReader()

          reader.onload = e => {
            const url = e.target.result
            image.src = url
            this.cover1.material.map = new THREE.ImageUtils.loadTexture(url)
          };

          reader.readAsDataURL(file)
        })
        input.click()
      },
      'selected-2': 'a',
      'filename 2': 'default',
      '✿ CLICK ME TO UPLOAD 2': () => {
        const input = document.getElementById('pattern-2')
        input.addEventListener('change', () => {
          const file = input.files[0]
          this.settings['pattern-2'] = file.name

          const image = document.createElement('img')
          var reader = new FileReader()

          reader.onload = e => {
            const url = e.target.result
            image.src = url
            this.cover2.material.map = new THREE.ImageUtils.loadTexture(url)
          };

          reader.readAsDataURL(file)
        })
        input.click()
      },
      // 'background': 'radial-gradient(circle, rgba(202,123,74,1) 0%, rgba(180,207,62,1) 100%)'
      'background': '#ddd'
    };
    this.gui = new dat.GUI()

    const patter1Folder = this.gui.addFolder('----- PATTERN 1 -----')
    patter1Folder.open()
    patter1Folder.add(this.settings, 'selected-1', {'a': 'a','b': 'b','c': 'c'}).onChange(() => {
      this.cover1.material.map = new THREE.TextureLoader().load(`../../assets/images/pattern-${this.settings['selected-1']}.png`)
    })

    const patter1FolderUpload = patter1Folder.addFolder('Upload Image')
    patter1FolderUpload.open()
    patter1FolderUpload.add(this.settings, '✿ CLICK ME TO UPLOAD 1')
    patter1FolderUpload.add(this.settings, 'filename 1', this.settings['pattern-1']).listen()
    
    const patter2Folder = this.gui.addFolder('----- PATTERN 2 -----')
    patter2Folder.open()
    patter2Folder.add(this.settings, 'selected-2', {'a': 'a','b': 'b','c': 'c'}).onChange(() => {
      this.cover2.material.map = new THREE.TextureLoader().load(`../../assets/images/pattern-${this.settings['selected-2']}.png`)
    })

    const patter2FolderUpload = patter2Folder.addFolder('Upload Image')
    patter2FolderUpload.open()
    patter2FolderUpload.add(this.settings, '✿ CLICK ME TO UPLOAD 2')
    patter2FolderUpload.add(this.settings, 'filename 2', this.settings['pattern-2']).listen()

    document.querySelector('body').style.background = this.settings['background']
    this.gui.add(this.settings, 'background').onChange(() => {
      document.querySelector('body').style.background = this.settings['background']
    })
  }
  
  setupResize() {
    this.resize()
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.renderer.setSize(this.width, this.height)
  }

  addObjects () {
    let texture = new THREE.TextureLoader().load(`../../assets/images/pattern-${this.settings['selected-1']}.png`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    this.material1 = new THREE.MeshBasicMaterial({map: texture, transparent: true})
    this.material1.map.minFilter = THREE.LinearFilter
    this.material1.map.needsUpdate = true
    this.material2 = new THREE.MeshBasicMaterial({map: texture, transparent: true})
    this.material2.map.minFilter = THREE.LinearFilter
    this.material2.map.needsUpdate = true

    const planeGeometry = new THREE.PlaneBufferGeometry(this.planeSize, this.planeSize, 1, 1)
		
    this.cover1 = new THREE.Mesh(planeGeometry, this.material1)
    this.cover2 = new THREE.Mesh(planeGeometry, this.material2)
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
    this.renderer.setPixelRatio(window.devicePixelRatio)
    window.requestAnimationFrame(this.render.bind(this))
    // stats.end()
  }
}

window.onload = () => {
  new Sketch()
}

