$(document).ready(function(){
	//jquery stuff
 });

 function login() {
 	//Handle login button pressed

 	//Get input values and checks if okay
 	var usr = $("#login_username").val();
 	var pwd = $("#login_password").val();

 	console.log(usr + ": " + pwd);

 	//If okay load menu
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

 function register() {
 	//Handle register button pressed
 }

 function loadCanvas() {
 	//Load the canvas
 	$("body").html("Loaded!");

	canvasWidth = $(window).width();
	canvasHeight = $(window).height();

	var c = $("<canvas>").attr({id:"myCanvas",width:canvasWidth,height:canvasHeight}).html("Cannot Load!");

	$("body").html(c);

	window.canvas = document.getElementById("myCanvas");
	window.ctx = canvas.getContext("2d");

	//draw();
 }

 function loadProfile() {
 	$("#content_area").html("profile");
 }

 function loadSettings() {
 	$("#content_area").html("settings");
 }