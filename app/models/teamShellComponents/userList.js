var mongoose = require('mongoose');


userListSchema = new mongoose.Schema({
	email: {type:String,unique:true,required:true},
	type:{type:Number,"default": 0}
});

module.exports.addTeamMember = function(newUser,newUserType,requestor,teamName,res){
	
	var userSchema = mongoose.model('user');
	userSchema.update({email:newUser},{$addToSet: {
			teams: teamName
		}
	},function(err,count,status){
		console.log('updating')
		if(err){
			res.send(err);
			console.log(err)
		} else {
			if(count.n > 0){
				var userList = mongoose.model(teamName+'userList',userListSchema);
				var teamMember = new userList();
				teamMember.email = newUser;
				teamMember.type = newUserType;
				teamMember.save(function(err){
					if(err){
						console.log(err);
						res.send(err)
					} else {
						res.send(newUser + " added to " + teamName);
						console.log(newUser + " added to " + teamName);
					}
				});	
			} else {
				res.send('no match');
			}
		}	
	});
}

module.exports.newUserList = function(teamName){
	return mongoose.model(teamName+'userList',userListSchema);
}

module.exports.getUserList = function(teamName,callback){
	var userList = mongoose.model(teamName+'userList',userListSchema);
	userList.find(function(err,results){
		if(err){
			callback([]);
		}
		console.log(results);
		callback(results);
	});
};

module.exports.allowAction = function(requestor,teamName,requiredLevel,next,res){
	var userList = mongoose.model(teamName+'userList',userListSchema);
	console.log('teamName:' + teamName);
	userList.findOne({email:requestor},function(err,user){
		if(err){
			res.send(err);
			console.log('err');
		}
		if(!user){
			console.log('no user in team');
			res.send('user cant be found');
		} else {
			if(user.type <= requiredLevel){
				console.log(user.email + ' allowed');
				next();
			} else {
				console.log('insufficient permissions')
				res.send('insufficient permissions');
			}

		}

	});
};