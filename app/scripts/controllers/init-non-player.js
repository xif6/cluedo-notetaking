'use strict';

angular.module('cluedoApp.init-non-player', ['cluedoApp.Player', 'cluedoApp.party'])

    .controller('InitNonPlayerCtrl',
    ['$scope', '$filter', '$location', 'Player', 'party',
        function ($scope, $filter, $location, Player, party) {
            $scope.party = party;
            $scope.nonPlayerCards = angular.copy(party.nonPlayer.cards);

            $scope.save = function () {
                party.setNonPlayerCards($scope.nonPlayerCards);
                party.init();
            };
        }
    ])

;