var mongoose = require('mongoose');


userListSchema = new mongoose.Schema({
	email: {type:String,unique:true,required:true},
	type:{type:Number,"default": 0}
});

module.exports.addTeamMember = function(newUser,newUserType,requestor,teamName){
	
	var userSchema = mongoose.model('user');
	userSchema.update({email:newUser},{$push: {
			teams: teamName
		}
	},function(err,count,status){
		console.log('updating')
		if(err){
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
					} else {
						console.log(newUser + " added to " + teamName);
					}
				});	
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

module.exports.allowAction = function(requestor,teamName,requiredLevel,next){
	var userList = mongoose.model(teamName+'userList',userListSchema);

	userList.findOne({email:requestor},function(err,user){
		if(err){
			console.log('err');
		}
		if(!user){
			console.log('not allowed');
		} else {
			if(user.type <= requiredLevel){
				console.log(user.email + ' allowed');
				next();
			}
		}

	});
};