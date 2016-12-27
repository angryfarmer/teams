angular.module('directives',[]).directive('task',function(){
	function link(scope,element,attributes){

	};
	return {
		restrict: 'E',
		templateUrl: 'directiveTemplates/singleTaskContainer.html'
	};
});