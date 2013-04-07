$(document).ready(function(){
	//jquery stuff
 });

 function login() {
 	//login pressed

 	//Initiate login

 	//If okay load menu
 	var content_area = $("#content_area");
 	content_area.empty();
 	var menu = $("<ul>");
 	menu.append($("<li>").html("Play").attr("id",play_button));
 	menu.append($("<li>").html("Profile"));
 	menu.append($("<li>").html("Settings"));

 	content_area.append(menu);



 }

 function register() {
 	window.open("menu.html","_self");
 }