import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { step } from 'three/examples/jsm/nodes/Nodes.js';

function App() {
  // console.log(THREE)

  useEffect(() => {
    const canvas = document.querySelector("canvas")

    //sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    //scene
    const scene = new THREE.Scene()

    // gui 
    const gui = new dat.GUI({closed : true})
    const debugObject = {}

    //texture
    const textureLoader = new THREE.TextureLoader()

    //parameter
    const parameters = {}
    parameters.lightColor = 0xffffff

    //color
    debugObject.depthColor = '#186691'
    debugObject.surfaceColor = '#9bd8ff'

    //object
    const geometry = new THREE.PlaneGeometry(4, 4, 200, 200)
    //random value per vertex
    const material = new THREE.ShaderMaterial({
      // wireframe : true
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      uniforms: {
        uTime: { value: 0 },


        uWaveElevation: { value: 0.2 },
        uFrequency: { value: new THREE.Vector2(1, 1.5) },
        uWaveSpeed: { value: 1 },

        uSmallWaveFrequency : {value : 2.0},
        uSmallWaveElevation : {value : 0.1},
        uSmallWaveIteration : {value : 3},
        uSmallWaveSpeed : {value : 1.0},


        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uElevationMultiplier: { value: 3.0 },
        uElevationOffset: { value: 0.2 }
      }
    })
    const object = new THREE.Mesh(geometry, material)
    object.material.side = THREE.DoubleSide
    object.rotation.z = Math.PI * 0.2;
    scene.add(object)

    //debug
    gui.add(material.uniforms.uWaveElevation, 'value').min(0).max(0.8).step(0.0001).name('waveElevation')
    gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(10).step(0.001).name('FrequencyX')
    gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(10).step(0.001).name('FrequencyY')
    gui.add(material.uniforms.uWaveSpeed, 'value').min(0).max(10).step(0.001).name('BigWaveSpeed')
    gui.addColor(debugObject, 'depthColor').onChange(() => { material.uniforms.uDepthColor.value.set(debugObject.depthColor) })
    gui.addColor(debugObject, 'surfaceColor').onChange(() => { material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
    gui.add(material.uniforms.uElevationMultiplier , 'value').min(0).max(10).step(0.001).name('ElevationMultiplier')
    gui.add(material.uniforms.uElevationOffset , 'value').min(0).max(0.5).step(0.001).name('ElevationOffset')
    gui.add(material.uniforms.uSmallWaveFrequency , 'value').min(0).max(5).step(0.001).name('SmallWaveFrequency')
    gui.add(material.uniforms.uSmallWaveElevation , 'value').min(0).max(0.5).step(0.001).name('SmallWaveElevation')
    gui.add(material.uniforms.uSmallWaveIteration , 'value').min(1).max(4).step(1).name('SmallWaveIteration')
    gui.add(material.uniforms.uSmallWaveSpeed , 'value').min(0).max(3).step(0.001).name('SmallWaveSpeed')

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(0, -5, 2)
    scene.add(camera)

    //controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    })
    renderer.physicallyCorrectLights = true
    renderer.shadowMap.enabled = true
    renderer.setSize(sizes.width, sizes.height)
    renderer.outputEncoding = THREE.sRGBencoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 3
    renderer.shadowMap.type = THREE.PCFShadowMap




    //resize
    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth,
        sizes.height = window.innerHeight
      //update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
      //update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })


    const clock = new THREE.Clock
    let previousTime = 0
    const tick = () => {
      const elapsTime = clock.getElapsedTime()
      const dt = elapsTime - previousTime
      previousTime = elapsTime

      //update uniform time
      material.uniforms.uTime.value = elapsTime

      //update controls
      control.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()

  }, [])

  return (
    <>
      <canvas className="webgl"></canvas>
    </>
  )
}

export default App
