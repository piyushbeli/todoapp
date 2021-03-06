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
	            	console.log("Error occured in query: " + query + "##Error: " + error.message);
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

.factory('TaskService', function($q, DB, Task, LocalNotificationService) {
	var self = this;
	var TABLE_NAME = 'task';
	self.tasks = [];

	self.fetchAllTasks = function() {
		var deferred = $q.defer();
		DB.fetchAll(TABLE_NAME).then(function(output) {
			//can not use self.tasks = [], because it changes the reference and it will no more be bound with scope.
			self.tasks.splice(0, self.tasks.length);
			output = Task.build(output);
			[].push.apply(self.tasks, output);	
			deferred.resolve(self.tasks);	
		})
		return deferred.promise;
	}

	self.updateTask = function(task) {
		var deferred = $q.defer();
		var query = "";	

		var values = [task.description, task.project.id, new Number(task.isDone).valueOf(), task.priority, task.dueDate, task.remindAt];
		if (angular.isUndefined(task.id)) {
			query = 'INSERT INTO ' + TABLE_NAME + ' (description, projectId, isDone, priority, dueDate, remindAt) VALUES(?, ?, ?, ?, ?, ?)';
		} else {
			query = "UPDATE " + TABLE_NAME + ' SET description = ? , projectId = ?, isDone = ?, priority = ?, dueDate = ?, remindAt = ? where id = ?';
			values.push(task.id);	
		}		
			
		DB.query(query, values).then(function(result) {
			task.id = task.id != null ? task.id : result.insertId;
			LocalNotificationService.createNotification(task);
			//self.tasks.push(Task.build(task));			
			self.fetchAllTasks();	
			deferred.resolve(task);		
		}, function(error) {
			console.log("Error ocured while creating the task: " + error.message);
			deferred.reject(error);
		})
		return deferred.promise;
	}

	self.deleteTask = function(task) {
		var deferred = $q.defer();
		var query = "DELETE FROM " + TABLE_NAME + " WHERE id = ?";
		var values = [task.id];

		DB.query(query, values).then(function(result) {						
			self.fetchAllTasks();	
			LocalNotificationService.deleteNotification(task.id);	
			deferred.resolve(task);		
		}, function(error) {
			console.log("Error ocured while deleting the task: " + error.message);
			deferred.reject(error);
		})
		return deferred.promise;
	}

	self.getAllTasks = function() {
		return self.tasks;
	}

	self.newTaskInstance = function() {
		return Task.newInstance();
	}

	self.markDone = function(taskIds) {
		var deferred = $q.defer();
		var query = "UPDATE " + TABLE_NAME + " SET isDone = 1 WHERE id in (" + taskIds.join(',') + ")";
		DB.query(query).then(function(result) {						
			self.fetchAllTasks();
			LocalNotificationService.deleteNotification(taskId);	
			deferred.resolve(taskIds);		
		}, function(error) {
			console.log("Error ocured while creating the task: " + error.message);
			deferred.reject(error);
		})
		return deferred.promise;
	}


	self.deleteTasks = function(taskIds) {
		var deferred = $q.defer();
		var query = "DELETE FROM " + TABLE_NAME + " WHERE id in (" + taskIds.join(',') + ")";

		DB.query(query).then(function(result) {						
			self.fetchAllTasks();
			LocalNotificationService.deleteNotification(taskIds);	
			deferred.resolve(taskIds);		
		}, function(error) {
			console.log("Error ocured while deleting the task: " + error.message);
			deferred.reject(error);
		})
		return deferred.promise;
	}

	self.getTaskById = function(taskId) {
		if (angular.isUndefined(taskId)) {
			return null;
		}
		for(i in self.tasks) {
			if(self.tasks[i].id == taskId) {
				return self.tasks[i];
			}
		}
		return null;
	}

	return self;
})

.factory("ProjectService", function($q, DB) {
	var self = this;
	self.projects = [];
	var TABLE_NAME = "project";
	var defaultProject = {
		name: 'Default',
		id: 0
	}
	self.selectedProject = {id: ""};

	self.fetchAllProjects = function() {
		var deferred = $q.defer();
		DB.fetchAll(TABLE_NAME).then(function(output) {
			//can not use self.tasks = [], because it changes the reference and it will no more be bound with scope.
			self.projects.splice(0, self.projects.length);		
			[].push.apply(self.projects, output);	
			deferred.resolve(self.projects);
		})
		return deferred.promise;
	}

	self.updateProject = function(project) {
		var deferred = $q.defer();
		var query = 'INSERT INTO ' + TABLE_NAME + ' (name) VALUES(?)';
		var values = [project.name];		
		DB.query(query, values).then(function(result) {
			project.id = project.id != null ? project.id : result.insertId;
			self.projects.push(project);
			deferred.resolve(project);		
		}, function(error) {
			console.log("Error ocured while creating the project: " + error.message);
			deferred.reject(error);
		})
		return deferred.promise;
	}

	self.getAllProjects = function() {
		return self.projects;
	}

	self.getProjectById = function(projectId) {
		if (angular.isUndefined(projectId)) {
			return defaultProject;
		}
		for(i in self.projects) {
			if(self.projects[i].id == projectId) {
				return self.projects[i];
			}
		}
		return defaultProject;
	}

	return self;
})