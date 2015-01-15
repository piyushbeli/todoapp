angular.module('todo.controllers', ['todo.filters'])

.controller('TasksController', function($scope, $ionicModal, $timeout, TaskService, ProjectService) {
    $timeout(function() {
      ProjectService.fetchAllProjects();
      TaskService.fetchAllTasks();      
    }, 2000);

    $scope.tasks = TaskService.getAllTasks();
    $scope.projects = ProjectService.getAllProjects();

    $scope.selectedTasks = [];

    /*Calendar setting.
    $scope.eventSources = [];    
    $scope.dueDateCalander = {}; 
    
      $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'month basicWeek basicDay agendaWeek agendaDay',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      }
    };*/
    
    $ionicModal.fromTemplateUrl('templates/taskModal.html', {
      scope: $scope,
      animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.taskModal = modal;
    }) 

    $ionicModal.fromTemplateUrl('templates/projectModal.html', {
      scope: $scope,
      animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.projectModal = modal;
    }) 

   $ionicModal.fromTemplateUrl('templates/dueDateModal.html', {
    scope: $scope,
    animation: 'slide-in-right'
    }).then(function(modal) {
      $scope.dueDateModal = modal;
    }) 
     

    $scope.projectName = function(projectId) {
      return ProjectService.getProjectById(projectId).name;
    }  

    $scope.taskDetail = function(task) {      
      $scope.task = angular.copy(task);
      $scope.taskModal.show();
    }

    $scope.updateTask = function() {
      TaskService.updateTask($scope.task);
      $scope.taskModal.hide();
    }

    $scope.cancelTaskChanges = function() {
      $scope.task = $scope.taskBackup;
      $scope.taskModal.hide();
    }

    $scope.openAddTaskDialog = function() {     
      $scope.task = TaskService.newTaskInstance();
      $scope.taskModal.show();
    }

    $scope.openProjectSelectorDialog = function() {  
      $scope.newProject = {};   
      $scope.projectModal.show();
    }

    $scope.assignProject = function(project) {
      $scope.task.setProject(project);
      $scope.projectModal.hide();
      /*TaskService.updateTask($scope.task).then(function() {
        $scope.projectModal.hide();
      });*/
      
    }

    $scope.createNewProjectAndAssign = function(newProject) {
      ProjectService.updateProject(newProject).then(function(project) {
        $scope.assignProject(project);
        $scope.newProject = {};
      })
    }

    $scope.openDueDateDialog = function() {              
      $scope.dueDateModal.show();
    }

    $scope.selectTask = function(taskId) {
      event.stopPropagation();
      if (event.target.checked) {
        $scope.selectedTasks.push(taskId);
      } else {
        $scope.selectedTasks.splice($scope.selectedTasks.indexOf(taskId),1);
      }
    }

    $scope.deleteSelected = function() {
      TaskService.deleteTasks($scope.selectedTasks).then(function() {
        $scope.selectedTasks = [];
      })
    }

    $scope.markDoneSelected = function() {
      TaskService.markDone($scope.selectedTasks).then(function() {
        $scope.selectedTasks = [];
      })
    }
     
})

.controller('SearchController', function($scope) {
    $scope.searchString = "";
})