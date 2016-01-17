/*global angular*/

var todoAppControllers = angular.module('todoAppControllers', []);

// Controller for the login form
todoAppControllers.controller('LoginController', ['$scope', 'Users', '$window', '$http',
    function($scope, Users, $window, $http) {
        $('#login').addClass('active');
        // Message that is displayed if login error
        $scope.message = '';
        // Login function
        $scope.login = function(user) {
            // authenticate the user
            $http
                .post('/authenticate', user)
                .success(function(data, status, headers, config) {
                    // check if the token was set, meaning login successful
                    if (data.token != undefined) {
                        // set the token into the browswers web storage. 
                        // This might not work in older browsers but fuck 'em
                        $window.sessionStorage.token = data.token;
                        // return the user to the app page
                        $window.location.href = "../";
                    }
                    else {
                        // if no token, the username or password was wrong.
                        $scope.message = 'Error: invalid User or password';
                    }
                })
                .error(function(data, status, headers, config) {
                    // erase the token if the user fails to log in
                    delete $window.sessionStorage.token;
                    $scope.message = 'Error: invalid User or password';
                });
        };
    }
]);

// controller for the todo app
todoAppControllers.controller('TodoController', ['$scope', 'Todo', 'Lists',
    function($scope, Todo, Lists) {
        $('#app').addClass('active');
        // Set up loading variables
        var todosLoaded = false,
            listsLoaded = false;
        $scope.loading = true;

        $scope.orderProp = "_id";
        $scope.newList = false;
        $scope.filter = {};

        // Load the lists
        Lists.query({}, function(result) {
            // set the lists on the http success response
            $scope.lists = result;
            // set the active list to the first one
            $scope.list = $scope.lists[0];
            // set the filter listname
            $scope.filter.listName = $scope.list.name;
            // set loading variables
            listsLoaded = true;
            $scope.loading = (todosLoaded && listsLoaded) ? false : true;

            // Load the todos
            Todo.query({}, function(result) {
                // set the todos on the http success response
                $scope.todos = result;

                // setup a new list
                if (!$scope.list) {
                    $scope.list = new Lists();
                }
                // Setup a new Todo
                if (!$scope.todo) {
                    $scope.todo = new Todo();
                }
                $scope.todo.user = "default";
                $scope.todo.done = false;
                // set the current list to the new todo
                $scope.todo.listName = $scope.list.name;


                $('ul.tabs').tabs();

                // set loading variables
                todosLoaded = true;
                $scope.loading = (todosLoaded && listsLoaded) ? false : true;
            }, function(error) {
                // if error just stop loading for now
                // could add some info to the user here
                $scope.loading = false;
            });

        }, function(error) {
            $scope.loading = false;
        });


        // sets the currently shown list
        $scope.setList = function(list) {
            // Set filter by list name
            $scope.todo.listName = list.name;
            $scope.filter.listName = list.name;
            // set the current active list
            $scope.list = list;

            // set to not show newlist form if shown
            $scope.showListForm(false);

            $('select').val("");
            $('select').material_select();
        };

        // Show the new list form
        $scope.showListForm = function(show) {
            $scope.newList = show;
        };

        // Remove a list
        $scope.removeList = function() {
            // set loading vars
            $scope.loading = true;
            var todosLoaded = false;
            var listsLoaded = false;

            // delete from the lists
            Lists.delete({
                _id: $scope.list._id
            }).$promise.then(function(value) {
                // query the lists to see the existing ones
                Lists.query({}, function(result) {
                    // set the lists as the http response
                    $scope.lists = result;
                    $scope.list = $scope.lists[0];
                    // set loading vars
                    listsLoaded = true;
                    $scope.loading = (todosLoaded && listsLoaded) ? false : true;
                });
                // update the todos list as well
                Todo.query({}, function(result) {
                    $scope.todos = result;
                    // set loading vars
                    todosLoaded = true;
                    $scope.loading = (todosLoaded && listsLoaded) ? false : true;
                });
            }, function(error) {
                // if error, throw error
                console.error(error);
                $scope.loading = false;
                throw error;
            });
            // set the list to be the first list
            $scope.setList($scope.lists[0]);

            // Also delete the todos with it
            // Didn't work :(
            /* Todo.delete({
                 listName: $scope.list.name
             }).$promise.then(function(value) {
                 $scope.todos = Todo.query();
                 $scope.loading = false;
             }, function(error) {
                 $scope.loading = false;
                 console.error(error);
                 throw error;
             })*/
        };

        // removes a todo
        $scope.removeTask = function(todo) {
            // set loading var
            $scope.loading = true;
            // delete the todo with id
            Todo.delete({
                _id: todo._id
            }, {}, function(value, response) {}, function(httpResponse) {
                
            }).
            $promise.then(
                function(value) {
                    $scope.todos = Todo.query();
                    $scope.loading = false;
                },
                function(error) {
                    $scope.loading = false;
                    console.error(error);
                    throw error;
                }
            );
        };

        $scope.newTodo = function() {
            $scope.todo = new Todo();
            $scope.todo.user = "default";
            $('select').val("");
            $('select').material_select();
            $scope.todo.done = false;
            $scope.todo.listName = $scope.list.name;
            $scope.editing = false;
        };

        $scope.createNewList = function() {
            $scope.list = new Lists();
            $scope.editingList = false;
            $scope.newList = true;
        };

        $scope.activeTodo = function(todo) {
            $scope.todo = todo;
            $('select').val(todo.priority);
            $('select').material_select();
            $scope.todo.user = "default";
            $scope.todo.done = false;
            $scope.editing = true;
        };

        $scope.editList = function(list) {
            $scope.list = list;
            $scope.editingList = true;
            $scope.newList = true;
            $scope.todo.listName = $scope.list.name;
        };

        $scope.saveList = function(list) {
            if ($scope.list._id) {
                Lists.update({
                    _id: $scope.list._id
                }, $scope.list);
            }
            else {
                $scope.loading = true;
                $scope.list.$save().then(function(response) {
                    //$scope.lists.push(response);
                    // query the lists to see the existing ones
                    Lists.query({}, function(result) {
                        // set the lists as the http response
                        $scope.lists = result;
                        $scope.list = $scope.lists[0];
                        // set loading vars
                        listsLoaded = true;
                        $scope.loading = (todosLoaded && listsLoaded) ? false : true;
                    });
                    // update the todos list as well
                    Todo.query({}, function(result) {
                        $scope.todos = result;
                        // set loading vars
                        todosLoaded = true;
                        $scope.loading = (todosLoaded && listsLoaded) ? false : true;
                    });
                    $('ul.tabs').tabs();
                });
            }


            $scope.newList = false;
            $scope.list = new Lists();
        };

        $scope.save = function(todo) {
            // Check data, if not set show alert or toast error message or something
            if ($scope.todo._id) {
                Todo.update({
                    _id: $scope.todo._id
                }, $scope.todo);
            }
            else {
                $scope.loading = true;
                $scope.todo.$save().then(function(response) {
                    // didn't work too well, causes a bug where removing it instantly doesn't work
                    //$scope.todos.push(response);
                    Todo.query({}, function(result) {
                        $scope.todos = result;
                        // set loading vars
                        todosLoaded = true;
                        $scope.loading = (todosLoaded && listsLoaded) ? false : true;
                    });
                });
            }

            $scope.editing = false;
            $scope.todo = new Todo();
            $scope.todo.user = "default";
            $scope.todo.done = false;
            $('select').val("");
            $('select').material_select();
            $scope.todo.listName = $scope.list.name;
        };

        $scope.markDone = function(todo) {
            todo.done = !todo.done;
            Todo.update({
                _id: todo._id
            }, todo);
        };

        $scope.orderBy = function(order) {
            $scope.orderProp = order;
        };
    }
]);
