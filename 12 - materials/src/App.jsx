import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
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
    // const material = new THREE.MeshBasicMaterial()
    // material.color = new THREE.Color('yellow')
    // material.color.set('pink')
    // material.wireframe = true
    // material.opacity = 0.5
    // material.transparent = true
    // material.side = THREE.DoubleSide

    // const material = new THREE.MeshNormalMaterial()
    // material.flatShading = true

    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = /*texture*/

    // const material = new THREE.MeshDepthMaterial()

    // const material = new THREE.MeshLambertMaterial()
    // const material = new THREE.MeshPhongMaterial()

    // const material = new THREE.MeshToonMaterial()

    const material = new THREE.MeshStandardMaterial()

    const sphere = new THREE.SphereGeometry(0.3, 20, 20)
    const plane = new THREE.PlaneGeometry(0.5, 0.5)
    const torus = new THREE.TorusGeometry(0.3, 0.1, 10, 20)

    const meshSphere = new THREE.Mesh(sphere, material)
    meshSphere.position.x = -1
    const meshPlane = new THREE.Mesh(plane, material)
    const meshTorus = new THREE.Mesh(torus, material)
    meshTorus.position.x = 1

    scene.add(meshSphere, meshPlane, meshTorus)

    //light
    const ambientLight = new THREE.AmbientLight('white', 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight('white', 0.5)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 2
    scene.add(camera)



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

    const clock = new THREE.Clock
    const tick = () => {
      const elapsTime = clock.getElapsedTime()

      meshSphere.rotation.y = 0.3 * elapsTime
      meshPlane.rotation.y = 0.3 * elapsTime
      meshTorus.rotation.y = 0.3 * elapsTime


      meshSphere.rotation.x = 0.3 * elapsTime
      meshPlane.rotation.x = 0.3 * elapsTime
      meshTorus.rotation.x = 0.3 * elapsTime

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
