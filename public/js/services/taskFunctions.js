angular.module('taskControl',['authControl']).service('taskFunctions', function($http,authentication){

	auth = authentication.authentication();

	this.getTaskList = function(teamName,requestor){
		return $http.post('/api/getTaskList',{
			teamName:teamName,
			requestor:requestor
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.addNewTask = function(teamName,requestor,taskName,deadline){
		return $http.post('/api/addNewTask',{
			teamName:teamName,
			requestor:requestor,
			email:requestor,
			taskName:taskName,
			deadline:deadline
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.removeTask = function(teamName,requestor,objectID){
		return $http.post('/api/removeTask',{
			teamName:teamName,
			requestor:requestor,
			objectID:objectID
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.completeTask = function(teamName,requestor,objectID){
		return $http.post('/api/completeTask',{
			teamName:teamName,
			requestor:requestor,
			objectID:objectID
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

});


