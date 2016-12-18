angular.module('mainControl',['authControl']).controller('taskController',function($scope,$http,authentication){
	$scope.title = 'Task List';
	$scope.tasks = [];
	$scope.currentName;
	$scope.currentAge;

	$scope.username = '';
	$scope.email = '';
	$scope.password = '';
	$scope.newPassword = '';
	$scope.isLoggedIn  = "N/A"

	$scope.currentTeam = "_self_";

	$scope.selfUserList = [];

	$scope.loginHide = false;

	$scope.newTask='';
	$scope.taskDeadline=0;
	$scope.taskList = [];

	$scope.removedID = '';

	var test;

	var auth = authentication.authentication();

	console.log(auth.isLoggedIn());

	$scope.hideLogin = function(){
		$scope.loginHide = !$scope.loginHide;
	}

	$scope.registerUser = function(){
		var user = {};
		user.name = $scope.username;
		user.email = $scope.email;
		user.password = $scope.password;
		auth.register(user).then(function(){
			$scope.isLoggedIn = auth.loggedUser();
			$scope.currentTeam = $scope.isLoggedIn + $scope.currentTeam;
			console.log($scope.currentTeam);
			$scope.loadUserList();
		});
		$scope.username = '';
		$scope.email = '';
		$scope.password = '';
		$scope.newPassword = '';

	};

	$scope.login = function(){
		var user = {};
		user.email = $scope.email;
		user.password = $scope.password;
		auth.login(user).then(function(){
			$scope.isLoggedIn = auth.loggedUser();
			$scope.currentTeam = $scope.isLoggedIn + $scope.currentTeam;
			console.log($scope.currentTeam);
		});
		$scope.username = '';
		$scope.email = '';
		$scope.password = '';
		$scope.newPassword = '';
		
		
	};

	$scope.logout = function(){
		auth.logout();
		$scope.isLoggedIn = auth.loggedUser();
	}

	$scope.changePassword = function(){
		var user = {};
		user.email = $scope.email;
		user.password = $scope.password;
		user.newPassword = $scope.newPassword;
		auth.changePassword(user);
		$scope.username = '';
		$scope.email = '';
		$scope.password = '';
		$scope.newPassword = '';
		auth.logout();
		$scope.isLoggedIn = auth.loggedUser();
		
	};
	
	$scope.loadUserList = function(){
		console.log('loaduserlist');
		$http.post('/getUserList',{requestor:$scope.isLoggedIn,teamName:($scope.isLoggedIn+'_self_')}).then(function(response){
			console.log('loading user List');
			$scope.selfUserList = response.data;
		}, function(){
			console.log('not loading user List');	
		});	
	};

	$scope.newMember = 'tim'
	$scope.newUserType = 0;

	$scope.addTeamMember = function(){
		console.log('loaduserlist');
		$http.post('/addTeamMember',{newUser:$scope.newMember,
			newUserType:$scope.newUserType,
			requestor:$scope.isLoggedIn,
			teamName:($scope.isLoggedIn+'_self_')
		}).then(function(response){
			console.log('adding username');
			$scope.loadUserList();
		}, function(){
			console.log('couldnt add');	
		});	
	};
	
//currently trying to work on adding new task. Routes shoudl be ready. Just need to setup UI to test.
	$scope.addNewTask = function(){
		$http.post('/addNewTask',{
			requestor:$scope.isLoggedIn,
			teamName:$scope.currentTeam,
			email:$scope.isLoggedIn,
			taskName: $scope.newTask,
			deadline: $scope.taskDeadline
		}).then(function(response){
			$scope.taskList.push(response.data);
		},function(){
			console.log('failed to add task');
		});
		$scope.newTask = '';
		$scope.taskDeadline = 0;
	};

	$scope.removeTask = function(){
		$http.post('/removeTask',{
			requestor:$scope.isLoggedIn,
			teamName:$scope.currentTeam,
			objectID:$scope.removedID
		}).then(function(response){
			$scope.getTaskList();
		},function(){
			console.log('failed to remove');
		});
		$scope.removedID = '';
	};

	$scope.getTaskList = function(){
		console.log('getTaskList');
		$http.post('/getTaskList',{
			teamName:$scope.currentTeam,
			requestor:$scope.isLoggedIn
		}).then(function(response){
			console.log('success');
			$scope.taskList = response.data;
			console.log($scope.taskList);
		},function(response){
			console.log('fail');
			$scope.taskList = [];
		})
	};

	$http.get('/alltestcase',{headers:{authorization: 'Bearer' + auth.getToken()}}).then(function(response){
										$scope.tasks = response.data;
										
									}, function(response){
										console.log("res"+response);
									});

	// $scope.addNewTask = function(){
	// 	$http.post('/newTask',{
	// 		name:$scope.currentName,
	// 		age:$scope.currentAge
	// 	},{headers:{Authorization: 'Bearer ' + auth.getToken()}
	// 	}).then(function(response){
	// 				$scope.tasks.push(response.data);
	// 			},function(response){
	// 				console.log(response);
	// 			});
	// 	$scope.currentAge = '';
	// 	$scope.currentName = '';
	// }

	$scope.isLoggedIn = auth.loggedUser();
	
});

