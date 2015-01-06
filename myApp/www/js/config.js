angular.module('todo.config', [])
.constant('DB_CONFIG', {
    name: 'TODO',
    tables: [
      {
            name: 'project',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'name', type: 'text unique'}
            ]
      },
      {            
            name: 'task',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'description', type: 'text'},
                {name: 'projectId', type: 'integer'} 
            ],         
            constraints: [
                "FOREIGN KEY(projectId) REFERENCES project(id)"
            ]

        }
    ],

    evalution: [
        
    ]
});