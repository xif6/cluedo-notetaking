"use strict";

describe('party round by round', function () {
    var party, $location, Cards, $filter, Player;

    beforeEach(module('cluedoApp.party'));

    beforeEach(inject(function ($injector) {
        party = $injector.get('party');
        $location = $injector.get('$location');
        Cards = $injector.get('Cards');
        $filter = $injector.get('$filter');
        Player = $injector.get('Player');
    }));

    beforeEach(function () {
        var players = [
            new Player('p1-a'),
            new Player('p2-f'),
            new Player('p3-h'),
            new Player('p4-v')
        ];
        party.setPlayers(players);
        var nonPlayerCardsMock = new Cards().getCardsPlayers();
        var cardOlive = $filter('filter')(nonPlayerCardsMock, {name: 'olive'}).shift();
        var cardEntree = $filter('filter')(nonPlayerCardsMock, {name: 'entrée'}).shift();
        var indexOlive = nonPlayerCardsMock.indexOf(cardOlive);
        var indexEntree = nonPlayerCardsMock.indexOf(cardEntree);
        nonPlayerCardsMock[indexOlive].hand = true;
        nonPlayerCardsMock[indexEntree].hand = true;
        party.setNonPlayerCards(nonPlayerCardsMock);
        party.currentPlayer = party.players[0].name;
        party.init();
    });


    describe('rounds', function () {
        var players;

        beforeEach(function () {
            players = angular.copy(party.players);
            var hypothesis = {
                'p1-a': {
                    playerShow: 'p2-f',
                    card: [
                        {type: 'suspects', name: 'leblanc'}, // *
                        {type: 'weapons', name: 'corde'},
                        {type: 'rooms', name: 'salon'}
                    ]
                },
                'p2-f': {
                    playerShow: 'p3-h',
                    card: [
                        {type: 'suspects', name: 'moutarde'},
                        {type: 'weapons', name: 'poignard'}, // *
                        {type: 'rooms', name: 'chambre'}
                    ]
                },
                'p3-h': {
                    playerShow: 'p4-v',
                    card: [
                        {type: 'suspects', name: 'moutarde'}, // *
                        {type: 'weapons', name: 'clé anglaise'},
                        {type: 'rooms', name: 'bureau'}
                    ]
                },
                'p4-v': {
                    playerShow: 'p1-a',
                    card: [
                        {type: 'suspects', name: 'violet'}, // *
                        {type: 'weapons', name: 'revolver'},
                        {type: 'rooms', name: 'salon'}
                    ]
                }
            };

            for (var playerName in hypothesis) {
                party.playerHypothesis(hypothesis[playerName].playerShow, hypothesis[playerName].card);
            }

            players[0].cardsPossible.push(hypothesis['p4-v'].card);
            players[1].cardsPossible.push(hypothesis['p1-a'].card);
            players[2].cardsPossible.push(hypothesis['p2-f'].card);
            players[3].cardsPossible.push(hypothesis['p3-h'].card);
        });

        it('first round', function () {
            expect(party.players[0]).toEqual(players[0]);
            expect(party.players[1]).toEqual(players[1]);
            expect(party.players[2]).toEqual(players[2]);
            expect(party.players[3]).toEqual(players[3]);
        });

        describe('2', function () {

            beforeEach(function () {
                players = angular.copy(party.players);
                var hypothesis = {
                    'p1-a': {
                        playerShow: 'p3-h',
                        card: [
                            {type: 'suspects', name: 'moutarde'},
                            {type: 'weapons', name: 'poignard'},
                            {type: 'rooms', name: 'salle à manger'} // *
                        ]
                    },
                    'p2-f': {
                        playerShow: 'p3-h',
                        card: [
                            {type: 'suspects', name: 'pervenche'},
                            {type: 'weapons', name: 'revolver'}, // *
                            {type: 'rooms', name: 'chambre'}
                        ]
                    },
                    'p3-h': {
                        playerShow: 'p1-a',
                        card: [
                            {type: 'suspects', name: 'violet'}, // *
                            {type: 'weapons', name: 'chandelier'},
                            {type: 'rooms', name: 'garage'}
                        ]
                    },
                    'p4-v': {
                        playerShow: 'p1-a',
                        card: [
                            {type: 'suspects', name: 'Rose'},
                            {type: 'weapons', name: 'chandelier'}, // *
                            {type: 'rooms', name: 'bureau'}
                        ]
                    }
                };

                for (var playerName in hypothesis) {
                    party.playerHypothesis(hypothesis[playerName].playerShow, hypothesis[playerName].card);
                }
                var indexSuspects, indexWeapons, indexRooms;

                var cardsMock = new Cards().getCardsPlayers();

                indexSuspects = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'moutarde'}).shift());
                indexWeapons = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'poignard'}).shift());
                indexRooms = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'salle à manger'}).shift());
                players[1].cards[indexSuspects].hand = false;
                players[1].cards[indexWeapons].hand = false;
                players[1].cards[indexRooms].hand = false;

                indexSuspects = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'violet'}).shift());
                indexWeapons = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'chandelier'}).shift());
                indexRooms = cardsMock.indexOf($filter('filter')(cardsMock, {name: 'garage'}).shift());
                players[3].cards[indexSuspects].hand = false;
                players[3].cards[indexWeapons].hand = false;
                players[3].cards[indexRooms].hand = false;

                players[0].cardsPossible.push(hypothesis['p3-h'].card);
                players[0].cardsPossible.push(hypothesis['p4-v'].card);
                players[2].cardsPossible.push(hypothesis['p1-a'].card);
                players[2].cardsPossible.push(hypothesis['p2-f'].card);
            });

            it('second round', function () {
                expect(party.players[0]).toEqual(players[0]);
                expect(party.players[1]).toEqual(players[1]);
                expect(party.players[2]).toEqual(players[2]);
                expect(party.players[3]).toEqual(players[3]);
            });
        });
    });
});
