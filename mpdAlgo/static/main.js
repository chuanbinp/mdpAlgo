document.addEventListener('DOMContentLoaded', function initialize(e) {

    var socket = io();
    socket.on('connect', function() {
        socket.emit('client_connect', {data: 'Client connected!'});
    });
    socket.on('backend_response', function(msg) {
        console.log(msg);
    });

    var socketio = io.connect(location.origin + '/uploads', {transports: ['websocket']});

	// Getting elements of arena
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	const ROWS = 20, COLUMNS = 15;
    var roboPath = [];
    
    // Initializing arena to be unexplored
    var map;
    function resetMap() {
        var map = [];
        for (var i = 0; i < ROWS; i++){
            map[i] = [];
            for (var j = 0; j < COLUMNS; j++){
                map[i][j] = 0;
            }
        }
        return map;
    }

    map = resetMap(map);

    
    function getStyle(cell) {
        switch(cell) {
            case 0: return "#1a1e24"; // unexplored
            case 1: return "#F3F3F3"; // explored
            case 2: return "#f44336"; // obstacle
            case 3: return "#30807d"; // start
            case 4: return "#08ae69"; // goal
            case 5: return "#354458"; // robot
            case 6: return "#7acdc8"; // path
            case 7: return "#673ab7"; // way-point
            default: return "#1a1e24";
        }
    }
    //Load File
    document.getElementById('mapName').addEventListener('click', function(e){
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', readFile, false);

    //Reset
	document.getElementById('reset').addEventListener('click', function(e){
		roboPath = [];
        map = resetMap(map);
        drawMap(map);
        console.log("Reset")
    });
    
    //Exploration
    document.getElementById('start').addEventListener('click', function(e){
        document.getElementById('explore').style.display = 'block';
    });
    
    document.getElementById('exp_start').addEventListener('click', function(e){
        e.preventDefault();
		document.getElementById('explore').style.display = 'none';
		var step = document.getElementById('time_step').value;
		var limit = document.getElementById('time').value;
		var coverage = document.getElementById('percentage').value;
        socket.emit('start_exploration', {step: step, limit: limit, coverage: coverage});
        console.log("Start Exploration")
    });
    
    //Fastest Path
    document.getElementById('waypoint').addEventListener('click', function(e){
		document.getElementById('way-point').style.display = 'block';
	});

	document.getElementById('fsp').addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('way-point').style.display = 'none';
		var x = document.getElementById('way-x').value;
		var y = document.getElementById('way-y').value;
        socket.emit('start_fastest_path', {wayx: x, wayy: y});
        console.log("Start Fastest Path")
	});

    //Logger
    (function () {
        var old = console.log;
        var logger = document.getElementById('logs-content');
        console.log = function () {
          for (var i = 0; i < arguments.length; i++) {
            logger.innerHTML += '<br/><small>'+JSON.stringify(new Date())+'</small>';
            if (typeof arguments[i] == 'object') {
                logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(arguments[i], undefined, 2) : arguments[i]) + '<br />';
            } else {
                logger.innerHTML += '<p>' + arguments[i] + '</p>';
            }
            logger.innerHTML += '<br/><hr/>';
          }
        }
    })();


    function readFile (evt) {
        var files = evt.target.files;
        var file = files[0];           
        var reader = new FileReader();
        reader.onload = function(event) {
            //console.log(event.target.result);
            // socket.emit('load_map', {data: event.target.result});
            var list = event.target.result.split("\n").slice(0,-1);
           
            map = [];
            for (var i = 0; i < ROWS; i++) {
                map[i] = Array.from(list[i].split("").map(Number));
              }
            socket.emit('load_map', {loaded_map: map});
            console.log("Sent loaded map to backend");
            
            
            drawMap(map);
            console.log("Loaded map in frontend UI");
        }
        reader.readAsText(file);
        
     };

     function drawMap(map){
        context.save();
        context.strokeStyle = "#252a33";
        context.lineWidth = 3;

        for (var i = 0; i < ROWS; i++){
            for (var j = 0; j < COLUMNS; j++){
                context.beginPath();
                context.fillStyle = getStyle(map[i][j]);
                context.rect(30 * j, 30 * i, 30, 30);
                context.fill();
                context.stroke();
                context.closePath();
            }
            
        }
        context.restore();
     }
});