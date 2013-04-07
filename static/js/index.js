//Global variables
var canvasWidth;
var canvasHeight;
var usr;
var pwd;

$(document).ready(function(){
	//jquery stuff
 });

 function startLogin() {
 	//Handle login button pressed
 	usr = $("#login_username").val();
 	pwd = $("#login_password").val();

	login(usr,pwd);
 }

 function startRegister() {
 	//Handle register button pressed
 	usr = $("#login_username").val();
 	pwd = $("#login_password").val();

 	if(usr !== '' && pwd !== ''){
 		register(usr,pwd);
 	} else {
 		alert("Invalid registration!");
 	}
 }