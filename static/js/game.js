//Highlevel control of game

function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");
	
	//Create new player
	player = new Player(100, 100);
	//Add control handlers

	draw();

	//Start the game
	startGame();
}

function startGame() {

}

function draw() {
	// Draw player
	player.draw(ctx);
	//Draw all elements
	ctx.fillStyle = "rgba(0,0,0,0.9)";
	ctx.fillRect(canvasWidth/2 - 300, canvasHeight/2 - 300, 600, 600);
}