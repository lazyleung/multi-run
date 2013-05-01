//Highlevel control of game
var player;
var timeInterval = 25;
var progress;
var background;
var level;
var gameInterval;

var race_progress;
var clcount;
var clinterval;
var playerViews = new Array();
var time;
var fireball_sound = new Audio("/sound/explosion.mp3");
var fire_shoot = new Audio("/sound/fire_shoot.mp3");


function initGame(players_init, lobby_name, levelNum) {
	//players = list of players
	console.log("players_init = ", players_init);
	console.log("lobby_name = ", lobby_name);
	console.log("level = ", levelNum);
	//Sets up the game
	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");

	//Screen split up 16x8 blocks
	window.block_x = canvasWidth/16;
	window.block_y = canvasHeight/8;

	//Talk to server
	
	//Reset globals
	progress = 0;
	race_progress = 0;
	clcount = 0;
	time = 0;

	//Create new player
	player = new Player(canvasWidth/3, canvasHeight - 1*window.block_y);

	//Create view for players
	for(var p in players_init){
		if(players_init[p].name !== usr.name){
			var playerview = new playerView(players_init[p].name, players_init[p].charNum, players_init[p].canvas_w, players_init[p].canvas_h);
			playerview.setChar(playerview.id);
			playerViews.push(playerview);
		}
	}

	//Create new background
	background = new Background();

	//Create Level
	level = new Level(levelNum);

	clinterval = setInterval(drawLoading, 75);

	//signal ready
	setTimeout(function(){
		socket.emit('load_game', {'lobby_name': lobby_name, 'player_id': usr.player_id})}
		, 1000);
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

	// Draw Fireballs
	drawFireballs();

	if (typeof(window.data) !== 'undefined'){
		for(var p in playerViews){
			if (playerViews[p].name === window.data.data.name){
				playerViews[p].draw(player.xOffset, window.data.data.pos_x/(playerViews[p].canvas_width/canvasWidth), window.data.data.pos_y/(playerViews[p].canvas_height/canvasHeight), window.data.data.animation_frame);
			} 
		}
	}

	//Draw player
	player.draw();

	ctx.font = "32px Arial";
	ctx.fillStyle = "black";
	ctx.fillText(String(usr.name), player.x+(0.1)*window.block_x, player.y-2.5*window.block_y);
	ctx.drawImage(images.arrow, player.x, player.y-4.0*window.block_y, 1.5*window.block_x, window.block_y);
	ctx.restore();

	ctx.font = "32px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(String(player.points), canvasWidth-2*window.block_x, 40);
	//Draw GUI
}

function updatePlayers(data){
	window.data = data;
}

function updatePlayerViews(){
	playerViews.forEach(function(aPlayerView) {
		aPlayerView.update();
	})
}

function drawFireballs() {
	level.fireballArray.forEach(function(fireball) {
		fireball.draw();
	})
}

function updateFireballs() {
	level.fireballArray.forEach(function(fireball) {
		fireball.update();
		if (fireball.lifetime <= 0){
			level.fireballArray.splice(level.fireballArray.indexOf(fireball), 1);
		}
	});
}

function update() {
	background.update();
	player.update(level.terrain_data);
	updateFireballs();
	updatePlayerViews();
	socket.emit("player_update", {'name': usr.name, 'pos_x': player.x, 'pos_y': player.y, 'speed': player.speed, 'animation_frame': player.animationFrame, 'lobby_name': usr.lobby_name});
	draw();
}

function playerUpdate() {
	socket.emit("player_update", {'name': usr.name, 'pos_x': player.x, 'pos_y': player.y, 'speed': player.speed, 'animation_frame': player.animationFrame, 'lobby_name': usr.lobby_name});
}

function startGame() {
	if(mute === 0){
		menuMusic.pause();
		menuMusic.removeEventListener('ended', false);
		// Start music
		music = new Audio(musicList[Math.floor(Math.random() * 2)])
		music.play();
	}
	player.init();
	gameInterval = setInterval(update, timeInterval);
};

function endGame() {
	console.log("end!");
	clearInterval(gameInterval);

	$('body').hammer().off('tap');
	$('body').hammer().off('swipeup');
	$('body').hammer().off('swipeleft');

	//5 Second pause before exiting
	setTimeout(exitGame,1000);
}

function exitGame(){
	//stop music
	if(mute === 0){
		music.pause();
	}
	loadContent();
	loadEnd();
	usr.isDone = true;
	socket.emit("end_game", {'points': player.points, 'time': time, 'lobby_name': usr.lobby_name, 'username': usr.name});
}

//Countdown for start of game
function countdown(){
	draw();
	if(clcount === 0){
		clearInterval(clinterval);
		startGame();
	} else {
		ctx.font = "50px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(clcount, canvasWidth/2, canvasHeight/2);
		clcount--;
	}
}

function drawLoading(){
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	ctx.drawImage(usr.charImage, 247 * (clcount % 5), 0, 247, 475, canvasWidth/2 - window.block_y/5 * 3, canvasHeight/2 - window.block_y, window.block_y/5 * 6, window.block_y * 2);
	ctx.drawImage(images.loading, 0, 0, 400, 100, canvasWidth/2 - window.block_y, canvasHeight/2 + window.block_y, window.block_y * 2, window.block_y/2);
	clcount++;
}