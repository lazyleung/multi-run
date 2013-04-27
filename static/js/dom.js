//Contains all the dom refersh functions
//Global variables
var canvasWidth;
var canvasHeight;

$(document).ready(function(){
	loadLogin();
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
 	menu.append($("<li>").html("Create Lobby").attr("id","create_lobby_button"));
 	menu.append($("<li>").html("Join Lobby").attr("id", "join_lobby_button"));
 	menu.append($("<li>").html("Profile").attr("id","profile_button"));
 	// menu.append($("<li>").html("Settings").attr("id","settings_button"));

 	var content_area = $("#content_area");
 	content_area.empty();
 	content_area.append(menu);

 	// Create navbar
 	navbar.empty();
 	var settings_button = $("<img>").attr("src", "images/gear.png").attr('id', 'settings_button').height('30px').width('30px');;
 	var logout = $("<div>").html("logout").attr("id","logout_button").addClass("button");

 	navbar.append(settings_button);
 	navbar.append(logout);

 	//Add touch listeners
 	$("#logout_button").hammer().on("tap", startLogout);
 	$("#create_lobby_button").hammer().on("tap", createLobby);
 	$("#join_lobby_button").hammer().on("tap", joinLobby);
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

function createLobby() {
	var player_id = 1; //1 = Host_ID
	var socket = io.connect("http://localhost:8888")

	//Inputs
	var lobby_name_input = $("<input>").attr("type","text").attr("id","lobby_name").attr("placeholder","Lobby Name");
	var	lobby_name = $("#lobby_name_username").val();
 	
 	//UI
	var menu = $("<ul>");
	var make_lobby = $("<div>").html("Make Lobby").attr("id","make_lobby_button").addClass("button");
	var create_lobby = $("<div>").html("Log In").attr("id","create_lobby_button").addClass("button");
	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");	
	menu.append($("<li>").html("Create Lobby").attr("id","create_lobby_button"));
	var content_area = $("#content_area");
	content_area.empty();
	content_area.append(back_button);
	content_area.append(menu);

	//Touch
	$("#back_button").hammer().on("tap", loadMenu);
 	$("#login_button").hammer().on("tap", function(){
 		//Send lobby create to server
 		console.log("pressed");
 		socket.emit('create_lobby',{id: player_id, username: usr});
 	
 	});
 	socket.on("lobby_status", function(data){
 		if (data.success) {
 			showNotification("Created Lobby!");
 		} else {
 			showNotification("Error Creating Lobby");
 		}
 	});
}

function joinLobby() {
	var menu = $("<ul>");
	var username = $("<div>").html("Username: " + usr);
	var chatbox = $("<form>").html("")
	
	menu.empty();
	menu.append($("<li>").html("Play").attr("id","play_button"));
	
	var back_button = $("<div>").html("back").attr("id", "back_button").addClass("button");
	var games = $("<ul>");	
	var content_area = $("#content_area");
 	content_area.empty();
 	content_area.append(back_button);
 	content_area.append(menu);
 	content_area.append(games);
 	content_area.append(chatbox);

 	//Touch 
	$("#back_button").hammer().on("tap", loadMenu);
	$("#play_button").hammer().on("tap", loadCanvas);
 	//Search for any lobbys using socket.io
 	var socket = io.connect("http://localhost:8888")
 	socket.on("join_lobby", function(data) {
 		console.log(data);
 		$("#games").append($("<li>").html(data.body))
 	});

}

//loads the profile
function loadProfile() {
 	var username = $("<div>").html("Username: " + usr);

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