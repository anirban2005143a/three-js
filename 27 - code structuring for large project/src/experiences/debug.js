
import * as dat from 'dat.gui'

export default class Debug {
    constructor() {

        if (window.location.hash === '#debug') {
            this.active = true
            this.gui = new dat.GUI()
        }else{
            this.active = false
        }
    }
}