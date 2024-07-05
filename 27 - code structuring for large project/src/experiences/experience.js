import { update } from "three/examples/jsm/libs/tween.module.js"
import Sizes from "./utils/sizes"
import * as THREE from 'three'
import Time from "./utils/time"
import Camera from "./camera"
import Rendere from "./rendere"
import World from "./world/world"
import LoadResources from "./utils/loadResources"
import sources from "./sources"
import Debug from "./debug"

let instance = null

export default class Experience {
    constructor(canvas) {
        //window 
        window.experince = this

        if (instance) {
            return instance
        }

        instance = this

        //options
        this.canvas = canvas

        //set up
        this.debug = new Debug
        this.loadResources = new LoadResources(sources)
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.rendere = new Rendere()
        this.world = new World()

        //resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        //time tick event
        this.time.on('tick', () => {
            this.update()
        })

        // //destroy butoon debug ui
        // if (this.debug.active) {
        //     this.debug.gui.add(this, 'distroy').name('distroyAll')
        // }

    }

    resize() {
        this.camera.resize()
        this.rendere.resize()
    }

    update() {
        this.camera.update()
        this.rendere.update()
        this.world.update()
    }

    distroy() {

        this.time.off('tick')
        this.sizes.off('resize')

        //dispose all geometry and materials
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        //dispose control
        this.camera.control.dispose()
        //dispose rendere
        this.rendere.rendere.dispose()
        //destroy debug ui
        if (this.debug.active) {
            this.debug.gui.destroy()
        }
    }
}