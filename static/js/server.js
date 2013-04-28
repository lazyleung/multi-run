//Contains the server communication functions

//wrapper function for serve comm
function startLogin() {
 	//Handle login button pressed
 	usr.name = $("#login_username").val();
 	usr.pwd = $("#login_password").val();

	login(usr.name,usr.pwd);
}

function startRegister() {
	//Handle register button pressed
	usr.name = $("#login_username").val();
	usr.pwd = $("#login_password").val();

	if(usr.name === ''){
 		showNotification("Invalid username");
 	} else if(usr.pwd === ''){
 		showNotification("Invalid password");
 	} else {
 		register(usr.name,usr.pwd);
 	}
}

function startLogout() {
	logout(usr.name,usr.pwd);
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
			usr.name = data.username;
			usr.pwd = data.password;
			loadMenu();
			showNotification("Welcome" + " " + usr.name + "!");
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
			login(usr.name,usr.pwd);
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