import Experience from "../experience";
import * as THREE from 'three'

export default class Environment {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.loadResources
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('Environment')
        }


        this.setLights()
        this.setEnvironmentMap()
    }

    setLights() {
        this.directionalLight = new THREE.DirectionalLight()
        this.directionalLight.castShadow = true
        this.directionalLight.position.set(5.41, -2.14, 8.09)
        this.directionalLight.shadow.camera.far = 20
        this.directionalLight.shadow.camera.right = 20
        this.directionalLight.shadow.camera.left = -20
        this.directionalLight.shadow.camera.top = 20
        this.directionalLight.shadow.camera.bottom = -20
        this.directionalLight.shadow.camera.near = 0.5
        this.scene.add(this.directionalLight)

        // const helper = new THREE.CameraHelper(this.directionalLight.shadow.camera)
        // this.scene.add(helper)

        //debug
        if (this.debugFolder) {
            this.debugFolder.add(this.directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
            this.debugFolder.add(this.directionalLight.position, 'x').min(-10).max(10).step(0.001).name('lightX')
            this.debugFolder.add(this.directionalLight.position, 'y').min(-10).max(10).step(0.001).name('lightY')
            this.debugFolder.add(this.directionalLight.position, 'z').min(-1).max(10).step(0.0001).name('lightZ')

        }
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 2
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.setEnvironmentMap.updateMaterial = () => {
            this.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }

        this.setEnvironmentMap.updateMaterial()

        //debug
        if (this.debugFolder) {
            this.debugFolder.add(this.environmentMap, 'intensity').min(0).max(4).step(0.001).name('envIntensity').onChange(() => {
                this.setEnvironmentMap.updateMaterial()
            })
        }
    }
}