angular.module('todo.controllers', [])

.controller('TasksController', function($scope, $ionicModal, $timeout, TaskService, ProjectService) {
    $timeout(function() {
      TaskService.fetchAllTasks();
      ProjectService.fetchAllProjects();
    }, 2000);
    $scope.tasks = TaskService.getAllTasks();
    $scope.projects = ProjectService.getAllProjects();
    $ionicModal.fromTemplateUrl('templates/taskModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.taskModal = modal;
      }) 
     

    $scope.projectName = function(projectId) {
      return ProjectService.getProjectById(projectId).name;
    }  

    $scope.taskDetail = function(task) {
      $scope.task = task;
      $scope.taskModal.show();
    }

    $scope.addTask = function() {
      TaskService.createTask($scope.task);
      $scope.taskModal.hide();
    }
     
})

.controller('SearchController', function($scope) {
    $scope.searchString = "";
})


.controller('AppController', function($scope, $stateParams, $ionicModal, TaskService) {
    $scope.groupBy = 'project';
    $ionicModal.fromTemplateUrl('templates/taskModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.taskModal = modal;
    }) 

    $scope.openAddTaskDialog = function() {     
      $scope.task = {};
      $scope.taskModal.show();
    }
    $scope.addTask = function() {
      TaskService.createTask($scope.task);
      $scope.taskModal.hide();
    }
});
