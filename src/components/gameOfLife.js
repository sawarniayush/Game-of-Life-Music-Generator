import { useState, useEffect, useRef } from "react";
import { initializations } from "./livingThings";
import * as Tone from 'tone';
import { getAllChordsInScale } from './SoundUtilities';

const RESOLUTION = 15

function setupGrid(canvas, grid, blueBlackGray ) {
    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
    const numCols = Math.round(canvas.current.width / RESOLUTION)
    const numRows = Math.round(canvas.current.height / RESOLUTION)
    grid.current = initializations[0].initialize(numRows, numCols)

    blueBlackGray.current = [...Array(numCols)].map(_ => [0, 0, 0])
}

function createNextGeneration(oldGrid) {
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
function renderCanvas(ctx, grid, blueBlackGray) {
    blueBlackGray.current = [...Array(grid[0].length)].map(_ => [0, 0, 0])
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
                const cell = grid[r][c]
                const color = canvasColors[(r + c) % 6]
                if (cell && blueBlackGray) {
                    if ((r + c) % 6 == 1)
                        blueBlackGray.current[c][1] += 1
                    else if ((r + c) % 6 == 2)
                        blueBlackGray.current[c][2] += 1
                    else {
                        blueBlackGray.current[c][0] += 1
                    }
                }
                ctx.beginPath()
                ctx.rect(c * RESOLUTION, r * RESOLUTION, RESOLUTION, RESOLUTION)
                ctx.fillStyle = cell ? color : '#FFF'
                ctx.fill()
        }
    }

}
function drawGreenLine(count, ctx, grid) {
    const col = count % grid[0].length
    const prevCol = (count -1 + grid[0].length) % grid[0].length

    for (let r = 0; r < grid.length; r++) {
        if (grid[r][col] == 0) {
            ctx.beginPath()
            ctx.rect( col * RESOLUTION,r * RESOLUTION, RESOLUTION, RESOLUTION)
            ctx.fillStyle = '#D1FAE5'
            ctx.fill()
        }
        if(grid[r][prevCol]==0){
            ctx.beginPath()
            ctx.rect( prevCol * RESOLUTION,r * RESOLUTION, RESOLUTION, RESOLUTION)
            ctx.fillStyle = '#FFF'
            ctx.fill()
        }
    }
}
// function getDrumBeats(blueBlackGray){
//     let col= count%blueBlackGray.length
//     console.log(`count: ${count} : ${blueBlackGray[col]}`)
//     if(blueBlackGray[col][2]){
//         return blueBlackGray[col][0] %3;
//     }
//     console.log("ret false")
//     return null
// }


