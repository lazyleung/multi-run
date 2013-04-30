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
var private_lobby_list = new Array();
var public_lobby_list = [{'name': 'Alpha', 'players': []}, {'beta': 'Alpha', 'players': []}];
/* public_lobby_list contains lobbies
 * Each lobby contains name, a player array, player ready count, and a status
 * status can be waiting, loading, playing, and end
 * players have username and id
*/

// Tell socket io to listen for new connections
io.sockets.on("connection", function(socket){
    clients[socket.id] = 0;

    //Create Lobby
    socket.on('create_lobby', function(data) {
        if(!isPrivateLobby(data.lobby_name)){
            var player = {'name': data.username, 'pos': 0};
            console.log("RES =",data.canvas_w, data.canvas_h);
            var player_init = {'name': data.username, 'charNum': data.charNum, 'status': 'wait', 'id': socket.id, 'time': 0, 'points': 0 ,'canvas_w': data.canvas_w, 'canvas_h': data.canvas_h};
            var lobby = {'name': data.lobby_name, 'players': [player], 'players_init': [player_init],'readyCount': 0, 'status': 'waiting'};

            socket.join(data.lobby_name);
            clients[socket.id] = data.lobby_name;
            socket.emit('create_lobby_status', {'success': true, 'lobby_name': data.lobby_name, 'players_init': private_lobby_list[private_lobby_list.push(lobby)-1].players_init});
        } else {
            socket.emit('create_lobby_status', {'success': false, 'reason': "Lobby name already exist"});
        }
    });

    //Join lobby
    socket.on('join_lobby', function(data){
        var status = getPrivateLobby(data.lobby_name);
        if (status === -1){
            //Lobby doesn't exist
            socket.emit('join_status', {'success': false, 'reason': "Lobby doesn't exist"});
        }else if(private_lobby_list[status].players.length >= 4) {
            //Lobby full
            socket.emit('join_status', {'success': false, 'reason': "Lobby full"});
        }else if(status >= 0){
            //Succesfully found joined lobby
            var player = {'name': data.username, 'pos': 0};
            console.log("JOIN RES = ", data.canvas_w, data.canvas_h);
            var player_init = {'name': data.username, 'charNum': data.charNum, 'status': 'wait', 'id': socket.id , 'time': 0, 'points': 0, 'canvas_w': data.canvas_w, 'canvas_h': data.canvas_h};
            socket.join(data.lobby_name);
            clients[socket.id] = data.lobby_name;
            private_lobby_list[status].players.push(player);
             private_lobby_list[status].players_init.push(player_init);
            socket.emit('join_status', {'success': true, 'lobby_name': data.lobby_name, 'players_init': private_lobby_list[status].players_init});
            socket.broadcast.to(data.lobby_name).emit('lobby_update',{'success': true, 'players_init': private_lobby_list[status].players_init});
        }
    });

    //Recieve client ready signal
    //When all clients in lobby are ready start loading the game
    socket.on('ready_game', function(data) {
        var status = getPrivateLobby(data.lobby_name);
        if (status === -1){
            //Lobby doesn't exist
            socket.emit('ready_game_signal', {'success': false, 'reason': "Lobby doesn't exist"});
        }else if(private_lobby_list[status].status === "waiting"){
            //Lobby is waiting so okay
            for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                if(private_lobby_list[status].players_init[i].name === data.username){
                    private_lobby_list[status].players_init[i].status = "ready";
                    break;
                }
            }
            io.sockets.in(data.lobby_name).emit('lobby_update', {'success': true, 'players_init':  private_lobby_list[status].players_init});
            if(++private_lobby_list[status].readyCount === private_lobby_list[status].players_init.length){
                //Reset readyCount for use in loading
                private_lobby_list[status].readyCount = 0;
                private_lobby_list[status].status = "loading";
                io.sockets.in(data.lobby_name).emit('client_load_game', {'success': true, 'level':Math.floor(Math.random()*5) + 1, 'lobby_name': data.lobby_name, 'players_init': private_lobby_list[status].players_init});
            }
        } else {
            //Lobby either playing or finished
            socket.emit('ready_game_signal', {'success': false, 'reason': "Lobby is " + private_lobby_list[status].status});
        }
    });

    //Once all clients loaded games start the game
    socket.on('load_game', function(data) {
        var status = getPrivateLobby(data.lobby_name);
        if (status === -1){
            //Lobby doesn't exist
            socket.emit('load_game_signal', {'success': false, 'reason': "Lobby doesn't exist"});
        }else if(private_lobby_list[status].status === "loading"){
            //Lobby is loading so okay
            socket.emit('load_game_signal', {'success': true});
            if(++private_lobby_list[status].readyCount === private_lobby_list[status].players_init.length){
                private_lobby_list[status].readyCount = 0;
                private_lobby_list[status].status = "playing";
                io.sockets.in(data.lobby_name).emit('start_game_signal', {'success': true});
            }
        } else {
            //Lobby either playing or finished
            socket.emit('load_game_signal', {'success': false, 'reason': "Lobby is " + private_lobby_list[status].status});
        }
    });

    socket.on("player_update", function(data) {
        //console.log(data);
        var status = getPrivateLobby(data.lobby_name);
        if(status === -1){
            //Lobby doesn't exist
            socket.emit('player_update', {'success': false, 'reason': "Lobby doesn't exist"});
        }else if(status >= 0){
            socket.broadcast.to(data.lobby_name).emit('player_update', {'success': true, 'data': data});
        }
    });

    socket.on("player_fireball", function(data){
        //console.log(data);
        var status = getPrivateLobby(data.lobby_name);
        if(status === -1){
            socket.emit('fireball_update', {'success': false, 'reason': "Lobby doesn't exist"});
        } else if (status >= 0){
            socket.broadcast.to(data.lobby_name).emit('fireball_update', {'success': true, 'data':data});
        }
    });

    socket.on("end_game", function(data){
        var status = getPrivateLobby(data.lobby_name);
        if(status === -1){
            //socket.emit('end_game_status', {'success': false, 'reason': "Lobby doesn't exist"});
        } else if (status >= 0){
                var place =  ++private_lobby_list[status].readyCount;
            for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                if(private_lobby_list[status].players_init[i].name === data.username){
                    private_lobby_list[status].players_init[i].place = place;
                    var points = private_lobby_list[status].players_init[i].points;
                    switch(place){
                        case 1:
                            points += 500
                            break;
                        case 2:
                            points += 350
                            break;
                        case 3:
                            points += 200
                            break;
                        case 4:
                            points += 50
                            break;  
                    }
                    private_lobby_list[status].players_init[i].points = data.points + points;
                    private_lobby_list[status].players_init[i].time = data.time;
                }  
            }
            io.sockets.in(data.lobby_name).emit('end_game_signal', {'success': true, 'players_init': private_lobby_list[status].players_init});
            if(private_lobby_list[status].readyCount === private_lobby_list[status].players_init.length){
                var max = 0;
                var winner = 0;
                for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                    var points = private_lobby_list[status].players_init[i].points;
                    if(max < points){
                        max = points;
                        winner = i;
                    }
                }

                io.sockets.in(data.lobby_name).emit('end_game_winner_signal', {'success': true, 'winner': winner, 'players_init': private_lobby_list[status].players_init});
            }
        }
    });

    //Leave lobby
    socket.on('leave_lobby', function(data) {
        var status = getPrivateLobby(data.lobby_name);
        if (status === -1){
            //Lobby doesn't exist
            socket.emit('leave_status', {'success': false, 'reason': "Lobby doesn't exist"});
        }else if(private_lobby_list[status].players.length === 1){
            //Last person in lobby
            for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                if(private_lobby_list[status].players[i].name === data.username){
                    private_lobby_list[status].players.splice(i, 1);
                    private_lobby_list[status].players_init.splice(i, 1);
                }
            }
            private_lobby_list.splice(status,1);
            socket.leave(data.lobby_name);
            clients[socket.id] = 0;
            socket.emit('leave_status', {'success': true});
        }else if(status >= 0){
            //Succesfully found leave lobby
            //Take out player
            for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                if(private_lobby_list[status].players[i].name === data.username){
                    if(private_lobby_list[status].players_init[i].status === "ready"){
                        private_lobby_list[status].readyCount--;
                    }
                    private_lobby_list[status].players.splice(i, 1);
                    private_lobby_list[status].players_init.splice(i, 1);
                }
            }
            socket.leave(data.lobby_name);
            clients[socket.id] = 0;
            socket.emit('leave_status', {'success': true});
            socket.broadcast.to(data.lobby_name).emit('lobby_update',{'players_init': private_lobby_list[status].players_init});
        }
    });
    
    //Disconnect
    socket.on("disconnect", function() {
        if(clients[socket.id] !== 0){
            var status = getPrivateLobby(clients[socket.id]);
            if (status === -1){
                //Lobby doesn't exist
            }else if(private_lobby_list[status].players.length === 1){
                //Last person in lobby
                private_lobby_list[status].players.splice(status, 1);
                private_lobby_list[status].players_init.splice(status, 1);
                private_lobby_list.splice(status,1);
                socket.leave(clients[socket.id]);
                clients[socket.id] = 0;
            }else if(status >= 0){
                //Succesfully found leave lobby
                //Take out player
                for(var i = 0; i < private_lobby_list[status].players_init.length; i++){
                    if(private_lobby_list[status].players_init[i].id === socket.id){
                        private_lobby_list[status].players.splice(i, 1);
                        private_lobby_list[status].players_init.splice(i, 1);
                        private_lobby_list[status].readyCount--;
                    }
                }
                socket.leave(clients[socket.id]);
                clients[socket.id] = 0;
                if(private_lobby_list[status].status === 'waiting'){
                    socket.broadcast.to(clients[socket.id]).emit('lobby_update',{'players_init': private_lobby_list[status].players_init});
                }
            }
        }
        delete clients[socket.id]
    });
});

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

function getPrivateLobby(name) {
    for(var i = 0; i < private_lobby_list.length; i++){
        if(private_lobby_list[i].name === name){
            return i;
        }
    }
    //No such lobby
    return -1;
}

//returns true if the lobby name is in the provate lobby list
function isPrivateLobby(name){
    for(var i = 0; i < private_lobby_list.length; i++){
        if(private_lobby_list[i].name === name){
            return true;
        }
    }
    return false;
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

app.post('/checkLogin', function(req, res){
    mongoExpressAuth.getAccount(req, function(e, result){
        if(e){
            res.send(e);
        }else{
            res.send({
                "success": true,
                "username": result.username,
                "charNum": result.charNum,
                "higscores": result.highscores
            });
        }
    });
});

app.post('/login', function(req, res){
    mongoExpressAuth.login(req, res, function(e, result){
        if (e){
            res.send(e);
        }else{
            res.send({
                "success": true,
                "username": result.username,
                "charNum": result.charNum,
                "higscores": result.highscores
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