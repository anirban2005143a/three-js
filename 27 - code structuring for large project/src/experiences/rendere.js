import Experience from "./experience";
import * as THREE from 'three'

export default class Rendere{
    constructor(){
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera.camera
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene

        this.setRendere()
    }

    setRendere(){
        this.rendere = new THREE.WebGLRenderer({
            canvas : this.canvas
        })
        this.rendere.shadowMap.enabled = true
        this.rendere.setClearColor(0x222221)
        this.rendere.setSize(this.sizes.width , this.sizes.height)
        this.rendere.setPixelRatio(this.sizes.pixelRatio)
    }

    resize(){
        this.rendere.setSize(this.sizes.width , this.sizes.height)
        this.rendere.setPixelRatio(this.sizes.pixelRatio)
    }

    update(){
        this.rendere.render(this.scene , this.camera)
    }
}