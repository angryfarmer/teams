angular.module('profileControl',['authControl']).service('profileFunctions', function($http,authentication){

	auth = authentication.authentication();

	this.getMyTeams = function(){
		return $http.post('/api/getMyTeams',{
		},{
			headers:{authorization: 'Bearer' + auth.getToken()}
		});
	};

});
