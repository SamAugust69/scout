// // NAME THE THING DARTBOARD

// interface Vector2 {
//     x: number
//     y: number
// }

// type Object = {
//     mass: number // kg
//     velocity: number // m/s
//     accerlation: number // m/s^2
//     position: Vector2 // (x, y)
// }

// class Ocean {
//     objectsInWater: Object[] = []

//     // constants
//     gravity: number = 9.8
//     width: number = 500 // px
//     height: number = 1000 // px

//     oceanStartHeight: number = 100

//     // water stuff
//     waterDensity: number = 1000 // in kg/m^3
//     totalHeight: number = 10 // in screen %

//     constructor() {}

//     drawScreen(context: CanvasRenderingContext2D): void {
//         const waterHeight = (this.totalHeight / 100) * this.height
//         context.fillStyle = "blue"
//         context.fillRect(0, this.oceanStartHeight, this.width, waterHeight)
//     }

//     simulate(context: CanvasRenderingContext2D, interval: number = 16): void {
//         setInterval(() => {
//             context.clearRect(0, 0, this.width, this.height)
//             this.drawScreen(context)
//         }, interval)
//     }
// }

// const object: Object = {
//     mass: 1,
//     accerlation: -9.8,
//     position: { x: 0, y: 0 },
//     velocity: 0,
// }

// const runSimulationStep = (t: number) => {
//     object.velocity = object.velocity + object.accerlation * t
//     console.log(object.velocity)
// // }

// const canvas = document.getElementById("oceanCanvas") as HTMLCanvasElement
// const context = canvas.getContext("2d")

// if (context) {
//     const ocean = new Ocean()
//     ocean.simulate(context)
// }

// console.log("Hello simulation")
