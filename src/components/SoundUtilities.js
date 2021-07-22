const allNotes=["C", "C#","D","D#","E","F","F#","G","G#","A", "A#", "B"]

function constructScale(startNote, type, octave){
    let intervals
    if(type=="major")
        intervals=[0,2,4,5,7,9,11,12]    
    else if(type=="minor")
        intervals=[0,2,3,5,7,8,10,12]
    const scale=[]
    const startIndex=allNotes.indexOf(startNote)
    for(let i=0;i<7;i++){
        const ind=startIndex+intervals[i]
        // if(ind> 11) 
        // scale.push(allNotes[ind%12]+toString(octave - 1))
        // else
        // scale.push(allNotes[ind]+toString(octave))
        scale.push(allNotes[ind%12]+String(octave+~~(ind/12)))
    }    
    return scale
}

function getChordFromScale(scale, chordNumber){
    return [scale[chordNumber] , scale[(chordNumber+2)%scale.length], scale[(chordNumber+4)%scale.length]]
}

export function getAllChordsInScale(root, type,octave=3){
    console.log("fnc called")
    const chords={}
    const scale=constructScale(root, type, octave).concat(constructScale(root, type , octave+1))
    const bassNotes=constructScale(root, type, octave-1)
    let bassNotes2
    if (octave -2 >0){
        bassNotes2=constructScale(root, type, octave-2)
    }
    for(let i=0;i<7;i++){
        chords[i]=getChordFromScale(scale, i)
        // chords[i].push(bassNotes2[i])
        console.log(chords)
        // if(bassNotes2) chords[i].push(bassNotes2[i])
    }
    console.log(chords)
    return chords
}