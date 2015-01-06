angular.module('todo.controllers', [])

.controller('TasksController', function($scope, $ionicModal, $timeout, TaskService, ProjectService) {
    $timeout(function() {
      TaskService.fetchAllTasks();
      ProjectService.fetchAllProjects();
    }, 2000);
    $scope.tasks = TaskService.getAllTasks();
    $scope.projects = ProjectService.getAllProjects();  

    $scope.projectName = function(projectId) {
      return ProjectService.getProjectById(projectId).name;
    }  
})

.controller('SearchController', function($scope) {
    $scope.searchString = "";
})


.controller('AppController', function($scope, $stateParams, $ionicModal, TaskService) {
    $scope.groupBy = 'project';
    $ionicModal.fromTemplateUrl('templates/addTaskModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addTaskModal = modal;
    })      

    $scope.openAddTaskDialog = function() {     
      $scope.task = {};
      $scope.addTaskModal.show();
    }
    $scope.addTask = function() {
      TaskService.createTask($scope.task);
      $scope.addTaskModal.hide();
    }
});
