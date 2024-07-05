import Experience from "./experience";
import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Camera{
    constructor(){
       this.experince = new Experience()
       this.canvas = this.experince.canvas
       this.sizes = this.experince.sizes
       this.scene = this.experince.scene

       this.setCamera()
       this.setOrbitControl()

    }

    setCamera(){
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.camera.position.set(-0.13, -20, 8)
        this.scene.add(this.camera)
    }

    setOrbitControl(){
        this.control = new OrbitControls(this.camera , this.canvas)
        this.control.enableDamping = true
    }

    resize(){
        this.camera.aspect =  this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    }

    update(){
        this.control.update()
    }
}