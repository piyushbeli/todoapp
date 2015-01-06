angular.module('todo.models', [])

.factory('Task', function(ProjectService) {
	
	function Task(task) {
		this.id = task.id;
		this.description = task.description;
		this.projectId = task.projectId;
	}

	Task.prototype.projectName = function(projectId) {
		if(angular.isUndefined(projectId)) {
			return "Default";
		}
		var projects = ProjectService.getAllProjects();
		angular.forEach(projects, function(project) {
			if (project.id === projectId) {
				return project.name;
			}
		})
		return "Default";
	}

	self.build = function(task) {
		if (angular.isArray(task)) {
			var newTasks = [];
			angular.forEach(task, function(t) {
				var newTask = new Task(t);
				newTasks.push(newTask);
			})
			return newTasks;
		} else {
			var newTask = new Task(task);
			return newTask;
		}
	}

	return self;
})