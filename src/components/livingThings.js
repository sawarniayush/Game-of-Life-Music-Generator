export const famousLifeObjects = [
    {
        name: "Glider",
        size: [6, 6],
        initialize: function(grid, i, j , vOrient = 0, hOrient =0 ){
            const obj = [
                [0, 1, 0],
                [0, 1, 1],
                [1, 0, 1]
            ]
            if(vOrient===0) vOrient=Math.random()>0.5 ? 1:-1
            if(hOrient === 0) hOrient=Math.random()>0.5 ? 1: -1

            const rStart = vOrient === 1 ? i : i+this.size[0] -1
            const cStart= hOrient === 1 ? j : j+this.size[1] -1
            const numRows = grid.length
            const numCols = grid[0].length
            
            obj.forEach((row, x) => row.forEach((val, y) => {
                grid[(rStart + vOrient * x + numRows) % numRows]
                [(cStart + hOrient * y + numCols) % numCols] = val
            }
            ))
            return this.size
        }
    },
    {
        name: "Glider Gun",
        size: [1000, 11],
        initialize: [
            [0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 1],
            [0, 0, 1, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0]
        ]
    },
    {
        name: "Blinker",
        padding: [1, 1],
        jump: [2, 2],
        obj: [
            [1, 1, 1],
        ]
    },
    {

    }
]

export const initializations = [
    {
        name: "theBigX",
        initialize : function(grid){
            let len, iStart, jStart
            if(grid.length> grid[0].length) { 
                len= grid[0].length
                iStart=Math.floor((grid.length - len)/2)
                jStart=0
            }
            else{
                len= grid.length
                jStart=Math.floor((grid[0].length - len)/2)
                iStart=0
            }
            let midWay= Math.floor(len/2)
            for(let i=0;i<midWay;i++){
                grid[iStart+i][jStart+i]=grid[iStart+len-1-i][jStart+len-1-i]=grid[iStart+len-1-i][jStart+i]=grid[iStart+i][jStart+len-1-i]=1
            }
            grid[iStart+midWay][jStart+midWay]=1
        }
    },
    {
        name: "marchingGliders",
        initialize: function(grid){
            
        }
    },

]
// export default famousLifeObjects;