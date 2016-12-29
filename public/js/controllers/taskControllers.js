angular.module('mainControl',['authControl','taskControl','profileControl','teamAdminControl']).controller('taskController',function($scope,$http,authentication,taskFunctions,profileFunctions,teamAdminFunctions){
	$scope.title = 'Task List';
	$scope.tasks = [];
	$scope.currentName;
	$scope.currentAge;

	$scope.username = '';
	$scope.email = '';
	$scope.password = '';
	$scope.newPassword = '';
	$scope.loggedUser  = "N/A"

	$scope.currentTeam = "_self_";

	$scope.userList = [];

	$scope.loginHide = true;
	$scope.logoutHide = true;
	$scope.registerHide = true;
	$scope.passwordChangeHide = true;
	$scope.userModuleHide = true;

	$scope.newTask='';
	$scope.taskDeadline=0;
	$scope.taskList = [];

	$scope.removedID = '';

	$scope.myTeams = []

	var test;

	var auth = authentication.authentication();

	console.log(auth.isLoggedIn());

	$scope.hideLogin = function(){
		$scope.loginHide = !$scope.loginHide;
		if(!$scope.loginHide){
			$scope.registerHide = true;
		}
	}

	$scope.hidePasswordChange = function(){
		$scope.passwordChangeHide = !$scope.passwordChangeHide;
	}

	$scope.hideRegister = function(){
		$scope.registerHide = !$scope.registerHide;
		if(!$scope.registerHide){
			$scope.loginHide = true;
		}
	}

	var toggleUserModule = function(){
		$scope.userModuleHide = !$scope.userModuleHide
	}

	var loadUser = function(){
			$scope.loggedUser = auth.loggedUser();
			$scope.showTeam($scope.loggedUser + "_self_");
			toggleUserModule();
			profileFunctions.getMyTeams().then(function(response){
				$scope.myTeams = response.data;
			})
	}


	var unloadUser = function(){
			$scope.loggedUser = '';
			$scope.currentTeam = '';
			$scope.myTeams = [];
			$scope.taskList = [];
			$scope.userList = [];
			profileFunctions.getMyTeams().then(function(response){
				console.log($scope.myTeams);
				$scope.myTeams = response.data;
			})
	}



	$scope.registerUser = function(){
		var user = {};
		user.name = $scope.username;
		user.email = $scope.email;
		user.password = $scope.password;
		auth.register(user).then(function(){
			loadUser();
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
			loadUser();
		});
		$scope.username = '';
		$scope.email = '';
		$scope.password = '';
		$scope.newPassword = '';
	};

	$scope.logout = function(){
		auth.logout();
		$scope.loggedUser = auth.loggedUser();
		toggleUserModule();
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
	};
	


	$scope.loadUserList = function(teamName){
		console.log('loaduserlist ' + teamName);
		teamAdminFunctions.loadUserList(teamName).then(function(response){
			console.log('loading user List');
			$scope.userList = response.data;
		}, function(){
			console.log('not loading user List');	
		});	
	};

	$scope.newMember = ''
	$scope.newUserType = 0;
	$scope.newTeamName = '';

	$scope.createTeam = function(){

		if($scope.newTeamName != ''){

			teamAdminFunctions.createTeam($scope.newTeamName).then(function(response){
				console.log(response);
				if(response.data != ''){
					$scope.myTeams.push(response.data);	
					profileFunctions.getMyTeams();
					$scope.newTeamName = '';
				}
				
			});

		}
	}

	$scope.addTeamMember = function(teamName){
		console.log('add ' + $scope.newMember + ' to: ' + teamName);
		teamAdminFunctions.addTeamMember($scope.newMember,$scope.newUserType,teamName).then(function(response){
			console.log('adding username');
			console.log(response);
			$scope.loadUserList(teamName);
		}, function(){
			console.log('couldnt add');	
		});	
	};
	
//currently trying to work on adding new task. Routes shoudl be ready. Just need to setup UI to test.
	$scope.addNewTask = function(teamName){
		taskFunctions.addNewTask(teamName,$scope.newTask,$scope.taskDeadline).then(function(response){
			$scope.taskList.push(response.data);
		},function(){
			console.log('failed to add task');
		});
		$scope.newTask = '';
		$scope.taskDeadline = 0;
	};

	$scope.removeTask = function(teamName){
		taskFunctions.removeTask(teamName,$scope.removedID).then(function(response){
			$scope.getTaskList();
		},function(){
			console.log('failed to remove');
		});
		$scope.removedID = '';
	};

	$scope.completeTask = function(teamName,id){
		taskFunctions.completeTask(teamName,id).then(function(response){
			console.log(response);
			$scope.getTaskList($scope.currentTeam);
		},function(){
			console.log('failed to remove');
		});
	};

	$scope.getTaskList = function(teamName){
		taskFunctions.getTaskList(teamName).then(function(response){
			console.log('success');
			$scope.taskList = response.data;
			console.log($scope.taskList);
		},function(response){
			console.log('fail');
			$scope.taskList = [];
		})
	};

	$scope.assignUser = function(teamName,objectID,newAssignedUser){
		taskFunctions.assignUser(teamName,newAssignedUser,objectID).then(function(response){
			$scope.getTaskList($scope.currentTeam);
		},function(response){
			console.log('failed to add observer');
		});
	}

	$scope.loggedUser = auth.loggedUser();

	$scope.showTeam = function(teamName){
		$scope.currentTeam = teamName;
		$scope.taskList = [];
		$scope.userList = [];
		$scope.loadUserList(teamName);
		$scope.getTaskList(teamName);
	}
	
	if(auth.isLoggedIn()){
		loadUser();
	}

});

