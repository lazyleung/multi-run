//Highlevel control of game
var player;
var timeInterval = 25;
var timer;
var progress;
var background;
var level;
var gameInterval;

var race_progress;
var clcount;
var clinterval;

var playerViews = new Array();

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

	//Create new player
	player = new Player(canvasWidth/3, canvasHeight - 1*window.block_y);

	//Create view for players
	for(var p in players_init){
		if(players_init[p].name !== usr.name){
			playerViews.push(new playerView(players_init[p].name, players_init[p].charNum));
		}
	}

	// Add timer
	timer = new Timer(5);

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

	//Draw player
	player.draw();

	ctx.restore();

	ctx.font = "32px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(String(player.points), canvasWidth-2*window.block_x, 40);
	//Draw GUI
	timer.draw();
}

function updatePlayers(data){
	data.players.forEach(function(player_view_data){
		player_view = players[indexOf(player_view_data.name)];
		player_view.speed = player_view_data.speed;
		player_view.update();
	});
}

function update() {
	background.update();
	player.update(level.terrain_data);
	socket.emit("player_update", {'name': usr.name, 'pos_x': player.x, 'pos_y': player.y, 'speed': player.speed, 'animation_frame': player.animationFrame});
	timer.update();
	draw();
}

function startGame() {
	// end menuMusic()
	menuMusic.pause();
	menuMusic.currentTime = 0;
	// Start music
	music = new Audio(musicList[Math.floor(Math.random() * 2)])
	music.play();
	player.init();
	gameInterval = setInterval(update, timeInterval);
}

function endGame() {
	console.log("end!");
	clearInterval(gameInterval);
	socket.emit('leave_lobby', {'username': usr.name, 'lobby_name': usr.lobby_name, 'player_id': usr.player_id});

	//5 Second pause before exiting
	setTimeout(exitGame,5000);
}

function exitGame(){
	//stop music
	music.pause();
	music.currentTime = 0;
	loadContent();
	loadMenu();
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