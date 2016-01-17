/*global angular: true*/

var todoApp = angular.module('todoApp', [
    'todoAppControllers',
    'todoAppServices'
]).config(function($httpProvider) {
    // authentication interceptor, mandatory shit
    $httpProvider.interceptors.push('authInterceptor');
});


// Do stuff when jQuery says page is ready 
$(document).ready(function() {
    // initialize the navbar
    $(".button-collapse").sideNav();
    // Initializes the priority dropdown menu
    $('select').material_select();
});