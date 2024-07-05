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

    //texture
    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/src/assets/particles/2.png')

    //scene
    const scene = new THREE.Scene()

    //geometry
    const particleGrometry = new THREE.BufferGeometry()

    const count = 3000
    const positionArray = new Float32Array(count * 3)
    const colors = new Float32Array(count *3)
    for (let index = 0; index < positionArray.length; index++) {
      positionArray[index] = Math.random()*5 - 2.5
      colors[index] = Math.random()
    }
    particleGrometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positionArray , 3)
    )
    particleGrometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors , 3)
    )

    //material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.2,
      sizeAttenuation: true
    })
    // particleMaterial.color = new THREE.Color()
    particleMaterial.transparent = true
    particleMaterial.alphaMap = particleTexture
    // particleMaterial.alphaTest = 0.001
    // particleMaterial.depthTest = false
    particleMaterial.depthWrite = false
    particleMaterial.blending = THREE.AdditiveBlending
    particleMaterial.vertexColors = true

    //particle
    const particle = new THREE.Points(particleGrometry, particleMaterial)
    scene.add(particle)


    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 3
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

    const clock = new THREE.Clock()

    const tick = () => {

      const elaspTime = clock.elapsedTime

      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particleGrometry.attributes.position.array[i3 + 0]
        
        particleGrometry.attributes.position.array[i3 + 1] = Math.sin((elaspTime + x)*1.5)
      }
      particleGrometry.attributes.position.needsUpdate = true
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
