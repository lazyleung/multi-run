//Highlevel control of game
var player;
var timeInterval = 25;
var timer;
var progress;
var background;
var level;

function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");

	//Screen split up 16x8 blocks
	window.block_x = canvasWidth/16;
	window.block_y = canvasHeight/8;

	//Create new player
	player = new Player(2*window.block_x, canvasHeight - 1*window.block_y);

	// Add timer
	timer = new Timer(5);
	progress = 0;

	//Create new background
	background = new Background();

	level = new Level(1);
	console.log(level.level_data);

	window.flat_img = new Image();
	flat_img.src = "/images/flat.png";

	//Start the game
	startGame();
	draw();
}

function draw() {
	//Clear context
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	
	//Draw background
	background.draw();

	//Draw elements that we will be scrolling through
	ctx.save();
	ctx.translate(2*window.block_x - player.xOffset, 0);

	//Draw Level
	level.draw(player.x);
	//Draw player
	player.draw();

	ctx.restore();

	//Draw GUI
	timer.draw();
}

function update() {
	background.update();
	player.update(level.terrain_data);
	timer.update();
	draw();
}

function startGame() {
	var gameInterval = setInterval(update, timeInterval);
}