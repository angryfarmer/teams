console.log('Creating userSchema');

var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = '3n3jfkd9562';
var mongoose = require('mongoose');



//module.exports = function(mongoose){
	userSchema = new mongoose.Schema({
												email: {type:String,unique: true,required:true},
												name: {type:String,unique: true,required:true},
												hash:String,
												salt:String,
												teams: {type:Array,default:[]}
									});
	userSchema.methods.setPassword = function(password){
		
		this.salt = crypto.randomBytes(16).toString('hex');
		
		this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
	};
	userSchema.methods.validatePassword = function(password){
		var hash = crypto.pbkdf2Sync(password,this.salt,1000,64).toString('hex');
		return hash === this.hash;
	};
	userSchema.methods.addTeam = function(team){
		console.log(this.teams);
		this.teams.push(team);
		console.log(this.teams);

	};
	userSchema.methods.generateJwT = function(){
		var expiry = new Date();
		expiry.setDate(expiry.getDate()+7);
		return jwt.sign({
			_id: this._id,
			email: this.email,
			name: this.name,
			exp: parseInt(expiry.getTime() / 1000)
		},secret)
	};
	mongoose.model('user', userSchema);
	//return mongoose.model('user', userSchema);
//};	