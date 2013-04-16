//Highlevel control of game
var player;
var timeInterval = 25;
var timer;

function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");
	
	//Create new player
	player = new Player(350, 300);
	// Add timer
	timer = new Timer(5);

	//Start the game
	startGame();
	draw();


}


function draw() {
	// Clear context
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	//Draw all elements
	ctx.save();
	ctx.translate(350 - player.xOffset, 0);
	ctx.fillStyle = "rgba(0,0,0,0.9)";
	ctx.fillRect(canvasWidth/2 - 300, canvasHeight/2 - 300, 600, 600);

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