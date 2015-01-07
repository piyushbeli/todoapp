angular.module('todo.models', [])

.factory('Task', function(ProjectService) {

	function Alarm(alarm) {
		this.time = alarm.time;
		this.remindAt = alarm.remindAt;
		this.repeat = alarm.repeat;
	}
	
	function Task(task) {
		this.id = task.id;
		this.description = task.description;
		this.projectId = task.projectId;
		this.createdTime = typeof task.createdTime != undefined ? task.createdTime : new Date();
		this.done = typeof task.done != undefined ? task.done : false;
	}

	Task.prototype.projectName = function(projectId) {
		return ProjectService.getProjectById(projectId).name;
	}

	Task.prototype.setDueDateAndPriority = function(dueDate, remindAt, repeatEvent, priority) {
		this.dueDate = dueDate;
		this.remindAt = remindAt;
		this.repeatEvent = alarm.repeatEvent;
		this.priority = priority;
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