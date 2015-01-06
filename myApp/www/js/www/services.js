'use strict'

angular.module('todo.services', ['todo.config'])

.factory('SqliteService', function($q, DB_CONFIG, $cordovaSQLite) {
	var self = this;
	self.db = null;

	self.init = function() {
		if(window.cordova) {
			self.db = $cordovaSQLite.openDB({ name: "TODO" });
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
})