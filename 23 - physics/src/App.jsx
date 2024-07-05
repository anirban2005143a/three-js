import { useState, useEffect } from 'react'
import * as THREE from "three"
import "./style.css"
import * as dat from 'dat.gui';
import * as CANNON from 'cannon-es'
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

    //sound
    const sound = new Audio("/src/assets/sounds/hit.mp3")
    const playHitSound = (collision) => {
      const impact = collision.contact.getImpactVelocityAlongNormal()
      if (impact > 1.5) {
        sound.volume = Math.random()
        sound.currentTime = 0
        sound.play()
      }
    }

    //gui
    const gui = new dat.GUI({ closed: true })
    const debugObject = {}

    //world
    const world = new CANNON.World()
    world.broadphase = new CANNON.SAPBroadphase(world)
    world.allowSleep = true
    world.gravity.set(0, 0, -9.8)

    //material
    const defaultMaterial = new CANNON.Material('concret')

    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.5,
        restitution: 0.6
      }
    )
    world.addContactMaterial(defaultContactMaterial)
    world.defaultContactMaterial = defaultContactMaterial

    //floor bosy
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body()
    floorBody.mass = 0
    floorBody.addShape(floorShape)
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 0, 1),
      Math.PI * 0.25
    )
    world.addBody(floorBody)

    //parameter
    const parameters = {}
    parameters.lightColor = 0xffffff

    //objects
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 60, 60),
      new THREE.MeshStandardMaterial({ color: 0x4d4e4a })
    )
    plane.material.roughness = 0.5
    plane.rotation.z = Math.PI * 0.25
    scene.add(plane)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.set(-0.13, -20.49, 15)
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

    const objectToUpdate = []

    //functions
    //sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
    const material = new THREE.MeshStandardMaterial({
      metalness: 0.5,
      roughness: 0.2
    })

    //box
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 32, 32)

    const createSphere = (radius, position) => {
      //three js sphere
      const mesh = new THREE.Mesh(sphereGeometry, material)
      mesh.castShadow = true
      mesh.scale.set(radius, radius, radius)
      scene.add(mesh)

      // cannon js sphere
      const shape = new CANNON.Sphere(radius)
      const body = new CANNON.Body({
        shape,
        mass: 1,
        material: defaultMaterial
      })
      body.position.copy(position)
      body.addEventListener('collide', playHitSound)
      world.addBody(body)

      //add object
      objectToUpdate.push({ mesh, body })
    }
    createSphere(Math.random() * 1.2,
      {
        x: Math.random() * 2,
        y: Math.random() * 2,
        z: Math.random() + 5
      })
    //add to gui
    debugObject.createSphere = () => {
      createSphere(Math.random() * 1.2,
        {
          x: Math.random() * 2,
          y: Math.random() * 2,
          z: Math.random() + 5
        })
    }
    gui.add(debugObject, 'createSphere')


    const createBox = (x, y, z, position) => {
      //three js box
      const mesh = new THREE.Mesh(boxGeometry, material)
      mesh.scale.set(x, y, z)
      mesh.castShadow = true
      scene.add(mesh)

      //cannon js box
      const shape = new CANNON.Box(new CANNON.Vec3(x * 0.5, y * 0.5, z * 0.5))
      const body = new CANNON.Body({
        shape,
        mass: 1,
        material: defaultMaterial
      })
      body.position.copy(position)
      body.addEventListener('collide', playHitSound)
      world.addBody(body)

      //add to object array
      objectToUpdate.push({ mesh, body })
    }
    //add to gui
    debugObject.createBox = () => {
      createBox(
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2,
        {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
          z: Math.random() + 5
        }
      )
    }
    gui.add(debugObject, 'createBox')

    //remove all
    const reset = ()=>{
      //remove body
      for (const object of objectToUpdate) {
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)
      }

      //remove mesh
      for (const object of objectToUpdate) {
        scene.remove(object.mesh)
      }

      //clear object
      objectToUpdate.splice(0 , objectToUpdate.length)
    }
    debugObject.reset = ()=>{reset()}
    gui.add(debugObject , 'reset')

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

      //update objects
      for (const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
      }

      //update physics world
      world.step(1 / 60, dt, 3)


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
