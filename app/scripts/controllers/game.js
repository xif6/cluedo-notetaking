'use strict';

angular.module('cluedoApp.game', ['cluedoApp.Player', 'cluedoApp.party'])

    .controller('GameCtrl',
    ['$scope', '$filter', 'Player', 'Cards', 'party',
        function ($scope, $filter, Player, Cards, party) {
//*
            var other = [];
            other.push(new Player());
            other.push(new Player());
            other.push(new Player());
            other.push(new Player());
            other[0].me = true;
            other[0].name = 'p1';
            other[1].name = 'p2';
            other[2].name = 'p3';
            other[3].name = 'p4';
            other[3].cards[3].hand = true;
            other[3].cards[6].hand = true;
            other[0].cards[2].hand = true;
            other[1].cards[18].hand = true;
            other[1].cards[3].hand = true;
            other[2].cards[6].hand = false;
            other[0].cards[9].hand = false;
            other[0].cards[15].hand = false;
            other[3].cards[10].hand = false;
            party.nonPlayer.cards[7] = true;
            party.nonPlayer.cards[11] = true;
            party.setPlayers(other);
//*/

            $scope.party = party;
            var limitTo = 0 - (party.players.length - 1);
            $scope.round = new Cards().getCards();
            $scope.roundView = {};
            $scope.roundView.model = [
                {type: 'suspects', name: null},
                {type: 'weapons', name: null},
                {type: 'rooms', name: null}
            ];

            $scope.roundSelectedView = {};
            $scope.roundSelectedView.name = 'round-selected';
            $scope.roundSelectedView.required = function () {
                return ($scope.party.players[0].me && $scope.playerShowCard != '' && $scope.playerShowCard != 'cluedo-nobody');
            };

            var startPlayer = function () {
                $scope.roundView.model.forEach(function (card) {
                    card.name = null;
                });

                $scope.roundSelectedView.model = null;

                $scope.playerShowCard = null;
            };
            startPlayer();

            $scope.hypothesis = function () {

                party.playerHypothesis($scope.playerShowCard, $scope.roundView.model, $scope.roundSelectedView.model);
                startPlayer();

                return;

                console.log($scope.roundView.model, angular.copy(party));
                $scope.otherPlayers.every(function (player) {
                    if (player.name != $scope.playerShowCard) {
                        $scope.roundView.model.forEach(function (card) {
                            party.cardPlayerFalse(player, card);
                        });
                        return true;
                    } else {
                        if (!player.locked) {
                            if ($scope.roundSelectedView.model && $scope.roundSelectedView.model.name != '') {
                                party.cardPlayerTrue(player, $scope.roundSelectedView.model);
                            } else {
                                party.addCardsPossible(player, $scope.roundView.model);
                            }
                        }
                        return false;
                    }
                });
                console.log($scope.roundView.model, angular.copy(party));
                console.log('-----------------------------');
                $scope.nextPlayer();
            };

            /*
             $scope.disabled = function () {
             console.log($scope.playerShowCard, $scope.cardView);
             if (
             $scope.hypothesisPlayer.suspects == '' ||
             $scope.hypothesisPlayer.weapons == '' ||
             $scope.hypothesisPlayer.rooms == '' ||
             $scope.playerShowCard == '' ||
             ($scope.playerShowCard != 'cluedo-nobody' && $scope.cardView == '')
             ) {
             return true;
             } else {
             return false;
             }
             };
             //*/
        }
    ])
;