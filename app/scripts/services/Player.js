'use strict';


angular.module('cluedoApp.Player', ['cluedoApp.Cards'])
    .factory('Player', ['$rootScope', 'Cards', function ($rootScope, Cards) {

        var player = function (name) {

            this.name = name;
            this.nbCardsKnown = 0;
            this.nbCardsExpected = 0;
            this.cardsPossible = [];
            this.locked = false;
            this.me = false;

            this.cards = new Cards().getCardsPlayers();
        };

        return player;
    }]);