var mongoose = require('mongoose');

taskListSchema = new mongoose.Schema({
	taskName: {type:String,required:true},
	dateCreated: {type: Number},
	deadline:{type:Number},
	completed: {type: Boolean, "default": false},
	userCreator: {type:String,required:true},
	assignedUser:{type:String,"default": ""},
	teamLink:{type:Array,"default":[]},
	pushTrail:{type:Array,"default":[]},
	sequenced:{type:{}},
	context:{type:{},"default":{}}
});

taskListSchema.methods.createNewTask = function(taskName,deadline,creator,assignedUser,teamLink,sequenced){
	var now = new Date();
	this.taskName = taskName;
	this.dateCreated = now.getTime();
	this.deadline = deadline;
	this.userCreator = creator;
	this.assignedUser = assignedUser;
	if(teamLink == null){
	} else {
		this.teamLink.push(teamLink);	
	}
	
	this.pushTrail.push(this.creator);
	this.sequenced = sequenced;
};

module.exports.addSingleTask = function(teamName,email,taskName,deadline,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	var newTask = new taskList();
	newTask.createNewTask(taskName,deadline,email,email,null,{});
	newTask.save(function(err,result){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			if(result){
				console.log('saved task');
				res.send(result);
			} else {
				console.log('didnt save');
				res.send([]);
			}
			
		}
	});
};

module.exports.getTaskList = function(teamName,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	taskList.find(function(err,results){
		if(err){
			console.log('err getting task list');
			res.send([]);
		} 
		res.send(results);
	});


};

module.exports.removeTask = function(teamName,objectID,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	taskList.remove({_id:objectID},function(err,count){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			console.log(count.result);
			res.send('success');
		}
	});
};

module.exports.removeTask = function(teamName,objectID,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	taskList.remove({_id:objectID},function(err,count){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			console.log(count.result);
			res.send('success');
		}
	});
};

module.exports.assignUser = function(teamName,objectID,assignedUser,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	taskList.update({_id:objectID},{$set: {assignedUser:  assignedUser }},function(err,count){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			console.log(count.result);
			res.send('success');
		}
	});
};



module.exports.completeTask = function(teamName,objectID,res){
	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
	taskList.update({_id:objectID},{$set: {completed:true}},function(err,count){
		if(err){
			console.log(err);
			res.send(err);
		} else {
			console.log(count.result);
			res.send('success');
		}
	});
};

module.exports.newTaskList = function(teamName){
	return mongoose.model(teamName+'taskList',taskListSchema);
};



// module.exports.addObservers = function(teamName,objectID,observers,res){
// 	var taskList = mongoose.model(teamName + 'taskList',taskListSchema);
// 	taskList.update({_id:objectID},{$addToSet: {assignedUser: { $each: observers }}},function(err,count){
// 		if(err){
// 			console.log(err);
// 			res.send(err);
// 		} else {
// 			console.log(count.result);
// 			res.send('success');
// 		}
// 	});
// };