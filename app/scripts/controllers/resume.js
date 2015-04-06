'use strict';

angular.module('cluedoApp.resume', ['cluedoApp.Cards', 'cluedoApp.Player', 'cluedoApp.party'])

    .controller('ResumeCtrl',
    ['$scope', '$filter', '$location', 'Cards', 'Player', 'party',
        function ($scope, $filter, $location, Cards, Player, party) {
/*
            var cards = new Cards().getCards();
            var other = [];
            other.push(new Player());
            other.push(new Player());
            other.push(new Player());
            other.push(new Player());
            other[0].me = true;
            other[0].name = 'hgkjfdsg-p1';
            other[1].name = 'gfdgsf-p2';
            other[2].name = 'gdssa-p3';
            other[3].name = 'ee-p4';
            party.setPlayers(other);

            party.cardPlayerTrue(party.nonPlayer, cards[7]);
            party.cardPlayerTrue(party.nonPlayer, cards[16]);

            party.cardPlayerTrue(party.players[0], cards[2]);
            party.cardPlayerTrue(party.players[0], cards[16]);
            party.cardPlayerTrue(party.players[0], cards[8]);
            party.cardPlayerTrue(party.players[0], cards[1]);

            party.cardPlayerTrue(party.players[1], cards[4]);
            party.cardPlayerTrue(party.players[1], cards[18]);
            //party.cardPlayerFalse(party.players[1], cards[5]);

            party.cardPlayerFalse(party.players[2], cards[5]);
            party.cardPlayerFalse(party.players[2], cards[11]);

            party.cardPlayerTrue(party.players[3], cards[3]);
            party.cardPlayerTrue(party.players[3], cards[0]);
            party.cardPlayerFalse(party.players[3], cards[5]);
            party.cardPlayerFalse(party.players[3], cards[10]);

            party.generate();
//*/


            $scope.party = party;

            $scope.cardsResume = angular.copy(party.hypothesis);
            var playersAll = angular.copy(party.players);
            playersAll.push(party.nonPlayer);

            $scope.cardsResume.forEach(function (card) {
                var cardHand = angular.copy(card);
                card.players = [];

                cardHand.hand = true;
                var player = $filter('filter')(playersAll, {cards: cardHand}).shift();
                if (player) {
                    card.players.push(player);
                } else {

                    cardHand.hand = null;
                    var players = $filter('filter')(playersAll, {cards: cardHand});
                    players.forEach(function (player) {
                        card.players.push(player);
                    });
                }
            });
        }
    ])

;