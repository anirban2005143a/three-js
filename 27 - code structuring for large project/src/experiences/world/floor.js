import Experience from "../experience";
import * as THREE from 'three'
import LoadResources from "../utils/loadResources";

export default class Floor {
    constructor() {
        this.experience = new Experience
        this.scene = this.experience.scene
        this.resources = this.experience.loadResources

        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(10, 60)
    }

    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map : this.texture.color,
            normalMap : this.texture.normal,
            side : THREE.DoubleSide
        })
    }

    setTexture() {
        this.texture = {}

        this.texture.color = this.resources.items.groundColorTexture
        this.texture.color.encoding = THREE.sRGBEncoding
        this.texture.color.repeat.set(1.5, 1.5)
        this.texture.color.wrapS = THREE.RepeatWrapping
        this.texture.color.wrapT = THREE.RepeatWrapping


        this.texture.normal = this.resources.items.groundNormalTexture
        this.texture.normal.repeat.set(1.5, 1.5)
        this.texture.normal.wrapS = THREE.RepeatWrapping
        this.texture.normal.wrapT = THREE.RepeatWrapping
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry , this.material)
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
}