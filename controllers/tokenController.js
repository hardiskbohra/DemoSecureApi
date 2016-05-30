var models = require('../models');

var controller = {
	
	authenticate : function(userData,cb,errcb) {
		models.User.findOne({where : { username: userData.username, password : userData.password}})
		.then(cb).catch(errcb);
		
	},
	
	add : function(token,cb,errcb) {
		var newStream = models.Token.build(token);
		return newStream.save()
		.then(cb).catch(errcb);
	}

};

module.exports = controller;