import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import vertexShader from './shaders/test/vertex.glsl'
import fragmentShader from './shaders/test/fragment.glsl'

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
    const gui = new dat.GUI()

    //texture
    const textureLoader = new THREE.TextureLoader()
    const flag = textureLoader.load('/src/assets/Flag_of_India.svg.png')


    //parameter
    const parameters = {}
    parameters.lightColor = 0xffffff

    //object
    const geometry = new THREE.PlaneGeometry(8,8,80,80)
    
    const count = geometry.attributes.position.count
    const randoms = new Float32Array(count)
    for (let index = 0; index < count; index++) {
     randoms[index] = Math.random()
    }
    geometry.setAttribute('Arandom' , new THREE.BufferAttribute(randoms , 1))
    


    const material = new THREE.RawShaderMaterial({
      vertexShader : vertexShader,
      fragmentShader : fragmentShader ,
      transparent:true,
      uniforms : {
        uFrequency : { value : new THREE.Vector2(2.5,2)},
        uTime : { value : 0},
        uColor : { value : new THREE.Color('cyan')},
        uTexture : { value : flag}
      }
    })
    console.log(material.uniforms.uFrequency)
    gui.add(material.uniforms.uFrequency.value , 'x').min(0).max(10).step(0.001).name('frequencyX')
    gui.add(material.uniforms.uFrequency.value , 'y').min(0).max(10).step(0.001).name('frequencyY')


    const object = new THREE.Mesh(geometry , material)
    object.material.side = THREE.DoubleSide
    object.scale.y = 2/3
    scene.add(object)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(0, 0, 15)
    scene.add(camera)

    //lights
    const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 1)
    directionalLight.position.set(0.39, 3.53, 1.9)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.normalBias = 0.05
    scene.add(directionalLight)

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

      //updtae material
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
