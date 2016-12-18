console.log('Creating testSchema');

var mongoose = require('mongoose');
//module.exports = function(mongoose){
	mongoose.model('dope',new mongoose.Schema({
												name: String,
												age: Number
											})
	);
//};	