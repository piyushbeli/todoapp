angular.module('todo.models', [])

.factory('Task', function(ProjectService) {
	var self = this;

	var Priority = {
		NORMAL: 'low',		
		HIGH: 'high'
	}

	var defaultDueDate = new Date()

	function Alarm(alarm) {
		this.time = alarm.time;
		this.remindAt = alarm.remindAt;
		this.repeat = alarm.repeat;
	}
	
	function Task(task) {
		this.id = task.id;
		this.description = task.description;
		this.project = ProjectService.getProjectById(task.projectId);	
		this.createdTime = typeof task.createdTime != 'undefined' ? task.createdTime : new Date();
		this.isDone = typeof task.isDone != 'undefined' ? new Boolean(task.isDone).valueOf() : false;
		this.priority = typeof task.priority != 'undefined' ? task.priority : Priority.NORMAL;
		this.dueDate = task.dueDate;
		this.remindAt = typeof task.remindAt != 'undefined' ? task.remindAt : null;
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

	Task.prototype.setProject = function(project) {
		this.project = project;
	}
	
	self.build = function(task) {
		if (angular.isArray(task)) {
			var taskObjs = [];
			angular.forEach(task, function(t) {
				var taskObj = new Task(t);
				taskObjs.push(taskObj);
			})
			return taskObjs;
		} else {
			var taskObj = new Task(task);
			return taskObj;
		}
	}

	self.newInstance = function() {
		return new Task({});
	}

	return self;
})