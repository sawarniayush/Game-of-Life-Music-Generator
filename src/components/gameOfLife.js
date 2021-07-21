import { useState, useEffect, useRef } from "react";
import { initializations } from "./livingThings";
import * as Tone from 'tone';

const RESOLUTION = 20

let initializeGrid = (numRows, numCols) => {
    console.log("initializing life")
    // const numCols = 50;
    // const width = window.innerWidth;
    // const boxSize = parseInt(width / (numCols - 1))
    // const height = window.innerHeight;
    // const numRows = parseInt(height / boxSize) + 1;
    const grid = [...Array(numRows)].map(_ => Array(numCols).fill(0));
    // let modulo = Math.floor(1 + Math.random()*(8))
    initializations[0].initialize(grid)

    return grid
}

let createNextGeneration = (oldGrid) => {
    
    const r = oldGrid.length
    const c = oldGrid[0].length
    const newGrid = [...Array(r)].map(_ => Array(c).fill(0));
    for (let i = 0; i < r; i++) {
        let ui = (r + i - 1) % r
        let li = (r + i + 1) % r
        for (let j = 0; j < c; j++) {
            let lj = (c + j - 1) % c;
            let rj = (c + j + 1) % c;
            let aliveNeightbours = oldGrid[i][lj] + oldGrid[ui][lj] + oldGrid[ui][j] + oldGrid[ui][rj] + oldGrid[i][rj] + oldGrid[li][rj]
                + oldGrid[li][j] + oldGrid[li][lj]
            if (oldGrid[i][j] === 1 && (aliveNeightbours === 3 || aliveNeightbours === 2))
                newGrid[i][j] = 1
            else if (oldGrid[i][j] === 0 && aliveNeightbours === 3)
                newGrid[i][j] = 1
        }
    }
    return newGrid;
}

const canvasColors= {
    0:"#6B7280",
    1:"#393E46",
    2:"#3B82F6",
    3:"#6B7280",
    4:"#6B7280",
    5:"#6B7280",
    6:"#6B7280"

}
let renderCanvas = ((ctx, grid) => {
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const cell = grid[col][row]
        const color = canvasColors[(row+col)%6]
        ctx.beginPath()
        ctx.rect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION)
        ctx.fillStyle = cell ? color : '#FFF'
        ctx.fill()
      }
    }
  })


export default function GameOfLife(props) {

    // let [grid, setGrid] = useState(initializeGame)
    let grid = useRef(null)
    console.log(grid)
    let ref = useRef(null)
    let canvasRef = useRef(null)
    let windowUpdated = useRef(true)
    console.log("rerendering component")
    //Setting up Stuff
    useEffect(() => {
        // setup up window resize 
        // Tone.start()

        console.log("starting  game setup")
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const setupGrid = () => {
            
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            console.log(  canvas)
            const numCols = Math.round(canvas.width / RESOLUTION)
            const numRows = Math.round(canvas.height / RESOLUTION)
            grid.current = initializeGrid(numCols, numRows)
            renderCanvas(ctx, grid.current)
        }
        // const updateFunction = () => setGame(() => initializeGrid)
        setupGrid()
        const windowUpdateFunction= () => {
            console.log("windowResized")
            windowUpdated.current=true
        }
        window.addEventListener("resize", windowUpdateFunction)
        let prevTimestamp=null
        const update = (timestamp) => {
            if (!prevTimestamp) {
                prevTimestamp = timestamp
            }
            if (timestamp - prevTimestamp > 500) {
                if(windowUpdated.current){
                    windowUpdated.current=false
                    setupGrid()
                }
                prevTimestamp = timestamp
                grid.current = createNextGeneration(grid.current)
                renderCanvas(ctx, grid.current)
            }
            window.requestAnimationFrame(update)
        }
        window.requestAnimationFrame(update)

        console.log("game setup is done")
        return () => {
            window.removeEventListener("resize", windowUpdateFunction)
            // clearInterval(interval)
        }
    }, [])

    console.log("just before return")
    return (
        <canvas
            id='game-of-life'
            ref={canvasRef}
            style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                zIndex: -1
            }}
        />
    )
}