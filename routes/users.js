var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController');

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

// localhost:3001/users/add
router.post('/add', function(req, res, next){

	controller.add(req.body,
		function(result) {
			res.json({"status":true,"result":result});
		},function(error) {
			res.status(500);
			res.json({"status":false,"result":error});
		}
	);
});

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
