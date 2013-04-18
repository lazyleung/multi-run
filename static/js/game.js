//Highlevel control of game
var player;
var timeInterval = 25;
var timer;


function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");
	window.block_x = canvasWidth/16;
	window.block_y = canvasHeight/8;
	//Create new player
	player = new Player(350, 650);

	// Add timer
	timer = new Timer(5);

	//Create new background
	background = new Background();
	window.flat_img = new Image();
	flat_img.src = "/images/flat.png";
	terrainData();
	//Start the game
	startGame();
	draw();

}

function terrainData(){
	var data = level("1");
	console.log(data);
	window.terrain_data = data[0];
	window.pieces_data = data[1];
	console.log(window.terrain_data);
	console.log(window.pieces_data);
}

function draw() {
	// Clear context
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	//Draw all elements
	ctx.save();

	//Draw background
	background.draw();

	ctx.translate(350 - player.xOffset, 0);

	// Draw Level
	for (var i = 0; i < window.pieces_data.length; i++){
		if (window.pieces_data[i] === "flat"){
			//console.log(i, window.pieces_data[i]);
			ctx.drawImage(window.flat_img, i*200,canvasHeight-200, 200, 200)
		}
		else if (window.pieces_data[i] === "jump"){
			console.log("jump!");
		}
	}
	// Draw player
	player.draw(ctx);

	// draw timer
	timer.draw(ctx, player.xOffset);

	ctx.restore();
}

function generateLevel(level, random){
	//Random Level Generation
	if (random === true) {
	}
	//Use Presets
	else {
		var levelData = levels[level]
	}
}

function update() {
	background.update();
	player.update();
	timer.update();
	draw();

}

function startGame() {
	var gameInterval = setInterval(update, timeInterval);
}
//Function for generating random output
function random(numVars) {

}
