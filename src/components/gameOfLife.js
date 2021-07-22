import { useState, useEffect, useRef } from "react";
import { initializations } from "./livingThings";
import * as Tone from 'tone';
import { getAllChordsInScale } from './SoundUtilities';

const RESOLUTION = 20

let initializeGrid = (numRows, numCols) => {
    console.log("initializing life")
    const grid = [...Array(numRows)].map(_ => Array(numCols).fill(0));
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

const canvasColors = {
    0: "#6B7280",
    1: "#393E46",
    2: "#3B82F6",
    3: "#6B7280",
    4: "#6B7280",
    5: "#6B7280",
    6: "#6B7280"

}
let renderCanvas = ((ctx, grid) => {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row]
            const color = canvasColors[(row + col) % 6]
            ctx.beginPath()
            ctx.rect(col * RESOLUTION, row * RESOLUTION, RESOLUTION, RESOLUTION)
            ctx.fillStyle = cell ? color : '#FFF'
            ctx.fill()
        }
    }
})
console.log("running all lines")

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
            console.log(canvas)
            const numCols = Math.round(canvas.width / RESOLUTION)
            const numRows = Math.round(canvas.height / RESOLUTION)
            grid.current = initializeGrid(numCols, numRows)
            renderCanvas(ctx, grid.current)
        }
        // const updateFunction = () => setGame(() => initializeGrid)
        setupGrid()
        const windowUpdateFunction = () => {
            console.log("windowResized")
            windowUpdated.current = true
        }
        window.addEventListener("resize", windowUpdateFunction)
        let prevTimestamp = 0
        let count = 0
        Tone.Transport.bpm.value = 60
        const synth = new Tone.Synth().toDestination();
        const chordPlayer = new Tone.PolySynth().toDestination();
        const kickDrum = new Tone.MembraneSynth({
            volume: 6
        }).toDestination();

        const bass = new Tone.Synth({
            oscillator: {
                type: "triangle"
            }
        }).toDestination();

        console.log("synth initialized");
        console.log(getAllChordsInScale)
        const chords = getAllChordsInScale("A", "minor");
        Tone.Transport.scheduleRepeat((time) => {
            //instead of scheduling visuals inside of here
            //schedule a deferred callback with Tone.Draw
            count += 1
            console.log(count)
            if(count% 8 ===0){
                bass.triggerAttackRelease("F1", "4n", time)
            }

            // bass.triggerAttackRelease("F1", "8n", time, 0.9)
            kickDrum.triggerAttackRelease("C1", '16n', time, 0.3)
            if (count %  8== 1) {

                // console.log("looping yo! ")
                console.log(time - prevTimestamp)
                prevTimestamp = time
                // console.log(Tone.Transport.position)
                // console.log(Tone.Transport.getTicksAtTime(time))
                // synth.triggerAttackRelease(AMinorScaleWithOctave[count % 8], "16n")
                // chordPlayer.triggerAttackRelease(chords[count % 7], "4n", time)
            }
            if(count%2 ==0){
                Tone.Draw.schedule(() => {
                    //this callback is invoked from a requestAnimationFrame
                    //and will be invoked close to AudioContext time
                    if (windowUpdated.current) {
                        windowUpdated.current = false
                        setupGrid()
                    }
                    
                    grid.current = createNextGeneration(grid.current)
                    renderCanvas(ctx, grid.current)
                }, time) //use AudioContext time of the event
            }
        }, "16n")

        Tone.Transport.start()
        // const update = (timestamp) => {
        //     if (!prevTimestamp) {
        //         prevTimestamp = timestamp
        //     }
        //     if (timestamp - prevTimestamp > 500) {
        //         if(windowUpdated.current){
        //             windowUpdated.current=false
        //             setupGrid()
        //         }
        //         prevTimestamp = timestamp
        //         grid.current = createNextGeneration(grid.current)
        //         renderCanvas(ctx, grid.current)
        //     }
        //     window.requestAnimationFrame(update)
        // }
        // window.requestAnimationFrame(update)

        return () => {
            window.removeEventListener("resize", windowUpdateFunction)
            Tone.Transport.stop()
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
            onClick={() => Tone.start()}
        />
    )
}