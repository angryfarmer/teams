angular.module('taskControl',['authControl']).service('taskFunctions', function($http,authentication){

	auth = authentication.authentication();

	this.getTaskList = function(teamName){
		return $http.post('/api/getTaskList',{
			teamName:teamName
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.addNewTask = function(teamName,taskName,deadline){
		return $http.post('/api/addNewTask',{
			teamName:teamName,
			taskName:taskName,
			deadline:deadline
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.removeTask = function(teamName,objectID){
		return $http.post('/api/removeTask',{
			teamName:teamName,
			objectID:objectID
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.completeTask = function(teamName,objectID){
		return $http.post('/api/completeTask',{
			teamName:teamName,
			objectID:objectID
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};


	this.assignUser = function(teamName,assignedUser,objectID){
		return $http.post('/api/assignUser',{
			teamName:teamName,
			assignedUser:assignedUser,
			objectID:objectID
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};



});


