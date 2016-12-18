var secret = '3n3jfkd9562';

var passport = require('passport');
var mongoose = require('mongoose');
var userSchema = mongoose.model('user');
var jwt = require('express-jwt');
var auth = jwt({
	secret: secret,
	userProperty: 'payload'
});

module.exports.authenticate = auth;

module.exports.register = function(req,res,next){
	var user = new userSchema()
	console.log('registering...');
	user.name = req.body.name;
	user.email = req.body.email;

	user.setPassword(req.body.password);

	user.save(function(err){
		if(err){
			console.log(err)
			res.json({"error":true});
			//next();
		} else {
			console.log('registered!');
			var token;
			token = user.generateJwT();
			res.status(200);
			res.json({"token": token});
			next();
		}
	});
};

module.exports.login = function(req,res){
	passport.authenticate('local',function(err,user,info){
		var token;

		if(err){
			res.status(404).json(err);
			return;
		}

		if(user){
			token = user.generateJwT();
			res.status(200);
			res.json({"token":token});
		} else {
			res.status(401).json(info);
		}
	})(req,res);
};

module.exports.changePassword = function(req,res){
	var userCollection = new userSchema();
	var token = {};
	passport.authenticate('local',function(err,user,info){

		if(err){
			res.status(404).json(err);
			return;
		}

		if(user){
			user.setPassword(req.body.newPassword);
			userSchema.update({email:user.email},
				{$set: {
				salt: user.salt,
				hash: user.hash
				}
			},function(err,count,status){
				console.log(count);
				console.log(status);
			});
			token = user.generateJwT();
			res.status(200);
			res.json({"token":token});
		} else {
			res.status(401).json(info);
		}
	})(req,res);
	
};