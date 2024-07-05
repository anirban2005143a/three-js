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

    //gltf loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/')
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    let mixer = null
    gltfLoader.load(
      "/src/assets/models/Burgar/humBarger.glb",
      (gltf) => {
        gltf.scene.scale.set(0.25,0.25,0.25)
        gltf.scene.rotation.x = Math.PI * 0.5
        scene.add(gltf.scene)
      }
    )

    //gui
    const gui = new dat.GUI({ closed: true })

    //parameter
    const parameters = {}
    parameters.lightColor = 0xffffff

    //objects
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 60, 60),
      new THREE.MeshStandardMaterial({ color: 0x4d4e4a })
    )
    plane.material.roughness = 0.5
    plane.rotation.z = Math.PI * 0.25
    scene.add(plane)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(-0.13, -5, 3)
    scene.add(camera)

    //lights
    const ambientLight = new THREE.AmbientLight(parameters.lightColor, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 3)
    directionalLight.position.set(4.41, 2.14, 4.09)
    scene.add(directionalLight)

    //controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //shadows
    plane.receiveShadow = true
    directionalLight.castShadow = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.shadowMap.enabled = true
    renderer.setSize(sizes.width, sizes.height)


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
