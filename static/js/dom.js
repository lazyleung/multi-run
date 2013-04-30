//Contains all the dom refersh functions
//Global variables
var canvasWidth;
var canvasHeight;
var user;
var images;

var music;
var musicList = ['sound/airbrushed.mp3', 'sound/blackout_city.mp3'];
var menuMusic = new Audio("sound/koji_pocket.mp3");
var socket;
var mute;

$(document).ready(function(){
	if (typeof(localStorage) !== "undefined") {
		if(localStorage.mute !== "0" || localStorage.mute !== "1"){
			localStorage.mute = "0";
		}
		mute = parseInt(localStorage.mute);
	} else {
		mute = 0;
	}
	images = new Images();
	usr = new User();
	initSock();
	checkLogin();
});

//loads the login page
function loadLogin() {
	removeHammer();
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

 	var navbar = $('#navbar');
 	navbar.empty();

 	//Add touch listeners
 	$("#login_button").hammer().on("tap", startLogin);
 	$("#register_button").hammer().on("tap", startRegister);
}

//loads the menu
function loadMenu() {
	removeHammer();
	// Load menu music and loop it
	if(mute === 0) {
		menuMusic.addEventListener('ended', function() {
			this.currentTime = 0;
	    	this.play();
		}, false);
		menuMusic.play();
	}
	console.log("usr-charNum", usr.charNum);
 	var menu = $("<ul>");
 	menu.append($("<li>").html("Create A Game").attr("id","create_game_button"));
 	menu.append($("<li>").html("Join A Game").attr("id", "join_game_button"));
 	menu.append($("<li>").html("Profile").attr("id","profile_button"));

 	var content_area = $("#content_area");
 	content_area.empty();
 	content_area.append(menu);

 	// Create navbar
 	var navbar = $('#navbar');
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
function loadCanvas(players_init, lobby_name) {
	removeHammer();

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas", width:canvasWidth, height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	initGame(players_init, lobby_name);
}

function loadCreateGame() {
	removeHammer();
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
 		if ($("#lobby_name").val() !== "") {

	 		var	lobby_name = $("#lobby_name").val();
	 		socket.emit('create_lobby',{'username': usr.name, 'lobby_name': lobby_name, 'charNum': usr.charNum});
 		}
 		else
 			showNotification("Not a valid lobby name");
 	});
}

function loadFindGame() {
	removeHammer();
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
 		socket.emit('join_lobby',{'username': usr.name, 'lobby_name': $("#lobby_name").val(), 'charNum': usr.charNum});
 	});
}

