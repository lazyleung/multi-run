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


function initGame(players_init, lobby_name) {
	//players = list of players
	console.log("players_init = ", players_init);
	console.log("lobby_name = ", lobby_name);
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
			var playerview = new playerView(players_init[p].name, players_init[p].charNum);
			playerview.setChar(playerview.id);
			playerViews.push(playerview);
		}
	}

	//Create new background
	background = new Background();

	//Create Level
	level = new Level(2);

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
		//ctx.drawImage(images.dino_blue, window.data.data.pos_x, window.data.data.pos_y);
		//console.log(playerViews);
		for(var p in playerViews){
			//console.log(playerViews[p]);
			//console.log(playerViews[p].name, window.data.data.name);
			if (playerViews[p].name === window.data.data.name){
				playerViews[p].draw(player.xOffset, window.data.data.pos_x, window.data.data.pos_y, window.data.data.animation_frame);
			} 
		}
		//ctx.drawImage(player_view.image, ( 247 * Math.ceil(window.data.data.animation_frame)), 0, 247, 475, window.data.data.pos_x, window.data.data.pos_y - window.block_y * 2, window.block_y/5 * 6, window.block_y * 2);
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
	//console.log(data);
	window.data = data;
	//console.log("dino drawn");
	//data.players.forEach(function(player_view_data){
		//player_view = players[indexOf(player_view_data.name)];
		//player_view.speed = player_view_data.speed;
		//player_view.update();
	//});
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
	})
}

function update() {
	background.update();
	player.update(level.terrain_data);
	updateFireballs();
	updatePlayerViews();
	socket.emit("player_update", {'name': usr.name, 'pos_x': player.x, 'pos_y': player.y, 'speed': player.speed, 'animation_frame': player.animationFrame, 'lobby_name': usr.lobby_name});
	draw();
}

function startGame() {
	// end menuMusic() and remove listener
	menuMusic.pause();
	menuMusic.removeEventListener('ended', false);
	// menuMusic.currentTime = 0;
	// Start music
	music = new Audio(musicList[Math.floor(Math.random() * 2)])
	music.play();
	player.init();
	gameInterval = setInterval(update, timeInterval);
};

function endGame() {
	console.log("end!");
	clearInterval(gameInterval);

	//5 Second pause before exiting
	setTimeout(exitGame,1000);
}

function exitGame(){
	//stop music
	music.pause();
	// music.currentTime = 0; COULD BE REMOVED MAYUBE
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