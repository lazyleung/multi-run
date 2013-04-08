//Global variables
var canvasWidth;
var canvasHeight;

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

	if(usr === ''){
 		alert("Invalid username");
 	} else if(pwd === ''){
 		alert("Invalid password");
 	} else {
 		register(usr,pwd);
 	}
}

function startLogout() {
	logout(usr,pwd);
}