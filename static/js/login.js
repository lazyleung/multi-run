//Contains the login functions

function login(username, password, done){
	post(
		'/login', 
		{   
			username: username, 
			password: password 
		}, 
		handleLoginResult
	);
}

function handleLoginResult(err, result){
	if (err)
		throw err;
	if (result === 'ok') {
		alert("Login succesful!");
		loadMenu();
	} else {
		alert(result);
	}
}

function register(username, password, done){
	post(
		'/register',
		{   
			username: username,
			password: password
		}, 
		handleRegisterResult
	);
}

function handleRegisterResult(err, result){
	if (err)
		throw err;
	if (result === 'ok'){
		alert("Registration succesful!");
		login(usr,pwd);
	}
	else{
		alert(result);
	}
}		

function post(url, data, done){
	var request = new XMLHttpRequest();
	var async = true;
	request.open('post', url, async);
	request.onload = function(){
		if (done !== undefined){
			var res = request.responseText
			done(null, res);
		}
	}
	request.onerror = function(err){
		done(err, null);
	}
	if (data !== undefined){
		var body = new FormData();
		for (var key in data){
			body.append(key, data[key]);
		}
		request.send(body);
	} else {
		request.send();
	}
}