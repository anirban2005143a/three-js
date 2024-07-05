import * as THREE from 'three'
import Experience from '../experience'
import Environment from './environment'
import Floor from './floor'
import Fox from './fox'

export default class World{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.loadResources = this.experience.loadResources


        this.loadResources.on('resourcesLoaded' , ()=>{
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })
    }

    update(){
        if(this.fox){
            this.fox.update()
        }
    }
}