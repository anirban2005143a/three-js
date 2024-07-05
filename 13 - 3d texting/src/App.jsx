import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import * as dat from 'dat.gui'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { FontLoader } from 'three/examples/jsm/Addons.js';

function App() {
  // console.log(THREE)
  useEffect(() => {
    const canvas = document.querySelector("canvas")
    const gui = new dat.GUI()
    //sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    //texture
    const textureLoader = new THREE.TextureLoader
    const matcapTexture = textureLoader.load("./assets/matcap/00005.png")

    //font loader
    const fontLoader = new FontLoader
    fontLoader.load("/src/assets/Modern_Regular.json", (font) => {
      const textGeometry = new TextGeometry(
        'hello guys',
        {
          font: font,
          size: 0.6,
          depth: 0.2,
          curveSegments: 5,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.01,
          bevelOffset: 0,
          bevelSegments: 5
        }
      )
      // textGeometry.computeBoundingBox()
      // console.log(textGeometry.boundingBox)
      // textGeometry.translate(
      //   - (textGeometry.boundingBox.max.x - 0.01) * 0.5 ,
      //   0,
      //   - (textGeometry.boundingBox.max.z - 0.03) * 0.5 ,
      // )
      textGeometry.center()
      
      const textMterial = new THREE.MeshNormalMaterial
      const text = new THREE.Mesh(textGeometry , textMterial)
      scene.add(text)

      const donutgeometry = new THREE.TorusGeometry(0.5 , 0.2 , 20,40)
      const donutmaterial =  new THREE.MeshNormalMaterial
      for (let index = 0; index < 1000; index++) {
        const donut = new THREE.Mesh(donutgeometry , donutmaterial)
        scene.add(donut)
        donut.position.x = ((Math.random()*1) - 0.5) * 40
        donut.position.y = ((Math.random()*1) - 0.5) * 40
        donut.position.z = ((Math.random()*1) - 0.5) * 40

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale , scale , scale)
      }

    })

    //scene
    const scene = new THREE.Scene()

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
