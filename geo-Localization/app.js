var latitude=0;
var longitude=0;

let a=0;
const POSSIBLE_POSITIONS = Array(...[0, 1, 2, 3]).flatMap(i =>
    Array(...[0, 1, 2, 3]).map(j => [i, j])
)

class Board {
    constructor() {
        this.pieces = []
    }
    generateBoard() {
        let positions = [...POSSIBLE_POSITIONS]
        this.pieces = POSSIBLE_POSITIONS.map(pos => {
            const randomPos = positions.splice(
                Math.floor(Math.random() * positions.length),
                1
            )[0]
            return new Piece(pos[0], pos[1], randomPos[0], randomPos[1])
        })
    }
}
const board = new Board()


class Piece {
    constructor(curr_x,curr_y,dest_x,dest_y) {
        this.curr_pos={
            x:curr_x,
            y:curr_y
        }
        this.dest_pos={
            x:dest_x,
            y:dest_y
        }
    }
}
let shuffled_arr=[];

function shuffle_array()
{
    let Pieces_arr=[];
    for(let i=0;i<4;i++){
        for(let j=0;j<4;j++) {
            Pieces_arr.push(new Piece(200*i,200*j,200*i,200*j));
        }
    }
    shuffled_arr = JSON.parse(JSON.stringify( Pieces_arr ));
    let range=Pieces_arr.length;
    let for_range=Pieces_arr.length;

    for(let i=0;i<for_range;i++)
    {
        // console.log(Pieces_arr[i]);
        let a=Math.floor(Math.random() * range);
        let tempx_s = shuffled_arr[i].dest_pos.x;
        let tempy_s = shuffled_arr[i].dest_pos.y;

        let tempx_a = Pieces_arr[a].dest_pos.x;
        let tempy_a = Pieces_arr[a].dest_pos.y;
        if(i < for_range-1) {
            while (tempx_s === tempx_a && tempy_s === tempy_a) {
                a = Math.floor(Math.random() * range);
                tempx_a = Pieces_arr[a].dest_pos.x;
                tempy_a = Pieces_arr[a].dest_pos.y;
            }
        }
        // console.log(shuffled_arr[i]);
        //console.log(array[a]);

        shuffled_arr[i].dest_pos=Pieces_arr[a].dest_pos;
        Pieces_arr.splice(a,1);
        range--;
    }
}
navigator.geolocation.getCurrentPosition((position)=>{
    latitude=position.coords.latitude;
    longitude=position.coords.longitude;
    generate_map(longitude,latitude);
})
function generate_map(longitude,latitude) {
    let mapOptions = {
        center: [latitude, longitude],
        zoom: 3
    }

    var map = new L.map('map', mapOptions);

    // Creating a Layer object
    var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    map.addLayer(layer);

    document.getElementById("saveButton").addEventListener("click", function () {
        leafletImage(map, function (err, canvas) {
            // here we have the canvas
            board.generateBoard()
            const rasterMap = document.getElementById("rasterMap");
            const rasterContext = rasterMap.getContext("2d");
          /*  for(let piece of board.pieces) {
                rasterContext.drawImage(canvas, piece.curr_pos.x*200,piece.curr_pos.y*200 , 200, 200,
                    piece.dest_pos.x*200, piece.dest_pos.y*200, 200, 200);
            }*/
            shuffle_array();
            for(let i=0;i<shuffled_arr.length;i++) {

                rasterContext.drawImage(canvas, shuffled_arr[i].curr_pos.x,shuffled_arr[i].curr_pos.y , 200, 200,
                    shuffled_arr[i].dest_pos.x, shuffled_arr[i].dest_pos.y, 200, 200);
            }
            rasterContext.beginPath();
            for(let i=1;i<4;i++) {
                rasterContext.moveTo(200*i, 0);
                rasterContext.lineTo(200*i, 800);
                rasterContext.moveTo(0, 200*i);
                rasterContext.lineTo(800, 200*i);
            }
            rasterContext.stroke();
            document.onmousedown=onPuzzleClick();
        });
    });
    function onPuzzleClick(e) {
        const canvas = document.getElementById('rasterMap')
        const context = canvas.getContext('2d')
        const rect = canvas.getBoundingClientRect()

        let activePiece = null

        canvas.addEventListener('click', evt => {
            if (activePiece) {
                console.log(
                    `Przemieszczono ${JSON.stringify(activePiece)} na poz ${JSON.stringify({
                        x: Math.floor((evt.clientX - rect.left) / 100),
                        y: Math.floor((evt.clientY - rect.top) / 100)
                    })}`
                )
                activePiece = null
            } else
                activePiece = {
                    x: Math.floor((evt.clientX - rect.left) / 100),
                    y: Math.floor((evt.clientY - rect.top) / 100)
                }
        })
    }
    document.getElementById("getLocation").addEventListener("click", function (event) {
        if (!navigator.geolocation) {
            console.log("No geolocation.");
        }

        navigator.geolocation.getCurrentPosition(position => {
            console.log(position);
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            map.setView([lat, lon]);
        }, positionError => {
            console.error(positionError);
        });
    });
}