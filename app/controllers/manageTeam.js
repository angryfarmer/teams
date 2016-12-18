console.log("loading team functions");

var mongoose = require('mongoose');
var teamShell = require('../models/teamShell');

module.exports.createSelfTeam = function(req,res,next){
	teamShell.createTeam(req.body.email,'self');
};

module.exports.getUserList = function(req,res,next){
	userList = mongoose.model(req.body.teamName + 'userList');
	res.send(teamShell.getUserList(req.body.email,req.body.teamName));
};

//update all below with new teamShell Please!
module.exports.loadTeamTask = function(req,res,next){
	var teamTaskList = mongoose.model(req.body.teamName + 'taskList');
	var teamUserList = mongoose.model(req.body.teamName + 'userList');
	teamUserList.find({email:req.body.email},function(err,results){
		if(err){
			res.send('Not Authorized');
		} else {
			if(results.length == 1){
				res.send('ok'); 
			} else {
				res.send('Not Authorized')
			}
		}
	});
};



module.exports.addTask = function(req,res,next){
	if(teamSchema.allowAction(req.body.email,req.body.teamName,2)){
		teamSchema.addSingleTask(req.body.teamName,req.body.email,req.body.taskName,req.body.deadline);

	}	
};

module.exports.manageTeamTest = function(){
	console.log("manageTeamTest");
}