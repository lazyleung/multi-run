//Contains all the dom refersh functions
//Global variables
var canvasWidth;
var canvasHeight;
var user;

var menuMusic = new Audio("sound/koji_pocket.mp3");
var socket;

$(document).ready(function(){
	loadLogin();
	usr = new User();
	socket = io.connect("http://localhost:8888");
});

//loads the login page
function loadLogin() {
	var username = $("<input>").attr("type","text").attr("id","login_username").attr("placeholder","Username");
	var password = $("<input>").attr("type","password").attr("id","login_password").attr("placeholder","Password");

	var login = $("<div>").html("Log In").attr("id","login_button").addClass("button");
	var register = $("<div>").html("Register").attr("id","register_button").addClass("button");

	var content_area = $("#content_area");
 	content_area.empty();

 	content_area.append(username);
 	content_area.append(password);
 	content_area.append(login);
 	content_area.append(register);

 	//Add touch listeners
 	$("#login_button").hammer().on("tap", startLogin);
 	$("#register_button").hammer().on("tap", startRegister);
}

//loads the menu
function loadMenu() {
	// Load menu music and loop it
	menuMusic.addEventListener('ended', function() {
    	this.currentTime = 0;
    	this.play();
	}, false);
	menuMusic.play();


	var navbar = $('#navbar');
 	var menu = $("<ul>");
 	menu.append($("<li>").html("Create A Game").attr("id","create_game_button"));
 	menu.append($("<li>").html("Join A Game").attr("id", "join_game_button"));
 	menu.append($("<li>").html("Profile").attr("id","profile_button"));

 	var content_area = $("#content_area");
 	content_area.empty();
 	content_area.append(menu);

 	// Create navbar
 	navbar.empty();
 	var settings_button = $("<img>").attr("src", "images/gear.png").attr('id', 'settings_button').height('30px').width('30px');
 	var logout = $("<div>").html("logout").attr("id","logout_button").addClass("button");

 	navbar.append(settings_button);
 	navbar.append(logout);

 	//Add touch listeners
 	$("#logout_button").hammer().on("tap", startLogout);
 	$("#create_game_button").hammer().on("tap", loadCreateGame);
 	$("#join_game_button").hammer().on("tap", loadFindGame);
 	$("#profile_button").hammer().on("tap", loadProfile);
 	$("#settings_button").hammer().on("tap", loadSettings);
}

//loads the canvas and init the game
function loadCanvas(socket, players, lobby_name) {
 	$("body").html("Loaded!");

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas", width:canvasWidth, height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	initGame(socket, players, lobby_name);
}

function loadCreateGame() {
 	//UI
 	//Content area
	var create_lobby = $("<div>").html("Create Lobby").attr("id","create_lobby_button").addClass("button");
	var lobby_name_input = $("<input>").attr("type","text").attr("id","lobby_name").attr("placeholder","Lobby Name");

	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(lobby_name_input);
	content_area.append(create_lobby);

	//Navbar
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");

 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

 	//Add touch listeners
	$("#back_button").hammer().on("tap", loadMenu);
 	$("#create_lobby_button").hammer().on("tap", function(){
 		console.log("Create lobby: "+$("#lobby_name").val());
 		var	lobby_name = $("#lobby_name").val();
 		socket.emit('create_lobby',{'username': usr.name, 'lobby_name': lobby_name});
 	});

 	//Sockets
 	socket.on("create_lobby_status", function(data){
 		if(data.success){
 			usr.player_id = data.player_id;
 			usr.lobby_name = data.lobby_name;
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});
}

function loadFindGame() {
	//UI
 	var lobby_name_input = $("<input>").attr("type","text").attr("id","lobby_name").attr("placeholder","Lobby Name");
 	var join_lobby = $("<div>").html("Join Lobby").attr("id","join_lobby_button").addClass("button");

 	var content_area = $("#content_area");
 	content_area.empty();
 	content_area.append(lobby_name_input);
 	content_area.append(join_lobby);

 	//navbar
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");

 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

 	//Touch 
	$("#back_button").hammer().on("tap", loadMenu);
	$("#join_lobby_button").hammer().on("tap", function(){
 		socket.emit('join_lobby',{'username': usr.name, 'lobby_name': $("#lobby_name").val()});
 	});

 	socket.on('join_status', function(data){
 		if (data.success) {
 			usr.player_id = data.player_id;
 			usr.lobby_name = data.lobby_name;
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});
}

function loadLobby(data) {
	var title = $("<h1>").html(data.lobby_name + " Waiting for players");
	var lobby_name = $("<h2>").html("Lobby: " + data.lobby_name);
	var players_count = $("<h2>").html("Players: " + String(data.players.length) + "/4").attr("id", "count");
	var start_game = $("<div>").html("Start Game").attr("id","start_button").addClass("button");
	var players = $("<ul>").attr("id", "players");

	for(var i = 0; i < data.players.length; i++){
		var player = $("<li>").html(data.players[i].name);
		players.append(player);
	}

	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(title);
	content_area.append(lobby_name);
	content_area.append(players_count);
	content_area.append(players);
	content_area.append(start_game);

	//Navbar
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");

 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

	$("#start_button").hammer().on("tap", function(){
		socket.emit('start_game', {'lobby_name': usr.lobby_name});
	});
	$("#back_button").hammer().on("tap", function(){
		socket.emit('leave_lobby', {'username': usr.name, 'lobby_name': usr.lobby_name, 'player_id': usr.player_id});
		loadMenu();
	});

	socket.on("lobby_update", function(data){
		console.log("Update!");
		players.empty();
		for(var i = 0; i < data.players.length; i++){
			var player = $("<li>").html(data.players[i].name);
			players.append(player);
		}
		$("#count").empty();
		$("#count").html("Players: " + String(data.players.length) + "/4");
	});

	socket.on("start_game", function(data){
		loadCanvas(socket, data.players, data.lobby_name);
	});
}

//loads the profile
function loadProfile() {
 	var username = $("<div>").html("Username: " + usr.name);

 	//Back Button
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");
 
 	var content_area = $("#content_area");
 	content_area.empty();
	$("#content_area").append(back_button);
	$("#content_area").append(username);

	$("#back_button").hammer().on("tap", loadMenu);
}

//loads the settings
function loadSettings() {
	//Back Button
	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");
	
	var content_area = $("#content_area");
	content_area.empty();
	$("#content_area").append(back_button);

	$("#back_button").hammer().on("tap", loadMenu);
}

function showNotification(message) { // type is "green" or "red"
	$('div').remove(".notification");
	var notification = $("<div>").addClass("notification").html($("<p>").html(message));
	$("body").append(notification);
	notification.hide();
	notification.slideDown(200, function() { // Fade in and then after 2 seconds, fade out
		setTimeout(function() { notification.slideUp(400, function() {$("div").remove(".notification")})}, 2000);
	});
}

//Loads title and content area
function loadContent() {
	var title = $("<h1>").html("Multi-Run");
	var content_area = $("<div>").attr("id","content_area")
	var body = $("body");

	body.empty();
	body.append(title);
	body.append(content_area);
}