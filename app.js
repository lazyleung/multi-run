var mongo = require('mongodb');

global.mongoConfig = {
    host: 'dbh85.mongolab.com',
    port: 27857,
    dbName: 'multirun'
}

// ========================
// ==== Express server ====
// ========================

var express = require("express");
var app = express();

// ========================
// === Socket.io server ===
// ========================

var util = require("util")
var io = require('socket.io').listen(8888);
var clients = new Object();
var lobby_names = new Object();

// Tell socket io to listen for new connections
io.sockets.on("connection", function(socket){
    //socket.on('connect', connect(socket, data));

    //Create Lobby
    socket.on('create_lobby', function(data) {
        //console.log(data)
        connect(socket, data);
        var lobby_id = Object.keys(clients).length;

        //console.log("clients.length = ", clients.length, Object.keys(clients).length);
        socket.join(String(lobby_id));
        console.log("ADFAF", Object.keys(io.sockets.manager.rooms)[lobby_id], data.lobby_name)
        lobby_names[Object.keys(io.sockets.manager.rooms)[lobby_id]] = data.lobby_name;
        socket.emit('lobby_status', {success: true, lobby_id: lobby_id});
    });

    //Start Game
    socket.on('start_game', function(data) {
        console.log(data)
    });

    //Send all lobbys
    socket.on('get_lobby', function(){
        //console.log(clients);
        //console.log("Rooms = ",getRooms());
        //console.log("io.sockets.manager.room", io.sockets.manager.rooms);
        socket.emit('lobbies', {success: true, lobbies: getRooms(), names: lobby_names})
        //console.log("In Room = ", io.sockets.clients(data.lobby_id));
        //console.log("In Room = ", getClientsInRoom(socket, data.lobby_id));
    });

    //Join lobby
    socket.on('join_lobby', function(data){
        connect(socket, data);
        socket.join(String(data.lobby_id));
        socket.emit('join_status', {success: true, lobbies: getRooms(), names: lobby_names});
    });

    //Returns current clients in lobby
    socket.on('get_lobby_details', function(data){
        var lobby_clients = io.sockets.clients(data.lobby_id);
        //console.log("lobby_clients", lobby_clients);
        var names = [];
        for (i = 0; i < lobby_clients.length; i++){
            //console.log(clients[lobby_clients[i].id]);
            names.push(clients[lobby_clients[i].id]);
        }
        console.log(names);
        socket.emit('lobby_details', {clients: names});
    });
});

var connect = function(socket, data) {
    // log client ID
    util.log("New player has connected: "+ data.username);

    // Save client to hash object
    clients[socket.id] = data.username;

    //socket.emit('ready', { clientId: data.clientId });
    //Lobby ID is ID of User

    console.log("done");
}

var disconnect = function(data) {
    util.log("Player has disconnected")
}

var getRooms = function() {
 return Object.keys(io.sockets.manager.rooms);
}

var playerCount = function(room) {
    return io.sockets.clients(room).length;
}

// get array of clients in a room
var getClientsInRoom = function(socketId, room){
    // get array of socket ids in this room
    var socketIds = io.sockets.manager.rooms['/' + room];
    var clients = [];
 
    if(socketIds && socketIds.length > 0){
        // push every client to the result array
        for(var i = 0, len = socketIds.length; i < len; i++){
   
            // check if the socket is not the requesting
            // socket
            if(socketIds[i] != socketId){
                clients.push(chatClients[socketIds[i]]);
            }
        }
    }
    return clients;
}


// ========================
// === MongoDB ===
// ========================

var mongoExpressAuth = require('mongo-express-auth');

mongoExpressAuth.init({
    mongo: { 
        host: global.mongoConfig.host,
        port: global.mongoConfig.port,
        dbName: global.mongoConfig.dbName,
        usrName: 'app',
        pwd: 'Mc20467y',
        collectionName: 'accounts'
    }
}, function(){
       console.log('ready on port 3000');
       app.listen(3000);
});

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'r-))wvhta+#4@tw1mie8+k&o*uj0)h$mi2#&5*rn-gby%7^pk)' }));
app.use('/', express.static(__dirname + '/static/'));

//===========================
//  routes
//===========================


//This is for debugging purposes
//Delete before release
app.get('/me', function(req, res){
    mongoExpressAuth.checkLogin(req, res, function(err){
        if (err)
            res.send(err);
        else {
            mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else 
                    res.send(result);
            });
        }
    });
});

app.post('/login', function(req, res){
    mongoExpressAuth.login(req, res, function(e){
        if (e)
            res.send(e);
        else {
        	mongoExpressAuth.getAccount(req, function(err, result){
                if (err)
                    res.send(err);
                else {
                	res.send({
                		"username": result.username,
                		"success": true
                	});
                }
            });
        }
    });
});

app.post('/logout', function(req, res){
    mongoExpressAuth.logout(req, res);
    res.send({"success": true});
});

app.post('/register', function(req, res){
    mongoExpressAuth.register(req, function(err){
        if (err)
            res.send(err);
        else
            res.send({"success": true});
    });
});