import { useState, useEffect } from 'react'
import Experience from './experiences/experience';

function App() {
  // console.log(THREE)

  useEffect(() => {
    const experience = new Experience(document.querySelector('canvas.webgl'))
  }, [])
  
  // useEffect(() => {
  //   const canvas = document.querySelector("canvas")


  //   //sizes
  //   const sizes = {
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   }

  //   //scene
  //   const scene = new THREE.Scene()

  //   //texture loader
  //   const textureLoader = new THREE.TextureLoader()
  //   const groundTexture = textureLoader.load('/src/assets/textures/ground/brown_mud_03_diff_1k (1).jpg')
  //   // const normalTexture = textureLoader.load('/src/assets/textures/ground/brown_mud_03_nor_gl_1k.jpg')
  //   // const alphaTexture = textureLoader.load('/src/assets/textures/ground/brown_mud_03_spec_1k.jpg')

  //   //gltf loader
  //   // const dracoLoader = new DRACOLoader()
  //   // dracoLoader.setDecoderPath('/node_modules/three/examples/jsm/libs/draco/')
  //   const gltfLoader = new GLTFLoader()
  //   // gltfLoader.setDRACOLoader(dracoLoader)
  //   let mixer = null
  //   gltfLoader.load(
  //     '/src/assets/models/Fox/glTF/Fox.gltf',
  //     (gltf) => {

  //       mixer = new THREE.AnimationMixer(gltf.scene)
  //       const action1 = mixer.clipAction(gltf.animations[0])
  //       action1.play()

  //       const meshes = [...gltf.scene.children]
  //       for (const mesh of meshes) {
  //         mesh.castShadow = true
  //       }

  //       gltf.scene.scale.set(0.08,0.08,0.08)
  //       gltf.scene.rotation.x = Math.PI * 0.5
  //       gltf.scene.rotation.y = - Math.PI * 0.25
  //       scene.add(gltf.scene)
  //     }
  //   )

  //   //gui
  //   const gui = new dat.GUI({ closed: true })

  //   //parameter
  //   const parameters = {}
  //   parameters.lightColor = 0xffffff

  //   //objects
  //   const circularPlane = new THREE.Mesh(
  //     new THREE.CircleGeometry(15 , 60 ),
  //     new THREE.MeshStandardMaterial({
  //       map:groundTexture,
  //     })
  //   ) 
  //   circularPlane.receiveShadow = true
  //   scene.add(circularPlane)


  //   //camera
  //   // const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  //   // camera.position.set(-0.13, -30, 8)
  //   // scene.add(camera)

  //   //lights
  //   const ambientLight = new THREE.AmbientLight(parameters.lightColor, 0.5)
  //   scene.add(ambientLight)

  //   const directionalLight = new THREE.DirectionalLight(parameters.lightColor, 3)
  //   directionalLight.position.set(5.41, -2.14, 8.09)
  //   directionalLight.shadow.camera.far = 20
  //   directionalLight.shadow.camera.right = 5
  //   directionalLight.shadow.camera.left = -8
  //   scene.add(directionalLight)

  //   // const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
  //   // scene.add(cameraHelper)

  //   //controls
  //   // const control = new OrbitControls(camera, canvas)
  //   // control.enableDamping = true

  //   // //shadows
  //   // directionalLight.castShadow = true

  //   // //renderer
  //   // const renderer = new THREE.WebGLRenderer({
  //   //   canvas
  //   // })
  //   // renderer.shadowMap.enabled = true
  //   // renderer.setSize(sizes.width, sizes.height)


  //   // //resize
  //   // window.addEventListener('resize', () => {
  //   //   sizes.width = window.innerWidth,
  //   //     sizes.height = window.innerHeight
  //   //   //update camera
  //   //   camera.aspect = sizes.width / sizes.height
  //   //   camera.updateProjectionMatrix()
  //   //   //update renderer
  //   //   renderer.setSize(sizes.width, sizes.height)
  //   //   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  //   // })


  //   // const clock = new THREE.Clock
  //   // let previousTime = 0
  //   // const tick = () => {
  //   //   const elapsTime = clock.getElapsedTime()
  //   //   const dt = elapsTime - previousTime
  //   //   previousTime = elapsTime

  //   //   //update animation mixer
  //   //   if(mixer){
  //   //     mixer.update(dt)
  //   //   }

  //   //   //update controls
  //   //   control.update()
  //   //   renderer.render(scene, camera)
  //   //   window.requestAnimationFrame(tick)
  //   // }
  //   // tick()

  // }, [])

  return (
    <>
      <canvas className="webgl"></canvas>
    </>
  )
}

export default App
