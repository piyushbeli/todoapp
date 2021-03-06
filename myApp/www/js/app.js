// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('todo', ['ionic', 'ngCordova', 'todo.controllers', 'todo.localnotifications', 'todo.services', 'angular.filter', 'pickadate', 'picktime'])

.run(function($ionicPlatform, $cordovaSQLite, DB, LocalNotificationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    DB.init();
    if (window.plugin && window.plugin.notification.local) {
        //Ask user to give the permission.
        LocalNotificationService.registerPermission();        
    }    
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'TasksController'
  })

  .state('app.search', {
    url: "/search",   
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
        controller: "SearchController"
      }
    }
  })

  .state('app.tasks', {
    url: "/tasks",    
    views: {
      'menuContent': {
        templateUrl: "templates/tasks.html",
        controller: "TasksController"
      }
    }   
  })

  .state('app.tasks.notification', {
    url: "/task/:id",    
    views: {
      'menuContent': {
        templateUrl: "templates/taskModal.html",
        controller: "TasksReminderController"
      }
    }   
  })          
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tasks');
});
