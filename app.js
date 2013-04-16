var mongo = require('mongodb');

global.mongoConfig = {
    host: 'dbh85.mongolab.com',
    port: 27857,
    dbName: 'multirun'
}

var express = require("express");
var app = express();

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
                console.log(err);
                console.log(result);
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