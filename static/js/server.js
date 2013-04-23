//Contains the server communication functions

//wrapper function for serve comm
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

//Calls to server
function login(username, password){
	$.ajax({
		type: "post",
	    dataType: "json",
	    data: {
	      "username": username,
	      "password": password
	    },
	    url: "/login",
	    success: function(data) {
	    	showNotification("Login succesful!")
			alert("Login succesful!");

			//Load user data
			usr = data.username;
			pwd = data.password;

			loadMenu();
	    },
	    error: function(data) {
	    	alert("Login failed!");
	    }
	});
}

function register(username, password){
	$.ajax({
		type: "post",
	    dataType: "json",
	    data: {
	      "username": username,
	      "password": password
	    },
	    url: "/register",
	    success: function(data) {
			alert("Registration succesful!");
			login(usr,pwd);
	    },
	    error: function(data) {
	    	alert("Registration failed!");
	    }
	});
}

function logout(username, password){
	$.ajax({
		type: "post",
	    dataType: "json",
	    data: {
	      "username": username,
	      "password": password
	    },
	    url: "/logout",
	    success: function(data) {
			alert("Logout succesful!");
			loadLogin();
	    },
	    error: function(data) {
	    	alert("Logout failed!");
	    }
	});
>>>>>>> e6efa7323e6a2916a11a602efc5f0928ddb59a6b
}