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
 		showNotification("Invalid username");
 	} else if(pwd === ''){
 		showNotification("Invalid password");
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
			//Load user data
			usr = data.username;
			pwd = data.password;

			loadMenu();
	    },
	    error: function(data) {
	    	showNotification("Login failed!");
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
			showNotification("Registration succesful!");
			login(usr,pwd);
	    },
	    error: function(data) {
	    	showNotification("Registration failed!");
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
			loadLogin();
	    },
	    error: function(data) {
	    	showNotification("Logout failed!");
	    }
	});
}