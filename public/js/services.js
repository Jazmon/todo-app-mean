/*global angular*/

var todoAppServices = angular.module('todoAppServices', ['ngResource']);

todoAppServices.factory('Todo', ['$resource',
    function($resource) {
        return $resource('/api/tasks/:_id', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

todoAppServices.factory('Lists', ['$resource',
    function($resource) {
        return $resource('/api/lists/:_id', {}, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

todoAppServices.factory('Users', ['$resource',
    function($resource) {
        return $resource('/api/users/:_id', {}, {});
    }
]);

todoAppServices.factory('authInterceptor', function($rootScope, $q, $window) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                // These both must be set for this to work, for some magicks reasons :D (even though not set in the example)
                // https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                config.headers.token = $window.sessionStorage.token;
            }
            
            return config;
        },
        response: function(response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    }
});