import { useState, useEffect } from 'react'
import * as THREE from "three"
import * as dat from 'dat.gui';
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { color, mix, step, vertexColor } from 'three/examples/jsm/nodes/Nodes.js';
function App() {
  // console.log(THREE)

  useEffect(() => {
    const canvas = document.querySelector("canvas")

    //sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    //gui
    const gui = new dat.GUI({closed : true})

    //texture
    const textureLoader = new THREE.TextureLoader()

    //scene
    const scene = new THREE.Scene()

    //parameters
    const parameters = {}
    parameters.count = 10000
    parameters.size = 0.02
    parameters.branch = 5
    parameters.spin = 1
    parameters.randomness = 0.2
    parameters.randomnessPower = 3
    parameters.insideColor = "#fd5102"
    parameters.outsideColor = "#2e04fb"
   
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    //galaxy
    let geometry=null , material=null , point=null
    const generateGalaxy = ()=>{

      //destroy old galaxy
      if(point!==null){
        geometry.dispose()
        material.dispose()
        scene.remove(point)
      }

      //geometry
      geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(parameters.count * 3)
      const colors = new Float32Array(parameters.count * 3)
      for (let index = 0; index < parameters.count; index++) {
        const i3 = index * 3
        //position
        const radius = Math.random() * 5
        const spinangle = radius * parameters.spin
        const branchangle = (index % parameters.branch) / parameters.branch * Math.PI *2
      
        const randomX = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ?1:-1 )
        const randomY = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ?1:-1 )
        const randomZ = Math.pow(Math.random() , parameters.randomnessPower) * (Math.random() > 0.5 ?1:-1 )
    
        positions[i3 + 0] = Math.sin(branchangle + spinangle*0.5) * radius + randomX
        positions[i3 + 1] = Math.cos(branchangle + spinangle*0.5) * radius + randomY
        positions[i3 + 2] = randomZ

        //color
        const mixColor = colorInside.clone()
        mixColor.lerp(colorOutside , 0.5)
        colors[i3 + 0] = Math.random()
        colors[i3 + 1] = Math.random()
        colors[i3 + 2] = Math.random()
      }
      geometry.setAttribute(
        'position' , 
        new THREE.BufferAttribute(positions , 3)
      )
      geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors , 3)
      )

      //material
      material = new THREE.PointsMaterial({
        size:parameters.size,
        sizeAttenuation : true,
        depthWrite : false,
        blending : THREE.AdditiveBlending,
        vertexColor : true
      })

      //point
      point = new THREE.Points(geometry , material)
      scene.add(point)
    }
    generateGalaxy()

    //gui
    gui.add(parameters, 'count').min(10000).max(50000).step(50).onFinishChange(generateGalaxy)
    gui.add(parameters , 'size').min(0.001).max(0.5).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameters , 'branch').min(2).max(20).step(1).onFinishChange(generateGalaxy)
    gui.add(parameters , 'spin').min(-5).max(5).step(0.01).onFinishChange(generateGalaxy)
    gui.add(parameters , 'randomness').min(0.2).max(1).step(0.001).onFinishChange(generateGalaxy)
    gui.add(parameters , 'randomnessPower').min(1).max(5).step(0.001).onFinishChange(generateGalaxy)
    gui.addColor(parameters , 'insideColor').onFinishChange(generateGalaxy)
    gui.addColor(parameters , 'outsideColor').onFinishChange(generateGalaxy)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 8
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
