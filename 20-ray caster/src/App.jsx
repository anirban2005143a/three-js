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

    // spheres
    const sphere1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5,32,32),
      new THREE.MeshBasicMaterial({color:"red"})
    )
    const sphere2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5,32,32),
      new THREE.MeshBasicMaterial({color:"red"})
    )
    sphere2.position.set(-2,0,0)
    const sphere3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5,32,32),
      new THREE.MeshBasicMaterial({color:"red"})
    )
    sphere3.position.set(2,0,0)
    scene.add(sphere1,sphere2,sphere3)

    //ray caster
    const rayCaster = new THREE.Raycaster()
    // const rayOrigin = new THREE.Vector3(-3,0,0)
    // const rayPath = new THREE.Vector3(10,0,0)
    // rayPath.normalize()
    // rayCaster.set(rayOrigin , rayPath)
    // const intersect = rayCaster.intersectObject(sphere2)
    // console.log(intersect)

    // const intersects = rayCaster.intersectObjects([sphere1 , sphere2 , sphere3])
    // console.log(intersects)


    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 5
    scene.add(camera)

    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    renderer.setSize(sizes.width, sizes.height)

    //mouse movement
    const mouse = new THREE.Vector2()
    window.addEventListener('mousemove' , (e)=>{
      mouse.x = (e.clientX / (sizes.width /2)) - 1
      mouse.y = -((e.clientY / (sizes.height /2)) - 1)
    
    })

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

      const elaspTime = clock.getElapsedTime()
      //animation
      sphere1.position.y = Math.sin(elaspTime *2) 
      sphere2.position.y = Math.cos(elaspTime *2) 
      sphere3.position.y = Math.sin(elaspTime *2) + Math.cos(elaspTime *2) 

      //cast a ray
      rayCaster.setFromCamera(mouse , camera)
      // const rayOrigin = new THREE.Vector3(-3,0,0)
      // const rayPath = new THREE.Vector3(10,0,0)
      // rayPath.normalize()

      // rayCaster.set(rayOrigin , rayPath)

      const objectArr = [sphere1 , sphere2 , sphere3]
      const intersects = rayCaster.intersectObjects(objectArr)
      
      objectArr.forEach((object)=>{
        object.material.color.set("red")
      })

      intersects.forEach((item)=>{
        item.object.material.color.set("blue")
      })

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
