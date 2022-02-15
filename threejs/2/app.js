// import * as THREE from 'three'
// import * as dat from 'dat.gui'
// import gsap from 'gsap'
// import { Effect } from "postprocessing"

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
    
    // this.currentWave = 0
    this.mouse = new THREE.Vector2(0, 0)
    this.tx = 0
    this.ty = 0
    this.easing = 0.03
    this.raycaster = new THREE.Raycaster()
    this.waterTexture = new WaterTexture({ debug: true })
    this.initEventListener() 

    this.addObjects()
   
    this.setupResize()
    this.render()     
  }

  initEventListener() {
    window.addEventListener('mousemove', e => this.onMouseMove(e) )
  }

  onMouseMove(e) {
    this.waterTexture.update()
    // // this.mouse = {
    // //   x: e.clientX - this.width/2,
    // //   y: - e.clientY + this.height/2
    // // }
    // this.mouse = {
    //   x: ( e.clientX / this.width ) * 2 - 1,
    //   y: - ( e.clientY / this.height ) * 2 + 1
    // }

    // // const offsePart = 5
    // // const dx = this.mouse.x/offsePart - this.tx
    // // this.tx += dx * this.easing
    // // const dy = this.mouse.y/offsePart - this.ty
    // // this.ty += dy * this.easing
    // // gsap.to(
    // //   this.cover2.position, 
    // //   1, 
    // //   {
    // //     x: this.tx,
    // //     y: this.ty,
    // //     z: this.cover2.position.z
    // //   }
    // // )

    // // this.mouse = {
    // //   x: ( (e.clientX - viewportOffset.left) / this.container.getBoundingClientRect().width ) * 2 - 1,
    // //   y: - ( (e.clientY - viewportOffset.top) / this.container.getBoundingClientRect().height ) * 2 + 1
    // // }

    // const targetMesh = this.cover1
    // this.raycaster.setFromCamera(this.mouse, this.camera)
    // const intersects = this.raycaster.intersectObjects([targetMesh])
    // // console.log(intersects)
    // if (intersects.length > 0) {
    //   let p = intersects[0].point;
    //   targetMesh.material.uniforms.u_mouse.value = new THREE.Vector2(p.x, p.y);
    //   // let fake = {
    //   //   wHeight: 0.08,
    //   //   wTime: 0.0,
    //   //   wLength: 0.5,
    //   // };
    //   // let tl = new TimelineMax({ onUpdate: function() {
    //   //   this.instancedMesh.material.uniforms.wHeight.value[waveIndex] = fake.wHeight;
    //   //   this.instancedMesh.material.uniforms.wTime.value[waveIndex] = fake.wTime;
    //   //   this.instancedMesh.material.uniforms.wLength.value[waveIndex] = fake.wLength;
    //   // }});
    //   // tl
    //   //   .to(fake,5,{
    //   //     wHeight:0,
    //   //     wTime:0.7,
    //   //     wLength:0.3,
    //   //     ease: Expo.easeOut,
    //   //   })
    //   // this.currentWave = (this.currentWave + 1)%10
    // }

    const point = {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight
    };

    this.waterTexture.addPoint(point)

    // this.raycaster.setFromCamera(
    //   {
    //     x: (ev.clientX / window.innerWidth) * 2 - 1,
    //     y: -(ev.clientY / window.innerHeight) * 2 + 1
    //   },
    //   this.camera
    // );
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
            this.cover1.material.map = new THREE.TextureLoader(url)
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
            this.cover2.material.map = new THREE.TextureLoader(url)
          };

          reader.readAsDataURL(file)
        })
        input.click()
      },
      // 'background': 'radial-gradient(circle, rgba(202,123,74,1) 0%, rgba(180,207,62,1) 100%)'
      'background': '#ddd',
      'rot-velocity': 1,
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

    this.gui.add(this.settings, 'rot-velocity').min(0.1).max(1)
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
    // const m = new THREE.MeshBasicMaterial({
    //   map: this.waterTexture.texture,
    //   transparent: true,
    //   blending: THREE.AdditiveBlending,
    //   depthTest: false,
    //   depthWrite: false,
    // })
    // // m.visible = false
    // this.scene1.add(new THREE.Mesh(new THREE.PlaneBufferGeometry(this.width, this.height, 1, 1), m))

    let texture = new THREE.TextureLoader().load(`../../assets/images/pattern-${this.settings['selected-1']}.png`)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    // this.material1 = new THREE.MeshBasicMaterial({map: texture, transparent: true})
    // this.material1.map.minFilter = THREE.LinearFilter
    // this.material1.map.needsUpdate = true
    this.material1 = new THREE.ShaderMaterial({
      uniforms: {
        u_image: new THREE.Uniform(texture),
        // u_image: new THREE.Uniform(this.waterTexture.texture),
        // u_displacement: { value: null }
        u_displacement: new THREE.Uniform(this.waterTexture.texture),
        // u_mouse: new THREE.Uniform(new THREE.Vector2(0, 0)),
      },
      transparent: true,
      fragmentShader: `
        uniform sampler2D u_image;
        uniform sampler2D u_displacement;

        varying vec2 vUv;
        float PI = 3.141592653589793238;

        void main() {
          vec4 displacement = texture2D(u_displacement, vUv);
          float theta = displacement.r*2.*PI;

          vec2 dir = vec2(sin(theta), cos(theta));


          vec2 uv = vUv + dir*displacement.r*0.01;

          gl_FragColor = texture2D(u_image, uv);
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        uniform vec2 u_mouse;

        void main(){
          vec3 pos = position.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
          vUv = uv;
        }
      `
    });

    this.material2 = new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    this.material2.map.minFilter = THREE.LinearFilter
    this.material2.map.needsUpdate = true

    const planeGeometry = new THREE.PlaneBufferGeometry(this.planeSize, this.planeSize, 1, 1)
		
    this.cover1 = new THREE.Mesh(planeGeometry, this.material1)
    this.cover2 = new THREE.Mesh(planeGeometry, this.material2)
    this.cover2.position.z = - this.planeSize
    this.scene.add(this.cover1)
    this.scene.add(this.cover2)
  }

  render() {
    // this.project.clear()
    // stats.begin()
    this.time += 0.001

    this.cover2.rotation.z = this.time / this.settings['rot-velocity']
    // this.scroll.render()
    // this.currentScroll = this.scroll.scrollToRender
   
    // this.objectsMaterial.uniforms.time.value = this.time
    // this.objectsMaterial.opacity = 0.5
    // this.objectsMaterial2.uniforms.time.value = this.time

    // if(this.waterTexture.points.length!==0) this.waterTexture.update()


    // this.renderer.setRenderTarget(this.baseTexture)
    // this.renderer.render( this.scene1, this.camera )
    // this.material1.uniforms.u_displacement.value = this.baseTexture.texture
    // this.renderer.setRenderTarget(null)
    // this.renderer.clear()
    this.renderer.render(this.scene, this.camera)

    // this.renderer.setPixelRatio(window.devicePixelRatio)
    window.requestAnimationFrame(this.render.bind(this))
    // stats.end()
  }
}