export default function GameOfLife(props) {

    let grid = useRef(null)
    let blueBlackGray = useRef([])
    let canvasRef = useRef(null)
    let windowUpdated = useRef(true)
    let ctx
    let isPaused = useRef(false)

    //Things to do when the component in instantiated
    useEffect(() => {
        const windowUpdateFunction = () => {
            windowUpdated.current = true
        }
        window.addEventListener("resize", windowUpdateFunction)
        return () => {
            window.removeEventListener("resize", windowUpdateFunction)
        }
    }, [])

    //Things that depend the passed props
    useEffect(() => {
        ctx = canvasRef.current.getContext('2d')
        let animationId = null
        let instruments = {
            chords: new Tone.PolySynth({
                volume: -5
            }).toDestination(),
            drums: new Tone.MembraneSynth({ volume: 6 }).toDestination(),
            bass: new Tone.Synth({ oscillator: { type: "triangle" } }).toDestination(),
        }
        let drumLoop = null
        if (props.gameState.isMusicOn) {
            const pauseTheGame = () => { isPaused.current = true }
            const startTheGame = () => { isPaused.current = false }
            Tone.start()
            let drumNotes = null
            let drumUpdate = new Tone.Loop((time) =>  {
                let notes=["C1", "C2", "G1","F1"]
                let newDrumNotes=[]
                for(let i=0;i<16;i++){
                    if(blueBlackGray.current[i][2] || blueBlackGray.current[i][1]){
                        let newNote=notes[blueBlackGray.current[i][0]%notes.length]
                        
                        newDrumNotes.push(newNote)
                    }
                    else
                    newDrumNotes.push(null)
                }
                drumLoop=newDrumNotes
            }, "10:0:0")
            let bassNotes= null

            drumUpdate.start(0)
            let gameTransitionLoop = new Tone.Loop((time) => {
                Tone.Draw.schedule(() => {
                    if (windowUpdated.current) {
                        windowUpdated.current = false
                        setupGrid(canvasRef, grid, blueBlackGray)
                        renderCanvas(ctx, grid.current, blueBlackGray)
                    }
                    else if (!isPaused.current) {
                        grid.current = createNextGeneration(grid.current)
                        renderCanvas(ctx, grid.current, blueBlackGray)
                    }
                }, time)
            }, "1:0:0")
            gameTransitionLoop.start(0)
            let count = 0
            let beatsLoop = new Tone.Loop((time) => {
                if(drumLoop[count%16]){
                    instruments.drums.triggerAttackRelease(drumLoop[count%16], '64n',time )
                }
                // Tone.Draw.schedule(() => {
                //     drawGreenLine(count, ctx, grid.current)
                // }, time)
                count += 1
            }, "8n")
            beatsLoop.start()

            Tone.Transport.start()
        }
        else if (props.gameState.isAnimationOn) {
            let prevTimestamp = null
            const update = (timestamp) => {
                if (!prevTimestamp || timestamp - prevTimestamp > 500) {
                    if (windowUpdated.current) {
                        windowUpdated.current = false
                        setupGrid(canvasRef, grid, blueBlackGray)
                    }
                    prevTimestamp = timestamp
                    renderCanvas(ctx, grid.current, blueBlackGray)
                    grid.current = createNextGeneration(grid.current)
                }
                animationId = window.requestAnimationFrame(update)
                // console.log("upcoming animationId" + animationId)
            }
            animationId = window.requestAnimationFrame(update)
        }
        return () => {
            if (animationId) window.cancelAnimationFrame(animationId)

            if (Tone.Transport.state === "started") Tone.Transport.stop()
        }

    }, [props.gameState])

    // useEffect(() => {
    //     const canvas = canvasRef.current
    //     const ctx = canvas.getContext('2d')
    //     const setupGrid = () => {
    //         canvas.width = window.innerWidth
    //         canvas.height = window.innerHeight
    //         const numCols = Math.round(canvas.width / RESOLUTION)
    //         const numRows = Math.round(canvas.height / RESOLUTION)
    //         grid.current = initializeGrid(numCols, numRows)
    //         renderCanvas(ctx, grid.current)
    //     }
    //     setupGrid()
    //     const windowUpdateFunction = () => {
    //         console.log("windowResized")
    //         windowUpdated.current = true
    //     }
    //     window.addEventListener("resize", windowUpdateFunction)
    //     let prevTimestamp = 0
    //     let count = 0
    //     Tone.Transport.bpm.value = 60
    //     const synth = new Tone.Synth().toDestination();
    //     const chordPlayer = new Tone.PolySynth().toDestination();
    //     const kickDrum = new Tone.MembraneSynth({
    //         volume: 6
    //     }).toDestination();

    //     const bass = new Tone.Synth({
    //         oscillator: {
    //             type: "triangle"
    //         }
    //     }).toDestination();

    //     console.log("synth initialized");
    //     console.log(getAllChordsInScale)
    //     const chords = getAllChordsInScale("A", "minor");
    //     Tone.Transport.scheduleRepeat((time) => {
    //         //instead of scheduling visuals inside of here
    //         //schedule a deferred callback with Tone.Draw
    //         count += 1
    //         console.log(count)
    //         if (count % 8 === 0) {
    //             bass.triggerAttackRelease("F1", "4n", time)
    //         }

    //         // bass.triggerAttackRelease("F1", "8n", time, 0.9)
    //         kickDrum.triggerAttackRelease("C1", '16n', time, 0.3)
    //         if (count % 8 == 1) {

    //             // console.log("looping yo! ")
    //             console.log(time - prevTimestamp)
    //             prevTimestamp = time
    //             // console.log(Tone.Transport.position)
    //             // console.log(Tone.Transport.getTicksAtTime(time))
    //             // synth.triggerAttackRelease(AMinorScaleWithOctave[count % 8], "16n")
    //             // chordPlayer.triggerAttackRelease(chords[count % 7], "4n", time)
    //         }
    //         if (count % 2 == 0) {
    //             Tone.Draw.schedule(() => {
    //                 //this callback is invoked from a requestAnimationFrame
    //                 //and will be invoked close to AudioContext time
    //                 if (windowUpdated.current) {
    //                     windowUpdated.current = false
    //                     setupGrid()
    //                 }

    //                 grid.current = createNextGeneration(grid.current)
    //                 renderCanvas(ctx, grid.current)
    //             }, time) //use AudioContext time of the event
    //         }
    //     }, "16n")

    //     // Tone.Transport.start()
    //     // const update = (timestamp) => {
    //     //     if (!prevTimestamp) {
    //     //         prevTimestamp = timestamp
    //     //     }
    //     //     if (timestamp - prevTimestamp > 500) {
    //     //         if(windowUpdated.current){
    //     //             windowUpdated.current=false
    //     //             setupGrid()
    //     //         }
    //     //         prevTimestamp = timestamp
    //     //         grid.current = createNextGeneration(grid.current)
    //     //         renderCanvas(ctx, grid.current)
    //     //     }
    //     //     window.requestAnimationFrame(update)
    //     // }
    //     // window.requestAnimationFrame(update)

    //     return () => {
    //         window.removeEventListener("resize", windowUpdateFunction)
    //         Tone.Transport.stop()
    //     }
    // }, [])
    // Tone.Transport.schedule(pauseTheGame, "1:3:0")
    // let drumSampleLoop = new Tone.Loop((time) => {
    //     // console.log("setting up drums")
    //     console.log(Tone.Transport.position)
    // }, "16n")
    // drumSampleLoop.start("2:0:1").stop("6:0:0")
    // Tone.Transport.schedule(startTheGame, "6:1:0")
    return (
        <canvas
            id='game-of-life'
            ref={canvasRef}
            style={{
                position: 'fixed',
                left: 0,
                bottom: 0,
                zIndex: -1
            }}
            
            onClick={() => Tone.start()}
        />
    )
}