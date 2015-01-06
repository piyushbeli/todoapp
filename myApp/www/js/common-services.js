angular.module('todo.services', ['todo.config', 'todo.models'])

.factory('DB', function($q, DB_CONFIG, $cordovaSQLite) {
	var self = this;
	self.db = null;

	self.init = function() {
		if(window.cordova) {
			self.db = $cordovaSQLite.openDB({ name: "TODO"});
		} else {
			self.db = window.openDatabase("TODO", "1.0", "Todo List", 200000);
		}
		
		angular.forEach(DB_CONFIG.tables, function(table) {
			var columns = []
			angular.forEach(table.columns, function(column) {
				columns.push(column.name + ' ' + column.type);
			})
			
			var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',');
			if(table.constraints && table.constraints.length > 0) {
				query += ',' + table.constraints.join(',') + ')';
			} else {
				query += ')';
			}

			self.query(query);
		})		
	}

	self.query = function(query, bindings) {
		if (angular.isUndefined(self.db)) {
			console.log("Trying to query the db before opening it.");
			return;
		}
		bindings = typeof bindings !== 'undefined' ? bindings : [];		
		if(window.cordova) {
			return $cordovaSQLite.execute(self.db, query, bindings);
		} else {
			var deferred = $q.defer();
			self.db.transaction(function(transaction) {
	            transaction.executeSql(query, bindings, function(transaction, result) {
	                deferred.resolve(result);
	            }, function(transaction, error) {
	            	console.log("Error occured in query: " + query);
	                deferred.reject(error);
	            });
        	});
        	return deferred.promise;
		}	
	}	

	self.fetchSingle = function(result) {
		return result.rows.item(0);
	}

	self.fetchAll = function(TABLE_NAME) {
		var deferred = $q.defer();
		var query = 'SELECT * FROM ' + TABLE_NAME;
		self.query(query).then(function(result) {
			var output = [];
			for (var i = 0; i < result.rows.length; i++) {
	        	output.push(result.rows.item(i));
	    	}					
			deferred.resolve(output);
		})
		return deferred.promise;
	}

	return self;
})

.factory('TaskService', function($q, DB, Task) {
	var self = this;
	var TABLE_NAME = 'task';
	self.tasks = [];

	self.fetchAllTasks = function() {
		DB.fetchAll(TABLE_NAME).then(function(output) {
			//can not use self.tasks = [], because it changes the reference and it will no more be bound with scope.
			self.tasks.splice(0, self.tasks.length);
			output = Task.build(output);
			[].push.apply(self.tasks, output);	
		})
	}

	self.createTask = function(task) {
		var deferred = $q.defer();
		var query = 'INSERT INTO ' + TABLE_NAME + ' (description, projectId) VALUES(?, ?)';
		var values = [task.description, task.projectId];		
		DB.query(query, values).then(function(result) {
			self.tasks.push(Task.build(task));
			self.fetchAllTasks();			
		}, function(error) {
			console.log("Error ocured while creating the task: " + error);
		})
	}

	self.getAllTasks = function() {
		return self.tasks;
	}

	return self;
})

.factory("ProjectService", function($q, DB) {
	var self = this;
	self.projects = [];
	var TABLE_NAME = "project";
	var defaultProject = {
		name: 'Default',
		id: -1
	}

	self.fetchAllProjects = function() {
		DB.fetchAll(TABLE_NAME).then(function(output) {
			//can not use self.tasks = [], because it changes the reference and it will no more be bound with scope.
			self.projects.splice(0, self.projects.length);
			output.unshift({name: "Create new", id: -1});
			[].push.apply(self.projects, output);	
		})
	}

	self.createProject = function(project) {
		var deferred = $q.defer();
		var query = 'INSERT INTO ' + TABLE_NAME + ' (name) VALUES(?)';
		var values = [project.name];		
		DB.query(query, values).then(function(result) {
			self.projects.push(project);		
		}, function(error) {
			console.log("Error ocured while creating the project: " + error);
		})
	}

	self.getAllProjects = function() {
		return self.projects;
	}

	self.getProjectById = function(projectId) {
		if (angular.isUndefined(projectId)) {
			return defaultProject;
		}
		angular.forEach(self.projects, function(project) {
			if(project.id === projectId) {
				return project;
			}
		})
		return defaultProject;
	}

	return self;
})