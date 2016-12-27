console.log('loading Team Shell Module');

mongoose = require('mongoose');
taskList = require('./teamShellComponents/taskList');
userList = require('./teamShellComponents/userList');
atob = require('atob');
jwt = require('jsonwebtoken');

var jwtRequestor = function(req){
	var token = req.headers.authorization.split('.')[1];
	return JSON.parse(atob(token)).email;
}

var setupTeam = function(email,teamName,res){
	var newUserList = userList.newUserList(teamName);
	var currentUser = new newUserList({email:email,type:0});
	console.log("Setting up userList for "+ teamName);
	currentUser.save(function(err,savedData){
		if(err){
			console.log(err);
		}
	});

	var userSchema = mongoose.model('user');
	console.log("Setting up Task List for "+ teamName);
	userSchema.update({email:email},{$addToSet: {
			teams: teamName
		}
	},function(err,count,status){
		console.log('updating');
		if(err){
			if(res != null){
				res.send(err);	
			}
			console.log(err)
		} else {
			console.log(count);
			if(count.nModified == 1){
				if(res != null){
					res.send(teamName);		
				}
			} else {
				if(res != null){
					res.send('');		
				}
			}
		}
	});
};

var setupTaskList = function(email,teamName){
	var newTaskList = taskList.newTaskList(teamName);

}

module.exports.getMyTeams = function(req,res,next){
    requestor = jwtRequestor(req);
    console.log(requestor);
	userSchema = mongoose.model('user');
	userSchema.findOne({email:requestor},function(err,results){
		if(err){
			res.send(err);
		} if(!results.teams) {
			res.send([]);
		} else {
			console.log(results.teams);
			res.send(results.teams);
		}
	})

}

module.exports.allow0 = function(req,res,next){
    requestor = jwtRequestor(req);
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,0,next,res);

}
module.exports.allow1 = function(req,res,next){
	requestor = jwtRequestor(req);
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,1,next,res);

}
module.exports.allow2 = function(req,res,next){
	requestor = jwtRequestor(req);
	console.log(requestor);
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,2,next,res);
}

module.exports.createTeam = function(req,res,next){
	var email = jwtRequestor(req);
	var teamName = req.body.teamName;
	var teamName = email + '_' + teamName + '_';

	setupTeam(email,teamName,res);

	console.log(teamName + " created by " + email);
};

module.exports.createSelfTeam = function(req,res,next){
	var email = req.body.email;
	var teamName = 'self';
	var teamName = email + '_' + teamName + '_';

	setupTeam(email,teamName);

	console.log(teamName + " created by " + email);
};

module.exports.getUserList = function(req,res,next){
	var teamName = req.body.teamName;
	userList.getUserList(teamName,function(result){
		res.send(result);
	});
};

module.exports.addUserToTeam = function(req,res,next){
	var requestor = jwtRequestor(req);
	newUser = req.body.newUser;
	newUserType = req.body.newUserType;
	teamName = req.body.teamName;
	userList.addTeamMember(newUser,newUserType,requestor,teamName,res);
};

module.exports.getTaskList = function(req,res,next){
	var teamName = req.body.teamName;
	taskList.getTaskList(teamName,res);
};

module.exports.addNewTask = function(req,res,next){
	var requestor = jwtRequestor(req);
	teamName = req.body.teamName;
	taskName = req.body.taskName;
	deadline = req.body.deadline;
	taskList.addSingleTask(teamName,requestor,taskName,deadline,res);
};

module.exports.removeTask = function(req,res,next){
	teamName = req.body.teamName;
	objectID = req.body.objectID;
	taskList.removeTask(teamName,objectID,res);
};

module.exports.completeTask = function(req,res,next){
	teamName = req.body.teamName;
	objectID = req.body.objectID;
	taskList.completeTask(teamName,objectID,res);
};