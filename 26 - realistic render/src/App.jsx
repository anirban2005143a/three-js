import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import * as dat from 'dat.gui';
import { OrbitControls, GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons.js'
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


    //gui
    const gui = new dat.GUI({ closed: true })

    //loaders
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/')
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    //parameter
    const parameters = {}
    parameters.lightColor = 0xffffff

    //add environment map to meshes
    const addEnvMapToMesh = () => {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          // child.material.envMap = environmentMap
          child.material.envMapIntensity = 3
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }

    //environment map
    const environmentMap = cubeTextureLoader.load([
      '/src/assets/textures/environmentMaps/7/px.png',
      '/src/assets/textures/environmentMaps/7/nx.png',
      '/src/assets/textures/environmentMaps/7/py.png',
      '/src/assets/textures/environmentMaps/7/ny.png',
      '/src/assets/textures/environmentMaps/7/pz.png',
      '/src/assets/textures/environmentMaps/7/nz.png',
    ])
    environmentMap.encoding = THREE.sRGBencoding
    scene.background = environmentMap
    scene.environment = environmentMap


    //models

    gltfLoader.load(
      '/src/assets/models/Burgar/humBarger.glb',
      (gltf) => {
        gltf.scene.scale.set(0.5, 0.5, 0.5)
        gltf.scene.position.set(0, -4, 0)
        gltf.scene.rotation.y = - Math.PI * 0.25
        gui.add(gltf.scene.rotation, 'y').min(0).max(Math.PI * 2).step(0.01).name('halmetRotation')
        scene.add(gltf.scene)

        addEnvMapToMesh()
      }
    )
    const dfre = new THREE.CircleGeometry(3 , 30, 30)
    scene.add(dfre)

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

    //debug panel
    gui.add(directionalLight, 'intensity').min(0).max(10).step(0.01).name('lightIntensity')
    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.01).name('lightX')
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.01).name('lightY')
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.01).name('lightZ')
    // gui.addColor(parameters, 'lightColor').name('lightColor').onChange(() => {
    //   directionalLight.color.set(parameters.lightColor)
    // })

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

    gui.add(renderer, 'toneMapping', {
      no: THREE.NoToneMapping,
      Linear: THREE.LinearToneMapping,
      ACESFilmic: THREE.ACESFilmicToneMapping,
      Cineon: THREE.CineonToneMapping,
      Reinhard: THREE.ReinhardToneMapping
    })
    gui.add(renderer, 'toneMappingExposure').min(0).max(7).step(0.001).name('explosoure')


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
