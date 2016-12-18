angular.module('authControl',[]).service('authentication', function($http,$window){
	var saveToken = function(token){
		$window.localStorage['mean-token'] = token;
	};

	var getToken = function(token){
		return $window.localStorage['mean-token'];
	};

	var logout = function(){
		$window.localStorage.removeItem('mean-token');
	};

	var isLoggedIn = function(){
		var token = getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	var loggedUser = function(){
		var token = getToken();
		var payload;

		if(token){
			payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);

			return payload.email;
		} else {
			return 'Not Logged In';
		}
	}

	var currentUser = function(){
		if(isLoggedIn()){
			var token = getToken();
			var payload = token.split('.')[1];
			payload = $window.atob(payload);
			payload = JSON.parse(payload);
			return {
				email: payload.email,
				name: payload.name
			};
		}
	}

	var register = function(user){
		return $http.post('/api/register',user).success(function(data){
			//console.log(user);
			saveToken(data.token);
		});
	};

	var login = function(user){
		return $http.post('/api/login',user).success(function(data){
			saveToken(data.token);
		});
	};

	var changePassword = function(user){
		return $http.post('/api/changePassword',user).success(function(data){
			saveToken(data.token);
		});
	};

	this.authentication = function(){
		return {
			saveToken: saveToken,
			getToken: getToken,
			logout: logout,
			isLoggedIn: isLoggedIn,
			currentUser: currentUser,
			register: register,
			login: login,
			changePassword: changePassword,
			loggedUser: loggedUser
		};
	};
});


