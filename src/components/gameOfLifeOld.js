import { useState, useEffect , useRef} from "react";
import  {initializations} from "./livingThings";
import  * as Tone from 'tone';



let initializeGame = () => {
    console.log("initializing life")
    const numCols = 50;
    const width = window.innerWidth;
    const boxSize = parseInt(width / (numCols - 1))
    const height = window.innerHeight;
    const numRows = parseInt(height / boxSize) + 1;
    const grid = [...Array(numRows)].map(_ => Array(numCols).fill(0));
    // let modulo = Math.floor(1 + Math.random()*(8))
    initializations[0].initialize(grid)

    return {
        boxSize: boxSize,
        numCols: numCols,
        numRows: numRows,
        grid: grid
    }
}

let createNextGeneration = (state) => {
    const newGrid = [...Array(state.numRows)].map(_ => Array(state.numCols).fill(0));
    const oldGrid = state.grid
    const r = state.numRows
    const c = state.numCols
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
    return {
        boxSize: state.boxSize,
        numCols: c,
        numRows: r,
        grid: newGrid
    }
}


export default function GameOfLife(props) {

    let [game, setGame] = useState(initializeGame)


    //Setting up Stuff
    useEffect(() => {
        // setup up window resize 
        // Tone.start()
        console.log("starting  game setup")
        
        const updateFunction = () => setGame(initializeGame)
        window.addEventListener("resize", updateFunction)
        // window.addEventListener('click', async () => {
        //     ref.current=new Tone.MembraneSynth().toDestination();
        //     await Tone.start()
        // })
        // console.log("playing music??")
        const interval = setInterval(() => {
            // if(ref.current)
            // ref.current.triggerAttackRelease("A1", "8n");
            setGame((game)=>createNextGeneration(game))
        }, 10)

        console.log("game setup is done")
        return () => {
            window.removeEventListener("resize", updateFunction)
            clearInterval(interval)
        }
    }, [])

    console.log( "just before return")
    return (

          
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${game.numCols},${game.boxSize}px)`, gridTemplateRows: `repeat(${game.numRows},${game.boxSize}px)` }} >
            {
                game.grid.flatMap((row, i) =>
                    row.map((elem, j) => {
                        let color = (i + j) % 3 ? "bg-black" : "bg-gray-400"
                        return elem === 1 ?
                            <div key = {`${i}:${j}`}  className={`bg-pink-100`}  ></div>
                            : <div  key = {`${i}:${j}`} className=""></div >
                    }
                    )
                )
            }
        </div>
    )
}