//Contains the login functions

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
			alert("Login succesful!");

			//Load user data

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
	    },
	    error: function(data) {
	    	alert("Logout failed!");
	    }
	});
}