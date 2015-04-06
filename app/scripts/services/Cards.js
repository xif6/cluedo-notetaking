'use strict';


angular.module('cluedoApp.Cards', [])
    .factory('Cards', function () {

        var cardsTmp = [
            // suspects
            {'type': 'suspects', 'name': 'olive'},
            {'type': 'suspects', 'name': 'moutarde'},
            {'type': 'suspects', 'name': 'pervenche'},
            {'type': 'suspects', 'name': 'violet'},
            {'type': 'suspects', 'name': 'rose'},
            {'type': 'suspects', 'name': 'leblanc'},
            // weapons
            {'type': 'weapons', 'name': 'clé anglaise'},
            {'type': 'weapons', 'name': 'chandelier'},
            {'type': 'weapons', 'name': 'poignard'},
            {'type': 'weapons', 'name': 'revolver'},
            {'type': 'weapons', 'name': 'barre de fer'},
            {'type': 'weapons', 'name': 'corde'},
            // rooms
            {'type': 'rooms', 'name': 'salle de bain'},
            {'type': 'rooms', 'name': 'bureau'},
            {'type': 'rooms', 'name': 'salle à manger'},
            {'type': 'rooms', 'name': 'salle de jeux'},
            {'type': 'rooms', 'name': 'garage'},
            {'type': 'rooms', 'name': 'chambre'},
            {'type': 'rooms', 'name': 'salon'},
            {'type': 'rooms', 'name': 'cuisine'},
            {'type': 'rooms', 'name': 'entrée'}
        ];

        var cardsPlayerNull = angular.copy(cardsTmp);
        cardsPlayerNull.forEach(function (card) {
            card.hand = null;
        });

        var cardsPlayerFalse = angular.copy(cardsTmp);
        cardsPlayerFalse.forEach(function (card) {
            card.hand = false;
        });

        var cards = function () {
            var cards = angular.copy(cardsTmp);
            var cardsPlayer = angular.copy(cardsPlayerNull);
            this.getCards = function () {
                return cards;
            };
            this.getCardsPlayers = function () {
                return cardsPlayer;
            };
        };

        return cards;
    });