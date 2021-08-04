import { useEffect, useRef, useState } from "react";
import GameOfLife from "./GameOfLife";


export default function Home(props) {
    let [gameUpdate, setGameUpdate] = useState(false);
    useEffect(
        () => {
            console.log("useEffect called")
            if (gameUpdate) {
                console.log("updating game")
                props.setGameState(
                    {
                        isMusicOn: true,
                        isAnimationOn: false,
                        initialization: null
                    }
                )
            }
        }, [gameUpdate]
    )
    return (
        <>
            {/* <GameOfLife/> */}
            <div className="absolute left-0 top-1/2 text-lg border-black rounded-md bg-white bg-opacity-70 border-8 p-10  mx-5">
                Hi! I am Ayush. <br></br>

                I love Maths, Computer Science and Music.

            </div>
            <button className="absolute right-0 top-1/3 text-lg border-black rounded-md \
        bg-white bg-opacity-80 border-8 p-10  mx-5 w-10 h-10"
                onClick={() => { setGameUpdate(true)}}>
                click
            </button>

        </>
    )
}