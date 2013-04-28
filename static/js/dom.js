//Contains all the dom refersh functions
//Global variables
var canvasWidth;
var canvasHeight;
var user;

$(document).ready(function(){
	loadLogin();
	usr = new User();
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
function loadCanvas() {
 	$("body").html("Loaded!");

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas", width:canvasWidth, height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	initGame();
}

function loadCreateGame() {
	var socket = io.connect("http://localhost:8888");

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
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});
}

function loadLobby(data) {
	var socket = io.connect("http://localhost:8888");

	var title = $("<h1>").html("Waiting for players");
	var start_game = $("<div>").html("Start Game").attr("id","start_button").addClass("button");
	var players = $("<ul>").attr("id", "players");

	for(var i = 0; i < data.players.length; i++){
		var player = $("<li>").html(data.players[i].name);
		players.append(player);
	}

	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(title);
	content_area.append(players);
	content_area.append(start_game);

	$("#start_button").hammer().on("tap", loadCanvas);

	socket.on("lobby_update", function(data){
		console.log("Update!");
		players.empty();
		for(var i = 0; i < data.players.length; i++){
			var player = $("<li>").html(data.players[i].name);
			players.append(player);
		}
	});
}

function loadFindGame() {
	var socket = io.connect("http://localhost:8888");

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
 			showNotification("Created Lobby!");
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});
 	
 	socket.on("lobbies", function(data){	
 		if (data.success) {
 			//showNotification("Found active lobbies!");
 			var lobby_area = $("#lobbies");
 			lobby_area.empty();
 			for(i = 1; i < data.lobbies.length; i++){
 				var lobby = $("<li>").html(String(data.names[data.lobbies[i]])).attr("id", i);
 				$("#"+String(i)).hammer().on("tap", joinLobby(parseInt(data.lobbies[i].slice(1)), socket));
 				lobby_area.append(lobby);
 			}

			for (i = 1; i < data.lobbies.length; i++){
 				var lobby = $("#"+String(i));
 				socket.emit('get_lobby_details', {lobby_id: data.lobbies[i]});
 				socket.on('lobby_details', function(data){
 					var player_count = $("<div>").html("Players: " + String(data.clients.length) + "/4");
 					lobby.append(player_count);
 				});
 			}

 		} else {
 			showNotification("Error getting lobbies");
 		}
 	});
}

function joinLobby(lobby, socket){
	//var socket = io.connect("http://localhost:8888");
	console.log("called");
	var content_area = $("#content_area");

	socket.emit("join_lobby", {username: usr.name, lobby_id: lobby});
 	socket.on("join_status", function(data){
 		//console.log(data);
 		if (data.success) {
 			var lobby_id = lobby;
 			//showNotification("Created Lobby!");
 			content_area.empty();
 			var title = $("<h1>").html("Waiting for players");
 			content_area.append(title);
 			var lobby_name = $("<h1>").html(String(data.names[data.lobbies[lobby]]));
 			var start_game = $("<div>").html("Start Game").attr("id","start_button").addClass("button");
 			$("#start_button").hammer().on("tap", loadCanvas);
 			var players = $("<ul>").attr("id", "players");
 			content_area.append(lobby_name);
 			content_area.append(players);
 			//Auto refresh lobby details
 			setInterval(function(){
 				socket.emit("get_lobby_details", {lobby_id: lobby_id});
 				socket.on("lobby_details", function(data){
 				var players_area = $("#players");
 				players_area.empty();
 				for(i = 0; i < data.clients.length; i++){
 						var player = $("<li>").html(String(data.clients[i]));
 						players_area.append(player);
 					}
 				});
 				//content_area.append(players_area);
 			}, 1000);
 		} else {
 			showNotification("Error Creating Lobby, please try again");
 		}
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