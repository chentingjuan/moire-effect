// import * as THREE from 'three'
import * as THREE from './../resources/three.min.js';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragment from './shaders/1/fragment.glsl'
import fragment2 from './shaders/2/fragment.glsl'

import vertex from './shaders/1/vertex.glsl'
import vertex2 from './shaders/2/vertex.glsl'

// import * as dat from "dat.gui"

class Sketch {
  constructor() {
    this.time = 0
    // this.container = options.containerDom
    this.container = document.querySelector('#container')
    // this.scrollWrapper = options.scrollWrapperDom
    
    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    // console.log(this.width, this.height)
    this.camera = new THREE.PerspectiveCamera(70, this.width/this.height, 100, 4000)
    this.camera.position.z = 600
    this.camera.fov = 2*Math.atan( (this.height/2)/600 )* (180/Math.PI)

    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      // alpha: true
    })
    
    this.container.appendChild(this.renderer.domElement)

    // this.currentScroll = 0
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)


    this.settings()
    
    this.mouse = { x: 0, y: 0 }
    // this.addCursor()
    this.addObjects()
   
    this.setupResize()

    // // this.addLines();
    // this.render()

    // this.setPosition();
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

    // const bounds = this.contentWrapperStore.dom.getBoundingClientRect()
    // this.contentWrapperStore.current.width = bounds.width
    // this.contentWrapperStore.current.height = bounds.height
    // this.contentWrapperStore.current.left = bounds.left
    // this.contentWrapperStore.current.top = bounds.top
    // this.grid.scale.x = this.contentWrapperStore.current.width / this.contentWrapperStore.origin.width
    
    // this.rrender.canvas.width = this.scrollWrapper.offsetWidth
    // this.rrender.canvas.height = this.scrollWrapper.offsetHeight
    // this.paths.map(p => {
    //   const bound = p.dom.getBoundingClientRect()
    //   for(let i=0; i<p.number; i++) {
    //     Matter.Body.set(p.circles[i], "position", {
    //       x: p.originSegements[i].point.x * this.width / 1440, 
    //       y: p.originSegements[i].point.y * this.width / 1440 + bound.top
    //     })
    //     Matter.Body.set(p.anchors[i], "position", {
    //       x: p.originSegements[i].point.x * this.width / 1440, 
    //       y: p.originSegements[i].point.y * this.width / 1440 + bound.top
    //     })
    //   }
    // })
    // this.paperCanvas.width = this.width
    // this.paperCanvas.height = this.height

    // this.stoneDoms.map(s => {
    //   const shape = new THREE.Shape()
    //   const pp = new Paper.Path(s.attributes.d.value)
    //   const bounds = s.getBoundingClientRect()
      
    //   pp.segments.map((s, i) => {
    //     const y = - (s.point.y) * bounds.height / pp.bounds.height + this.contentWrapperStore.origin.height/2 + this.contentWrapperStore.origin.top - bounds.top
    //     const x = (s.point.x) * bounds.width / pp.bounds.width - this.width/2 + bounds.left
    //     i===0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
    //   })

    //   const geometry = new THREE.ShapeGeometry(shape)
    //   const mesh = new THREE.Mesh(geometry, this.objectsMaterial)
    //   this.objects.add(mesh)
    // })

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects() {
    this.objectsMaterial = new THREE.ShaderMaterial({
      uniforms:{
        time: { value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      transparent: true
      // wireframe: true
    })
    this.objectsMaterial.uniforms.resolution.value.x = this.container.offsetWidth
    this.objectsMaterial.uniforms.resolution.value.y = this.container.offsetHeight
    // this.objectsMaterial.opacity = 0.5
    // this.objectsMaterial.uniforms.opacity.value = 0.3;

    this.objectsMaterial.needsUpdate

    this.objectsMaterial2 = new THREE.ShaderMaterial({
      uniforms:{
        time: { value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      // side: THREE.DoubleSide,
      fragmentShader: fragment2,
      vertexShader: vertex2,
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
    // this.cover2.position.y = 100;
    
    this.scene.add(this.cover1)
    this.scene.add(this.cover2)
  }

  // setPosition() {
  //   this.objects.position.y = this.currentScroll - this.contentWrapperStore.origin.top + this.height/2 - this.contentWrapperStore.origin.height/2
  //   this.objects.position.x = this.contentWrapperStore.current.left - this.width/2 + this.contentWrapperStore.current.width/2
  // }

  render() {
    // this.project.clear()
    // stats.begin()
    this.time += 0.05

    // this.scroll.render()
    // this.currentScroll = this.scroll.scrollToRender
   
    this.objectsMaterial.uniforms.time.value = this.time
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