import EventEmitter from "./eventEmiter"

export default class Sizes extends EventEmitter {
    constructor() {

        super()

        //set up
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //resize event
        window.addEventListener('resize', () => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.trigger('resize')
        })

    }
}