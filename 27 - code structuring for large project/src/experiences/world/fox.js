import Experience from "../experience";
import * as THREE from 'three'

export default class Fox {
    constructor() {
        this.experience = new Experience
        this.resources = this.experience.loadResources
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('Fox')
        }

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.foxModel = this.resources.items.foxModel
        this.foxModel.scene.scale.set(0.05, 0.05, 0.05)
        this.foxModel.scene.rotation.x = Math.PI * 0.5
        this.foxModel.scene.rotation.y = - Math.PI * 0.25

        this.foxModel.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                child.castShadow = true
            }
        })

        this.scene.add(this.foxModel.scene)
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.foxModel.scene)
        this.animation.actions = {}
        this.animation.actions.serving = this.animation.mixer.clipAction(this.foxModel.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.foxModel.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.foxModel.animations[2])

        this.animation.actions.current = this.animation.actions.serving

        this.animation.actions.current.play()

        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        //debug
        if (this.debug.active) {
            const debugFolder = {
                playServing: () => { this.animation.play('serving') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugFolder, 'playServing')
            this.debugFolder.add(debugFolder, 'playWalking')
            this.debugFolder.add(debugFolder, 'playRunning')

        }
    }

    update() {
        this.animation.mixer.update(this.time.dt * 0.001)
    }
}