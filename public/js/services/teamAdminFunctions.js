angular.module('teamAdminControl',['authControl']).service('teamAdminFunctions', function($http,authentication){

	auth = authentication.authentication();

	this.createTeam = function(teamName){
		return $http.post('/api/createTeam',{
			teamName:teamName
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.addTeamMember = function(newUser,newUserType,teamName){
		return $http.post('/api/addTeamMember',{
			newUser:newUser,
			newUserType:newUserType,
			teamName:teamName
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

	this.loadUserList = function(teamName){
		return $http.post('/api/getUserList',{
			teamName: teamName
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

});
