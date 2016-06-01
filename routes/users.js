var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');
var tokenController = require('../controllers/tokenController');

var jwt = require('jwt-simple');
//var jwt = require('jsonwebtoken');

var moment = require('moment');
var app = require('../app');

// localhost:3001/users/
router.get('/', function(req, res, next) {

	var paranoid = req.params.paranoid || false;

	controller.getAll(
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});

// middle ware function to validate the token....
function tokenValidate(req, res, next) {

	var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

	if (token) {
		try {
			var decoded = jwt.decode(token, 'secretcode');
			//var decoded = jwt.verify(token, 'secretcode');
			
			if(req.body.access_user == decoded.iss){
				
				console.log("Username : " + decoded.iss);
				
				var date = new Date().getTime() + 0;
				
				if(decoded.exp >= date){
					console.log("Expiry Date : " + decoded.exp);					
					res.status(200);
					//res.json({"status" : true,"message" : "Authorized token."});
					return next();
				}
				else {
					res.status(401);
					res.json({"status" : false,"message" : "Token expired."});
				}
			}
			else {
				res.status(401);
				res.json({"status" : false,"message" : "Invalid token."});
			}

		}
		catch (err) {
			res.status(401);
			res.json({"status" : false,"message" : err});
		}
	} 
	else {
		res.status(401);
		res.json({"status" : false,"message" : "No token provided."});
	}
}

router.post('/login',function(req, res, next) {

	console.log(req.body);

	controller.authenticate(req.body,
		function(user){
			if(user) {
				console.log(user.username + " " + user.password);
				var expires = new Date().getTime() + (24 * 3600 * 1000);
				//jwtSecretToken

				console.log(expires);
//				var accessToken = jwt.sign({
				var accessToken = jwt.encode({
				  	iss: user.username,
				  	exp: expires
					}, 'secretcode' //app.get('jwtSecretToken')
				);

				var token = {
					username : user.username,
					tokenString : accessToken,
					expires : expires
				};
				tokenController.add(token,
					function(token){
						res.setHeader('x-access-token',token.tokenString);
						res.json({"status" : true , "result" : user, "token" : token.tokenString});
					},
					function(error) {
						res.status(500);
						res.json({"status":false,"result":error, "message" : "Error while generating token"});
					}
				);
			} else {
				res.status(401);
				res.json({"status":false,"message":"Invalid username or password"});
			}
		},
		function(error){
			console.log("error" + error);
			res.status(500);
			res.json({"status":false,"result":error, "message" : "Somthing went wrong"});
		}
	);
});

// localhost:3001/users/add
router.post('/add', tokenValidate, function(req, res, next){

	controller.add(req.body,
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});

/*
// localhost:3001/users/authenticate
router.get('/authenticate', function(req, res, next){

	controller.authenticate(req.body,
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});
*/

// localhost:3001/users/update/:id
router.put('/update/:id', function(req,res,next){

	controller.update(req.params.id,req.body,
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});

// localhost:3001/users/delete/:id
router.delete('/delete/:id', function(req, res, next){

	console.log(req.params);

	controller.delete(req.params.id,
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});

module.exports = router;
