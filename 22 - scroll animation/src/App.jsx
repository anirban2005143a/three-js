import { useState, useEffect } from 'react'
import * as THREE from "three"
import * as dat from 'dat.gui';
import "./style.css"
import gsap from 'gsap';

function App() {
  const [width, setwidth] = useState(window.innerWidth)
  const [height, setheight] = useState(window.innerHeight)
  useEffect(() => {
    const canvas = document.querySelector("canvas")

    //sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    //parameters
    const parameters = {}
    parameters.materialColor = 0xffffff
    parameters.lightColor = 0xbfbfbf

    //gui
    const gui = new dat.GUI({ closed: true })
    //scene
    const scene = new THREE.Scene()

    //texture
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load("/src/assets/textures/gradients/3.jpg")
    gradientTexture.magFilter = THREE.NearestFilter

    //material
    const ObjectMaterial = new THREE.MeshToonMaterial({ 
      color: parameters.materialColor ,
      gradientMap:gradientTexture
    })
    //object position
    const objectDistance = 5

    //objects
    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.5, 100, 100),
      ObjectMaterial
    )
    mesh1.geometry.center()
    mesh1.position.x = 1.2
    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32, 32),
      ObjectMaterial
    )
    mesh2.geometry.center()
    mesh2.position.x = -1.2
    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.3, 100, 100),
      ObjectMaterial
    )
    mesh3.geometry.center()
    mesh3.position.x = 1.2
    scene.add(mesh1, mesh2, mesh3)

    const meshArray = [mesh1 , mesh2 , mesh3]

    //set object position
    mesh1.position.y = objectDistance * 0
    mesh2.position.y = - objectDistance * 1
    mesh3.position.y = - objectDistance * 2

    //particles
    const count = 600
    //geometry
    const particles = new THREE.BufferGeometry()
    const positionArr = new Float32Array(count * 3)
    for (let index = 0; index < count; index++) {
      positionArr[index*3 + 0] = (Math.random() - 0.5) * 10
      positionArr[index*3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * meshArray.length
      positionArr[index*3 + 2] = (Math.random() - 0.5) * 10
    }
    particles.setAttribute(
      'position' , 
      new THREE.BufferAttribute(positionArr , 3)
    )

    //material
    const particleMaterial = new THREE.PointsMaterial({
      color:parameters.materialColor,
      sizeAttenuation : true,
      size:0.03
    })
    const points = new THREE.Points(particles , particleMaterial)
    scene.add(points)
   
   

    //camera group
    const cameraGroup = new THREE.Group()
    scene.add(cameraGroup)

    //camera
    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
    camera.position.z = 7
    cameraGroup.add(camera)

    //lights
    const directionalLight = new THREE.DirectionalLight(parameters.lightColor , 6)
    directionalLight.position.set(1.43,-0.17,0)
    scene.add(directionalLight)

    //gui
    gui.addColor(parameters, 'materialColor').onChange(()=>{
      ObjectMaterial.color.set(parameters.materialColor)
      particleMaterial.color.set(parameters.materialColor)
    })
    gui.addColor(parameters, 'lightColor').onChange(()=>{
      directionalLight.color.set(parameters.lightColor)
    })
    gui.add(directionalLight.position , 'x').min(-5).max(5).step(0.01)
    gui.add(directionalLight.position , 'y').min(-5).max(5).step(0.01)
    gui.add(directionalLight.position , 'z').min(-5).max(5).step(0.01)
    gui.add(directionalLight , 'intensity').min(0).max(10).step(0.01)

    //scroll
    let scrollY = window.scrollY , currentSection = 0
    window.addEventListener('scroll' , ()=>{
      scrollY = window.scrollY
      const newSection = Math.round(window.scrollY / sizes.height)
      if(newSection !== currentSection){
        currentSection = newSection
        gsap.to(meshArray[currentSection].rotation , {
          duration:1.5,
          ease:'power2.inOut',
          x:"+=5",
          y:"+=3",
          z:"+=1.5"
        })
      }
    })

    //cursor
    const cursor = {}
    cursor.x = 0
    cursor.y = 0
    window.addEventListener('mousemove' , (e)=>{
      cursor.x = e.clientX / sizes.width - 0.5
      cursor.y = - e.clientY / sizes.height + 0.5
    })

    //renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true
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
    let previousTime = 0
    const tick = () => {

      const elaspTime = clock.getElapsedTime()
      const dt = elaspTime - previousTime
      previousTime = elaspTime
      // console.log(dt)

      //animate camera
      camera.position.y = - (scrollY / sizes.height) * objectDistance + 0.15

      const parallaxX = cursor.x
      const parallaxY = cursor.y

      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * dt * 5
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * dt * 5

      //animate object
      for (const mesh of meshArray) {
        mesh.rotation.x += dt * 0.12 * 3
        mesh.rotation.y += dt * 0.23 * 1
      }

      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()

  }, [])


  useEffect(() => {
    const HtmlContent = Array.from(document.getElementsByClassName("content"))
    
    HtmlContent.forEach((item)=>{
      // item.style.width = `${window.innerWidth}px`
      item.style.height = `${window.innerHeight}px`
    })

    window.addEventListener('resize' , ()=>{
      HtmlContent.forEach((item)=>{
        // item.style.width = `${window.innerWidth}px`
        item.style.height = `${window.innerHeight}px`
      })
    })
  }, [])
  

  return (
    <div className='mainContent' style={{ backgroundColor: 'transparent', overflow: "hidden" }}>
      <canvas className="webgl" style={{ position: "fixed", zIndex: -1 }}></canvas>

      <div className="htmlText" style={{marginLeft:"40px" , marginRight:"40px"}}>
        <div className="content" style={{width : "100%" , display:"flex" ,alignItems:"center" , justifyContent:"start" ,  fontSize: "50px", color: "#6b6e9f", fontWeight: "bold", textAlign: 'start' }}>Anirban</div>
        <div className="content" style={{width : "100%" , display:"flex" ,alignItems:"center" , justifyContent:"end" ,  fontSize: "50px", color: "#6b6e9f", fontWeight: "bold", textAlign: "end" }}>Kolkata</div>
        <div className="content" style={{width : "100%" , display:"flex" ,alignItems:"center" , justifyContent:"start" ,  fontSize: "50px", color: "#6b6e9f", fontWeight: "bold", textAlign: 'start' }}>Subham</div>
      </div>
    </div>

  )
}

export default App
