import EventEmitter from "./eventEmiter";

export default class Time extends EventEmitter {
    constructor() {
        super()

        this.start = Date.now()
        this.currentTime = this.start
        this.elaspTime = 0
        this.dt = 10


        this.tick()

    }

    tick() {

        const currentTime = Date.now()
        this.dt = currentTime - this.currentTime
        this.currentTime = currentTime
        this.elaspTime = this.currentTime - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })

    }
}