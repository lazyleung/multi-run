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
	    	console.log(data);
			//Load user data
			usr.name = data.username;
			usr.pwd = data.password;
			usr.charNum = data.charNum;
			usr.setChar(data.charNum);
			usr.highscores = data.highscores;
			loadMenu();
			showNotification("Welcome" + " " + usr.name + "!");
	    },
	    error: function(data) {
	    	showNotification("Login failed!");
	    }
	});
}

function checkLogin(){
	$.ajax({
		type: "post",
	    dataType: "json",
	    data: {},
	    url: "/checkLogin",
	    success: function(data) {
			//Load user data
			usr.name = data.username;
			usr.pwd = data.password;
			usr.charNum = data.charNum;
			usr.setChar(data.charNum);
			usr.highscores = data.highscores;		
			loadMenu();
			showNotification("Welcome" + " " + usr.name + "!");
	    },
	    error: function(data) {
	    	loadLogin();
	    },
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

//Add socket listeners
function initSock(){
	socket = io.connect("http://localhost:8888");

	socket.on("create_lobby_status", function(data){
 		if(data.success){
 			usr.lobby_name = data.lobby_name;
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});

 	socket.on('join_status', function(data){
 		if (data.success) {
 			usr.lobby_name = data.lobby_name;
 			loadLobby(data);
 		} else {
 			showNotification(data.reason);
 		}
 	});

 	socket.on("lobby_update", function(data){
 		var players = $("#players");
		players.empty();
		for(var i = 0; i < data.players_init.length; i++){
			var player = $("<li>").html(data.players_init[i].name);
			player.addClass(data.players_init[i].status);
			player.append(lobbyDino(data.players_init[i].charNum));
			players.append(player);
		}
		$("#count").empty();
		$("#count").html("Players: " + String(data.players_init.length) + "/4");
	});

	socket.on("ready_game_signal", function(data){
		if(!data.success){
			showNotification(data.reason);
		}
	});

	socket.on("client_load_game", function(data){
		if(data.success){
			loadCanvas(data.players_init, data.lobby_name);
		}else{
			showNotification("Cannot start game!");
			socket.emit("leave_lobby", {'username': usr.name, 'lobby_name': usr.lobby_name, 'player_id': usr.player_id});
			loadMenu();
		}
	});

	socket.on("load_game_signal", function(data){
		if(!data.success){
			showNotification("Cannot load game!");
			socket.emit("leave_lobby", {'username': usr.name, 'lobby_name': usr.lobby_name, 'player_id': usr.player_id});
			loadMenu();
		}
	});

	socket.on("start_game_signal", function(data){
		if(data.success){
			//Countdown
			clcount = 3;
			clearInterval(clinterval);
			clinterval = setInterval(countdown, 1000);
		}
	});

	socket.on("player_update", function(data){
		console.log("player_update", data);
		if(data.success){
			updatePlayers(data);
		} else {
			showNotification(data.reason);
		}
	});
}