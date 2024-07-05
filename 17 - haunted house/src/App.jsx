import { useState, useEffect } from 'react'
import * as THREE from "three"
import * as dat from 'dat.gui';
import "./style.css"
import { OrbitControls, ThreeMFLoader } from 'three/examples/jsm/Addons.js'
import { metalness } from 'three/examples/jsm/nodes/Nodes.js'
function App() {
  // console.log(THREE)

  useEffect(() => {
    const canvas = document.querySelector("canvas")

    //gui 
    const gui = new dat.GUI()
    gui.hide()

    //sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    //scene
    const scene = new THREE.Scene()

    //fog
    const fog = new THREE.Fog( 0x164049 , 2 , 30)
    scene.fog = fog

    //texture


    //geometry and material
    const material = new THREE.MeshStandardMaterial({
      color: 0x8dc393
    })

    const plane = new THREE.PlaneGeometry(15, 15)
    const meshPlane = new THREE.Mesh(plane, material)
    // meshPlane.rotation.z = Math.PI * 0.25
    scene.add(meshPlane)

    //house group
    const house = new THREE.Group()
    scene.add(house)

    //wall
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 2.5, 2),
      new THREE.MeshStandardMaterial({
        color: 0xc1b93e
      })
    )
    wall.position.z = 2 / 2
    house.add(wall)

    //roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(2.5, 1, 4),
      new THREE.MeshStandardMaterial({
        color: 0xe4291b
      })
    )
    roof.rotation.x = Math.PI * 0.5
    roof.rotation.y = Math.PI * 0.25
    roof.position.z = 2 + 0.5
    house.add(roof)

    //door
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0xdbd424
      })
    )
    door.rotation.x = Math.PI * 0.5
    door.position.y = -(2.5 / 2 + 0.01)
    door.position.z = 1.5 / 2
    house.add(door)

    //bushes
    const bush1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 36, 36),
      new THREE.MeshStandardMaterial({
        color: "green"
      })
    )
    bush1.position.set(1, -2.5 / 2 - 0.1, 0.1)
    house.add(bush1)

    const bush2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 36, 36),
      new THREE.MeshStandardMaterial({
        color: "green"
      })
    )
    bush2.position.set(0.5, -2.5 / 2 - 0.5, 0.1)
    house.add(bush2)

    const bush3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 36, 36),
      new THREE.MeshStandardMaterial({
        color: "green"
      })
    )
    bush3.position.set(-1.3, -2.5 / 2 - 0.1, 0.1)
    house.add(bush3)

    const bush4 = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 36, 36),
      new THREE.MeshStandardMaterial({
        color: "green"
      })
    )
    bush4.position.set(-0.5, -2.5 / 2 - 0.1, 0.1)
    house.add(bush4)

    //graves
    const graves = new THREE.Group()
    scene.add(graves)
    const grave = new THREE.BoxGeometry(0.5, 1, 0.2)
    const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x863b05 })
    for (let index = 0; index < 60; index++) {
      const graveMesh = new THREE.Mesh(grave, graveMaterial)
      graveMesh.rotation.x = Math.PI * 0.5
      const value = Math.random() *5 * Math.random()*5
      graveMesh.position.x = (Math.cos(value)) *5 + Math.random()*4 -2
      graveMesh.position.y = (Math.sin(value)) *5 + Math.random()*4 -2
      graveMesh.rotation.y = Math.random() - 0.5
      graveMesh.rotation.z = Math.PI * ((Math.random() -0.5)/7)
      graveMesh.position.z = Math.random()*0.5 
      graveMesh.castShadow = true
      graves.add(graveMesh)
    }

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(0, -12, 6.5)
    camera.rotation.set(0, 0, 0)
    // gui.add(camera.rotation, 'x').min(0).max(Math.PI * 2).step(0.1)
    // gui.add(camera.rotation, 'y').min(0).max(Math.PI * 2).step(0.1)
    // gui.add(camera.rotation, 'z').min(0).max(Math.PI * 2).step(0.1)
    // gui.add(camera.position, 'y').min(-15).max(15).step(0.1)
    // gui.add(camera.position, 'z').min(-15).max(15).step(0.1)
    scene.add(camera)


    //lights
    const ambientLight = new THREE.AmbientLight(0xced8f9, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0x7e99f0, 1)
    directionalLight.position.set(1.8, 3.4, 4.4)
    // gui.add(directionalLight.position , 'x').min(-15).max(15).step(0.1)
    // gui.add(directionalLight.position , 'y').min(-15).max(15).step(0.1)
    // gui.add(directionalLight.position , 'z').min(-15).max(15).step(0.1)
    // gui.add(directionalLight , 'intensity').min(0).max(10).step(0.1)
    scene.add(directionalLight)
    

    //showdes
    directionalLight.castShadow = true
    wall.castShadow = true
    roof.castShadow = true
    bush1.castShadow = true
    bush2.castShadow = true
    bush3.castShadow = true
    bush4.castShadow = true
    meshPlane.receiveShadow = true

    //controls
    const control = new OrbitControls(camera, canvas)
    control.enableDamping = true

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.shadowMap.enabled = true
    renderer.clearColor = "red"
    renderer.setSize(sizes.width, sizes.height)
    renderer.setClearColor(0x164049)

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
