var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var userSchema = mongoose.model('user');


passport.use(new localStrategy({
		usernameField: 'email'
	},
	function(email,password,next){
		userSchema.findOne({email:email},function(err,user){
			if(err){
				return next(err);
			}
			if(!user || !user.validatePassword(password)){
				return next(null, false,{
					message: 'Incorrect Username/Password Combination'
				})
			}
			return next(null, user);
		});
	}
));

console.log('Passport Strategy Loaded');