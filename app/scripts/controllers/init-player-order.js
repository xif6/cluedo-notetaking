'use strict';

angular.module('cluedoApp.init-player-order', ['cluedoApp.Player', 'cluedoApp.party', 'ui.sortable'])

    .controller('InitPlayerOrderCtrl',
    ['$scope', '$filter', '$location', 'Player', 'party',
        function ($scope, $filter, $location, Player, party) {
            $scope.party = party;

            $scope.save = function () {
                party.currentPlayer = party.players[0].name;
                party.init();
            };
        }
    ])

;