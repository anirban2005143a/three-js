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
    const meshBox = new THREE.Mesh(boxGeometry , material)
    const meshTorus = new THREE.Mesh(torus, material)
    meshTorus.position.x = 1
    const meshPlane = new THREE.Mesh(plane, material)
    meshPlane.position.z = -1
    meshPlane.position.y = -0.5
    scene.add(meshSphere, meshPlane, meshTorus , meshBox)
    
   
    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 5
    scene.add(camera)


    //lights
    const ambientLight = new THREE.AmbientLight( 0xffffff , 0.2); 
    // scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0x00fffc , 1)
    directionalLight.position.set(2,-2,0)
    scene.add(directionalLight)

    const hemiSphereLight = new THREE.HemisphereLight(0xff0000 , 0x0000ff , 1)
    hemiSphereLight.position.set(1,-0.5,-0.5)
    scene.add(hemiSphereLight) 

    const pointLight = new THREE.PointLight("blue" , 0.51 , 10 , 2)
    pointLight.position.set(0,-1,-0.5)
    scene.add(pointLight)

    const reactAreaLight = new THREE.RectAreaLight("blue" , 1 , 1,2)
    reactAreaLight.position.set(1,-0.8,1)
    reactAreaLight.lookAt(new THREE.Vector3())
    scene.add(reactAreaLight)

    const spotLight = new THREE.SpotLight("yellow" , 2 , 20 , Math.PI * 0.15 , 0.2 , 2)
    spotLight.position.set(0,1,1)
    spotLight.target.position.x = -0.5
    scene.add(spotLight.target)
    scene.add(spotLight)

    //axix helper
    const axis = new THREE.AxesHelper()
    scene.add(axis)
    //controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })

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
