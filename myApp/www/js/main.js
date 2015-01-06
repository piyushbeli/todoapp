require.config({
	baseUrl: 'js',
	paths: {
		'angular': 'bower_components/angular/angular.min',
        'angularAMD': 'bower_components/angularAMD/angularAMD.min',
        'ngload': 'bower_components/angularAMD/ngload.min',
        'angular-route': 'bower_components/angular-route/angular-route.min',
	},
	shim: {
        'angularAMD': ['angular'],
        'ngload': ['angularAMD'],
        'angular-route': ['angular']
    },    
    deps: ['app']
})