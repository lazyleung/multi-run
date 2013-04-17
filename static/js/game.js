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
	player = new Player(350, 300);

	// Add timer
	timer = new Timer(5);

	//Create new background
	background = new Background();

	//Start the game
	startGame();
	draw();
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
	var level = create_level(["flat","flat","flat","flat","flat","flat"]);


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
