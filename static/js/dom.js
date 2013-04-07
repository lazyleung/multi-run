//Contains all the ajax refresh dom functions

function loadMenu() {
	var content_area = $("#content_area");
 	content_area.empty();
 	var menu = $("<ul>");
 	menu.append($("<li>").html("Play").attr("id","play_button"));
 	menu.append($("<li>").html("Profile").attr("id","profile_button"));
 	menu.append($("<li>").html("Settings").attr("id","settings_button"));

 	//Need to add logout/back button

 	content_area.append(menu);

 	//Add touch listeners
 	$("#play_button").onButtonTap(loadCanvas);
 	$("#profile_button").onButtonTap(loadProfile);
 	$("#settings_button").onButtonTap(loadSettings);
}

function loadCanvas() {
 	//Load the canvas
 	$("body").html("Loaded!");

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas", width:canvasWidth, height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	initGame();
}

function loadProfile() {
 	$("#content_area").html("profile");
}

function loadSettings() {
 	$("#content_area").html("settings");
}