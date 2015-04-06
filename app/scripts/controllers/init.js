'use strict';

angular.module('cluedoApp.init', ['cluedoApp.Player', 'cluedoApp.party'])

    .controller('InitCtrl',
    ['$scope', '$filter', '$location', 'Player', 'party',
        function ($scope, $filter, $location, Player, party) {
            $scope.newPlayer = new Player();
            $scope.players = angular.copy(party.players);

            $('#playerName').focus();

            $scope.save = function () {
                $scope.players.push($scope.newPlayer);
                $scope.newPlayer = new Player();
                $('#playerName').focus();
            };

            $scope.finish = function () {
                party.setPlayers($scope.players);
                party.init();
            };

            $scope.saveAndFinish = function () {
                $scope.save();
                $scope.finish();
            };
        }
    ])

;