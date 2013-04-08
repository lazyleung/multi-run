//Highlevel control of game
var player;
var gameInterval = 25;

function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");
	
	// Create update interval
	//Create new player
	player = new Player(750, 500);
	//Add control handlers

	draw();

	//Start the game
	startGame();
}

function draw() {

	//Draw all elements
	ctx.fillStyle = "rgba(0,0,0,0.9)";
	ctx.fillRect(canvasWidth/2 - 300, canvasHeight/2 - 300, 600, 600);

	// Draw player
	player.draw(ctx);
}

function update() {
	player.update();
	draw();
}

function startGame() {
	var gameInterval = setInterval(update, gameInterval);

}
