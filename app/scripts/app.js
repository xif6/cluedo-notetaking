'use strict';

angular.module('cluedoApp', [
    'cluedoApp.init',
    'cluedoApp.init-non-player',
    'cluedoApp.init-player-order',
    'cluedoApp.game',
    'cluedoApp.resume',
    'cluedoApp.cardsDirective',
    'ngRoute',
    'ui.bootstrap'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/init', {
                templateUrl: 'views/init.html',
                controller: 'InitCtrl'
            })
            .when('/init-non-player', {
                templateUrl: 'views/init-non-player.html',
                controller: 'InitNonPlayerCtrl'
            })
            .when('/init-player-order', {
                templateUrl: 'views/init-player-order.html',
                controller: 'InitPlayerOrderCtrl'
            })
            .when('/game', {
                templateUrl: 'views/game.html',
                controller: 'GameCtrl'
            })
            .when('/resume', {
                templateUrl: 'views/resume.html',
                controller: 'ResumeCtrl'
            })
            .otherwise({redirectTo: '/init'});
    }])

;
