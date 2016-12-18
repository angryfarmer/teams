console.log('loading Team Shell Module');

mongoose = require('mongoose');
taskList = require('./teamShellComponents/taskList')
userList = require('./teamShellComponents/userList')

var setupTeam = function(email,teamName){
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
	userSchema.update({email:email},{$push: {
			teams: teamName
		}
	},function(err,count,status){
		console.log('updating')
		if(err){
			console.log(err)
		} else {
			console.log(count);
		}
	});
};

var setupTaskList = function(email,teamName){
	var newTaskList = taskList.newTaskList(teamName);

}

module.exports.allow0 = function(req,res,next){
	var requestor = req.body.requestor;
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,0,next);
}
module.exports.allow1 = function(req,res,next){
	var requestor = req.body.requestor;
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,1,next);;
}
module.exports.allow2 = function(req,res,next){
	var requestor = req.body.requestor;
	var teamName = req.body.teamName;
	userList.allowAction(requestor,teamName,2,next);
}

module.exports.createTeam = function(req,res,next){
	var email = req.body.email;
	var teamName = req.body.teamName;
	var teamName = email + '_' + teamName + '_';

	setupTeam(email,teamName);
	setupTaskList(email,teamName);

	console.log(teamName + " created by " + email);
};

module.exports.createSelfTeam = function(req,res,next){
	var email = req.body.email;
	var teamName = 'self';
	var teamName = email + '_' + teamName + '_';

	setupTeam(email,teamName);
	setupTaskList(email,teamName);

	console.log(teamName + " created by " + email);
};

module.exports.getUserList = function(req,res,next){
	var teamName = req.body.teamName;
	userList.getUserList(teamName,function(result){
		res.send(result);
	});
};

module.exports.addUserToTeam = function(req,res,next){
	newUser = req.body.newUser;
	newUserType = req.body.newUserType;
	requestor = req.body.requestor;
	teamName = req.body.teamName;
	userList.addTeamMember(newUser,newUserType,requestor,teamName);
};



module.exports.getTaskList = function(req,res,next){
	var teamName = req.body.teamName;
	taskList.getTaskList(teamName,res);
};

module.exports.addNewTask = function(req,res,next){
	teamName = req.body.teamName;
	email = req.body.email;
	taskName = req.body.taskName;
	deadline = req.body.deadline;
	taskList.addSingleTask(teamName,email,taskName,deadline,res);
};

module.exports.removeTask = function(req,res,next){
	teamName = req.body.teamName;
	objectID = req.body.objectID;
	taskList.removeTask(teamName,objectID,res);
};