window.onload = () => {
  new Sketch()
}

const easeOutSine = (t, b, c, d) => {
  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
};

const easeOutQuad = (t, b, c, d) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

class WaterTexture {
  constructor(options) {
    this.size = 64
    this.points = []
    this.radius = this.size * 0.1
    this.width = this.height = this.size
    this.maxAge = 2

    if (options.debug) {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.radius = this.width * 0.25
    }

    this.initTexture()
    if (options.debug) document.body.append(this.canvas);
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "WaterTexture";
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.position = 'fixed'
    this.canvas.style.left = 0
    this.canvas.style.top = 0
    this.canvas.style.right = 0
    this.canvas.style.bottom = 0
    this.canvas.style.zIndex = 999
    this.canvas.style.opacity = 0
    this.canvas.style.pointerEvents = 'none'
    this.ctx = this.canvas.getContext("2d")
    this.clear();

    this.texture = new THREE.Texture(this.canvas) 
    this.texture.needsUpdate = true;
  }
  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  addPoint(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
 
    this.points.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }
  update() {
    this.clear()
    // let agePart = 1 / this.maxAge;
    this.points.forEach((point, i) => {
      // let slowAsOlder = 1 - point.age / this.maxAge;
      // let force = point.force * agePart * slowAsOlder;
      point.x += point.vx
      point.y += point.vy
      point.age += 1
      if (point.age > this.maxAge) {
        this.points.splice(i, 1)
      }
    })
    this.points.forEach(point => {
      this.drawPoint(point)
    })
    this.texture.needsUpdate = true
  }
  drawPoint(point) {
    // Convert normalized position into canvas coordinates
    let pos = {
      x: point.x * this.width,
      y: point.y * this.height
    }
    const radius = this.radius
    const ctx = this.ctx

    let intensity = 1
    intensity = easeOutSine((1 - point.age / this.maxAge), 0, 1, 1)
  
    let color = "255,255,255";

    let offset = this.width * 1;
    // 1. Give the shadow a high offset.
    ctx.shadowOffsetX = offset;
    ctx.shadowOffsetY = offset;
    ctx.shadowBlur = radius * 5;
    ctx.shadowColor = `rgba(${color}, ${1 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = `rgba(255,0,0,1)`;
    // 2. Move the circle to the other direction of the offset
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}