function loadLobby(data) {
	removeHammer();
	var title = $("<h1>").html(data.lobby_name + " Waiting for players").addClass("text");
	var lobby_name = $("<h2>").html("Lobby: " + data.lobby_name).addClass("text");
	var players_count = $("<h2>").html("Players: " + String(data.players_init.length) + "/4").attr("id", "count").addClass("text");
	var start_game = $("<div>").html("Ready").attr("id","ready_button").addClass("button");
	var players = $("<ul>").attr("id", "players");

	for(var i = 0; i < data.players_init.length; i++){
		var player = $("<li>").html(data.players_init[i].name);
		player.addClass(data.players_init[i].status);
		player.append(lobbyDino(data.players_init[i].charNum));
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

	$("#ready_button").hammer().on("tap", function(){
		socket.emit('ready_game', {'lobby_name': usr.lobby_name, 'username': usr.name});
	});
	$("#back_button").hammer().on("tap", function(){
		socket.emit('leave_lobby', {'username': usr.name, 'lobby_name': usr.lobby_name});
		loadMenu();
	});
}

function lobbyDino(charNum){
 	canvasWidth = $(window).width();
	canvasHeight = $(window).height();
	
	if (charNum === 1){
		var dino_lobby_green = $("<img>").html("<br>").attr("id", "dino_lobby_green").attr("src", "/images/dino_green.png").attr("width", canvasWidth/32).attr("height", canvasHeight/16).addClass("dino_lobby");
		return dino_lobby_green;
	} else if (charNum === 2){
		var dino_lobby_blue = $("<img>").html("").attr("id", "dino_lobby_blue").attr("src", "/images/dino_blue.png").attr("width", canvasWidth/32).attr("height", canvasHeight/16).addClass("dino_lobby");
		return dino_lobby_blue;
	} else if (charNum === 3){
 		var dino_lobby_red = $("<img>").html("").attr("id", "dino_lobby_red").attr("src", "/images/dino_red.png").attr("width", canvasWidth/32).attr("height", canvasHeight/16).addClass("dino_lobby");
		return dino_lobby_red;
	} else if (charNum === 4){
		var dino_lobby_olive = $("<img>").html("").attr("id", "dino_lobby_olive").attr("src", "/images/dino_olive.png").attr("width", canvasWidth/32).attr("height", canvasHeight/16).addClass("dino_lobby");
		return dino_lobby_olive;
	} 
}

//loads the profile
function loadProfile() {

	removeHammer();
 	var username = $("<div>").html("Username: " + usr.name).addClass("text");
 	var color = $("<div>").html("<br> Pick a Color:").addClass("text");
 	//Back Button
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");
 
 	//Dinos
 	canvasWidth = $(window).width();
	canvasHeight = $(window).height();
 	var content_area = $("#content_area");
 	var dino_green = $("<img>").html("<br>").attr("id", "dino_green").attr("src", "/images/dino_green.png").attr("height", canvasHeight/5).addClass("dino");
 	var dino_blue = $("<img>").html("").attr("id", "dino_blue").attr("src", "/images/dino_blue.png").attr("height", canvasHeight/5).addClass("dino");
 	var dino_red = $("<img>").html("").attr("id", "dino_red").attr("src", "/images/dino_red.png").attr("height", canvasHeight/5).addClass("dino");
 	var dino_olive = $("<img>").html("").attr("id", "dino_olive").attr("src", "/images/dino_olive.png").attr("height", canvasHeight/5).addClass("dino");
 

 	content_area.empty();
	$("#content_area").append(username);
    $("#content_area").append(color);
	$("#content_area").append(dino_green);
	$("#content_area").append(dino_blue);
	$("#content_area").append(dino_red);
	$("#content_area").append(dino_olive);

	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");

 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

 	if (usr.charNum === undefined){
 		$("#dino_olive").addClass("selected");
 	}

	else if (usr.charNum === 1){
		$("#dino_green").addClass("selected");
	} else if (usr.charNum === 2){
		$("#dino_blue").addClass("selected");		
	} else if (usr.charNum === 3){
		$("#dino_red").addClass("selected");
	} else if (usr.charNum === 4){
		$("#dino_olive").addClass("selected");
	}
 	


	$("#back_button").hammer().on("tap", loadMenu);
	$("#dino_green").hammer().on("tap", function(){
		$(this).addClass("selected").siblings(".dino").removeClass("selected");
		usr.charNum = 1;
		usr.setChar(1);
	});
	$("#dino_blue").hammer().on("tap", function(){
		$(this).addClass("selected").siblings(".dino").removeClass("selected");
		usr.charNum = 2;
		usr.setChar(2);
	});
	$("#dino_red").hammer().on("tap", function(){
		$(this).addClass("selected").siblings(".dino").removeClass("selected");
		usr.charNum = 3;
		usr.setChar(3);
	});
	$("#dino_olive").hammer().on("tap", function(){
		$(this).addClass("selected").siblings(".dino").removeClass("selected");
		usr.charNum = 4;
		usr.setChar(4);
	});

}

//loads the settings
function loadSettings() {
	removeHammer();

 	canvasWidth = $(window).width();
	canvasHeight = $(window).height();
	var text = $("<div>").html("Music:").addClass("text")
	var m = $("<img>").attr("id","mute").attr("src", "/images/mute.png").attr("width", canvasWidth/24).attr("height", canvasHeight/8);
	
	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(text);
	content_area.append(m);

	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");
 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

	$("#back_button").hammer().on("tap", loadMenu);
	$("#mute").hammer().on("tap", function(){
		if(mute === 0){
			//stop all music
			menuMusic.pause();
			console.log("Mute!");
			mute = 1;
			$("#mute").addClass("selected");
		} else if(mute === 1){
			//play music
			menuMusic.play();
			console.log("No Mute!");
			mute = 0;
			$("#mute").removeClass("selected");
		}
		localStorage.mute = mute.toString();
	});
}

function showNotification(message) {
	var notification = $("<div>").addClass("notification").html($("<p>").html(message));
	$("body").append(notification);
	notification.hide();
	notification.slideDown(200, function() { // Fade in and then after 2 seconds, fade out
		setTimeout(function() { notification.slideUp(400, function() {$("div").remove(".notification")})}, 2000);
	});
}

//Loads title and content area
function loadContent() {
	removeHammer();
	var navbar = $("<div>").attr("id","navbar");
	var title = $("<img>").attr("src", "/images/logo.png").attr("id", "title")
	var content_area = $("<div>").attr("id","content_area");
	var body = $("body");

	body.empty();
	body.append(navbar);
	body.append(title);
	body.append(content_area);
}

function removeHammer(){
	$("#login_button").hammer().off("tap");
	$("#register_button").hammer().off("tap");
	$("#logout_button").hammer().off("tap");
	$("#create_game_button").hammer().off("tap");
	$("#join_game_button").hammer().off("tap");
	$("#profile_button").hammer().off("tap");
	$("#settings_button").hammer().off("tap");
	$("#create_lobby_button").hammer().off("tap");
	$("#back_button").hammer().off("tap");
	$("#join_lobby_button").hammer().off("tap");
	$("#start_button").hammer().off("tap");
	$("#mute").hammer().off("tap");
}

function loadEnd() {
	removeHammer();
	var lobby_name = $("<h1>").html("Lobby: " + usr.lobby_name).addClass("text");
	var players = $("<ul>").attr("id", "players");

	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(lobby_name);
	content_area.append(players);

	//Navbar
 	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");

 	var navbar = $('#navbar');
 	navbar.empty();
 	navbar.append(back_button);

	$("#back_button").hammer().on("tap", function(){
		usr.isDone = false;
		socket.emit('leave_lobby', {'username': usr.name, 'lobby_name': usr.lobby_name});
		loadMenu();
	});
}