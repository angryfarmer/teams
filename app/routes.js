console.log('Load Routes');
var secret = '3n3jfkd9562';

var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
require('./models/testSchema');
require('./models/userSchema');
var testSchema = mongoose.model('dope');
var userSchema = mongoose.model('user');

var authFunctions = require('./controllers/authentication');
var teamFunctions = require('./models/teamShell');

mongoose.connect('mongodb://admin:admin@ds139288.mlab.com:39288/heroku_lxwxcz7d');

module.exports = function(app){

	require('./passport');

	app.post('/api/register',authFunctions.register,teamFunctions.createSelfTeam);

	app.post('/api/login',authFunctions.login);

	app.post('/api/changePassword',authFunctions.changePassword);

	app.get('/alltestcase');

	//app.post()

	app.post('/api/getMyTeams',teamFunctions.getMyTeams);
	app.post('/api/createTeam',teamFunctions.createTeam);

	app.post('/api/getUserList',teamFunctions.allow2,teamFunctions.getUserList);
	app.post('/api/addTeamMember',teamFunctions.allow0,teamFunctions.addUserToTeam);

	app.post('/api/getTaskList',teamFunctions.allow2,teamFunctions.getTaskList);
	app.post('/api/addNewTask',teamFunctions.allow2,teamFunctions.addNewTask);
	app.post('/api/removeTask',teamFunctions.allow2,teamFunctions.removeTask);
	app.post('/api/completeTask',teamFunctions.allow2,teamFunctions.completeTask);
	app.post('/api/assignUser',teamFunctions.allow1,teamFunctions.assignUser);

	app.post('/newTask', authFunctions.authenticate, function(req,res,next){
		
		var post = new testSchema(req.body);


		post.save(function(err,savedData){
			if(err){
				console.log(err);
				return next(err);
			}
			res.json(savedData);

		});
	})

	app.get('*', function(req, res) {
	    res.sendFile(path.resolve('./public/index.html')); // load our public/index.html file
		
	});
}