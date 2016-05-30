var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jwt-simple');
var moment = require('moment');
var controller = require('../controllers/tokenController');

router.post('/addToken', function(req,res,next) {
	
	controller.add(req.body,
		function(result) {
			res.status(200);
		},function(error) {
			res.status(500);
		}
	);
});

// localhost:3001/authenticate
router.post('/createToken', function(req, res, next){
	
	controller.authenticate(req.body
		,function(result) {
			if(result == null){
				res.status(401);
				res.json({"status":false,"result":error});
			}
			else {
				res.status(200);
				
				var expires = moment().add(1,'days').valueOf();
				var token = jwt.encode({
				  iss: req.body.username,
				  exp: expires
				}, 'iamthetoken');

				/*controller.add({"username" : result.username, "token_string" : token},
					function(result) {
						res.status(200);	
					},function(error) {
						res.status(500);
					}
				);*/
				
				res.json({
					status : true, 
					result : result, 
					token : token,
					expires: expires
				});				
			}			
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);		
});

router.post('/decodeToken', function(req,res,next) {
		var token = req.body.access_token;
		if (token) {
		  try {
			var decoded = jwt.decode(token, app.get('jwtSecretToken'));

		  res.json({"token-decode" : decoded});
		  
		  if (decoded.exp <= Date.now()) {
			  res.end('Access token has expired', 400);
			}
			
			User.findOne({ username: decoded.iss }, function(err, user) {
			  req.user = user;
			});

		  } catch (err) {
			res.json({"result" : err});
		  }
		} else {
		  next();
		}
});

module.exports = router;
