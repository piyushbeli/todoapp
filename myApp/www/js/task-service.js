'use strict'

angular.module('todo.services', [])

.factory('TaskService', function(DB) {
	var self = this;
	var TABLE_NAME = 'tasks';
	var allTasks = [];

	self.fetchAllTasks = function() {
		var deferred = $q.defer();
		var query = 'SELECT * FROM TABLE ' + TABLE_NAME;
		DB.query(query).then(function(results) {
			var output =  DB.fetchAll(results);
			return deferred.resolve(output);
		})
	}

	self.createTask = function(task) {
		var deferred = $q.defer();
		var query = 'INSERT INTO task VALUES(';
		var values = ['null', task.description, task.projectId];
		query += query + values.join(',') + ')';
		DB.query(query).then(function(result) {
			allTasks.push(result);
			console.log("Row inserted successfully")
		})
	}

	return self;
})