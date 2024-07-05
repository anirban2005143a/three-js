import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { metalness } from 'three/examples/jsm/nodes/Nodes.js'
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

    //geometry and material
    
    const material = new THREE.MeshStandardMaterial()
    material.roughness = 0.1

    const sphere = new THREE.SphereGeometry(0.3, 20, 20)
    const plane = new THREE.PlaneGeometry(5, 5)
    const boxGeometry = new THREE.BoxGeometry(0.6,0.6,0.6)
    const torus = new THREE.TorusGeometry(0.3, 0.1, 10, 20)

    const meshSphere = new THREE.Mesh(sphere, material)
    meshSphere.position.x = -1
    meshSphere.castShadow = true
    const meshBox = new THREE.Mesh(boxGeometry , material)
    meshBox.castShadow = true
    const meshTorus = new THREE.Mesh(torus, material)
    meshTorus.position.x = 1
    meshTorus.castShadow = true
    const meshPlane = new THREE.Mesh(plane, material)
    meshPlane.receiveShadow = true
    meshPlane.position.z = -1
    meshPlane.position.y = -0.5
    scene.add(meshSphere, meshPlane, meshTorus , meshBox)
    
   
    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 5
    scene.add(camera)


    //lights
    const ambientLight = new THREE.AmbientLight( 0x000000 , 0); 
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0x4B70F5 , 2)
    directionalLight.position.set(2,2,2)
    scene.add(directionalLight)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024 
    // directionalLight.shadow.camera.top = 20
    // directionalLight.shadow.camera.right = 20
    // directionalLight.shadow.camera.left = 20
    // directionalLight.shadow.camera.bottom = 20
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 10
    // directionalLight.shadow.radius = 3 
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    directionalLightCameraHelper.visible = false
    scene.add(directionalLightCameraHelper)

    const spotLight = new THREE.SpotLight(0xFFDB00 , 2 , 10 , Math.PI * 0.25 )
    spotLight.position.set(-1.5,1,1)
    scene.add(spotLight)
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.fov = 60
    spotLight.shadow.camera.near = 1
    spotLight.shadow.camera.far = 6
    const spotLightCamera = new THREE.CameraHelper(spotLight.shadow.camera)
    // scene.add(spotLightCamera)

    const pointLight = new THREE.PointLight("blue" , 5)
    pointLight.position.set(0,-1,2)
    pointLight.castShadow = true
    scene.add(pointLight)

    //controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.shadowMap.enabled = true
    renderer.setSize(sizes.width, sizes.height)
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

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

    //fullscreen
    window.addEventListener('dblclick', (e) => {
      const fullScreen = document.fullscreenElement || document.webkitFullscreenElement
      if (!fullScreen) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen()
        }
        else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen()
        }

      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
        else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      }
    })

    const tick = () => {

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
