import { GLTFLoader } from "three/examples/jsm/Addons.js";
import EventEmitter from "./eventEmiter";
import * as THREE from 'three'

export default class LoadResources extends EventEmitter{
    constructor(sources){
        super()

        //sources
        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        //set up
        this.setLoader()
        this.startLoading()
    }

    setLoader(){
        this.gltfLoader = new GLTFLoader()
        this.textureLoader = new THREE.TextureLoader()
        this.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading(){
        for (const item of this.sources) {
            if(item.type === 'gltfModel'){
                this.gltfLoader.load(item.path , (gltf)=>{
                    this.sourceLoaded(item , gltf)
                })
            }
            else if(item.type === 'cubeTexture'){
                this.cubeTextureLoader.load(item.path , (data)=>{
                    this.sourceLoaded(item , data)
                })
            }
            else if(item.type === 'texture'){
                this.textureLoader.load(item.path , (data)=>{
                    this.sourceLoaded(item , data)
                })
            }
        }
    }

    sourceLoaded(source , file){

        this.items[source.name] = file

        this.loaded ++

        if(this.loaded === this.toLoad){
            this.trigger('resourcesLoaded')
        }

    }
}