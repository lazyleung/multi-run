//Highlevel control of game
var player;
var gameInterval = 25;

function initGame() {
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");
	
	//Create new player
	player = new Player(350, 300);
	//Add control handlers

	draw();

	//Start the game
	startGame();
}


function draw() {
	//Draw all elements
	ctx.save();
	ctx.translate(350 -player.x, 0);
	ctx.fillStyle = "rgba(0,0,0,0.9)";
	ctx.fillRect(canvasWidth/2 - 300, canvasHeight/2 - 300, 600, 600);

	// Draw player
	player.draw(ctx);

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
	draw();

}

function startGame() {
	var gameInterval = setInterval(update, gameInterval);
	drawTimer(5);
}
//Function for generating random output
function random(numVars) {

}

function drawTimer(minutes) {
	//Get Current Time
    var timer = minutes * 60;
    setInterval(function() {
    	var str = prefixZero(0, parseInt(timer / 60), timer % 60);
    	ctx.font = "60px Arial";
		ctx.fillStyle = "green";
		ctx.fillText(str, 350, 90);
		timer -= 1;
    }, 1000);

}

// Author: Anthoniraj Amalanathan
function prefixZero(hour, min, sec)
{
	var curTime;
	if(hour < 10)
	   curTime = "0"+hour.toString();
	else
	   curTime = hour.toString(); 
	 if(min < 10)
	   curTime += ":0"+min.toString();                           
	else
	   curTime += ":"+min.toString();  

	if(sec < 10)
	   curTime += ":0"+sec.toString();                           
	else
	   curTime += ":"+sec.toString();  
	return curTime;
}
