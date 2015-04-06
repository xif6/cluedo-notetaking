"use strict";

describe('party', function () {
    var party, $location, Cards, $filter, Player;

    beforeEach(module('cluedoApp.party'));

    beforeEach(inject(function ($injector) {
        party = $injector.get('party');
        $location = $injector.get('$location');
        Cards = $injector.get('Cards');
        $filter = $injector.get('$filter');
        Player = $injector.get('Player');
    }));

    describe('redirect', function () {
        beforeEach(function () {
            spyOn($location, 'path');
        });

        it('should redirect to "/init" if party is not configured', function () {
            party.init();
            expect($location.path).toHaveBeenCalledWith('/init');
        });

        it('should redirect to "/init-non-player" if party is configured but he need card NPC', function () {
            var playersMock = [{}, {}, {}, {}];
            party.setPlayers(playersMock);
            party.init();
            expect($location.path).toHaveBeenCalledWith('/init-non-player');
        });

        it('should redirect to "/init-player-order" if party is configured and set card NPC', function () {
            spyOn(party, 'cardPlayerFalse');
            var playersMock = [{}, {}, {}, {}];
            var nonPlayerCardsMock = new Cards().getCardsPlayers();
            nonPlayerCardsMock[0].hand = true;
            nonPlayerCardsMock[1].hand = true;
            party.setPlayers(playersMock);
            party.setNonPlayerCards(nonPlayerCardsMock);
            party.init();
            expect($location.path).toHaveBeenCalledWith('/init-player-order');
        });

        it('should redirect to "/init-player-order" if party is configured but he NOT need card NPC', function () {
            var playersMock = [{}, {}, {}];
            party.setPlayers(playersMock);
            party.init();
            expect($location.path).toHaveBeenCalledWith('/init-player-order');
        });

        it('should redirect to "/game" if party is totally configured', function () {
            var playersMock = [{}, {}, {}];
            party.setPlayers(playersMock);
            party.currentPlayer = playersMock.shift();
            party.init();
            expect($location.path).toHaveBeenCalledWith('/game');
        });
    });

    describe('players', function () {
            beforeEach(function () {
                var players = [new Player('p1'), new Player('p2'), new Player('p3')];
                party.setPlayers(players);
                party.currentPlayer = party.players[0].name;
            });

        describe('player cards', function () {
            var card;
            beforeEach(function () {
                card = {name: 'corde', type: 'weapons'};
            });

            it('card player true, false call other player and false hypothesis', function () {
                spyOn(party, 'cardPlayerFalse');
                party.cardPlayerTrue(party.players[0], card);
                var cardPlayer = $filter('filter')(party.players[0].cards, card).shift();
                var index = party.players[0].cards.indexOf(cardPlayer);
                expect(party.players[0].cards[index].hand).toEqual(true);
                expect(party.cardPlayerFalse).toHaveBeenCalledWith(party.players[1], card);
                expect(party.cardPlayerFalse).toHaveBeenCalledWith(party.players[2], card);
                expect(party.cardPlayerFalse.calls.count()).toEqual(2);

                expect(party.hypothesis[index].hand).toEqual(false);
            });

            it('card player false, nothing other player and nothing hypothesis', function () {
                party.cardPlayerFalse(party.players[0], card);
                var cardPlayer = $filter('filter')(party.players[0].cards, card).shift();
                var index = party.players[0].cards.indexOf(cardPlayer);
                expect(party.players[0].cards[index].hand).toEqual(false);
                expect(party.players[1].cards[index].hand).toEqual(null);
                expect(party.players[2].cards[index].hand).toEqual(null);

                expect(party.hypothesis[index].hand).toEqual(null);
            });
        });


        describe('possible cards | add 1', function () {
            var cardPossible1, cardPossible2;

            beforeEach(function () {
                cardPossible1 = [
                    {name: 'moutarde', type: 'suspects'},
                    {name: 'corde', type: 'weapons'},
                    {name: 'chambre', type: 'rooms'}
                ];
                cardPossible2 = [
                    {name: 'olive', type: 'suspects'},
                    {name: 'revolver', type: 'weapons'},
                    {name: 'bureau', type: 'rooms'}
                ];
                party.addCardsPossible(party.players[0], cardPossible1);
            });

            it('should add card possible', function () {
                expect(party.players[0].cardsPossible).toEqual([cardPossible1]);
            });

            it('should delete card possible when card is false', function () {
                party.cardPlayerFalse(party.players[0], cardPossible1.shift());
                expect(party.players[0].cardsPossible).toEqual([cardPossible1]);
            });

            it('should delete all card possible of round when card is true', function () {
                party.cardPlayerTrue(party.players[0], cardPossible1.shift());
                expect(party.players[0].cardsPossible).toEqual([]);
            });

            describe(' | add 2', function () {
                beforeEach(function () {
                    party.addCardsPossible(party.players[0], cardPossible2);
                });

                it('should add card possible (2)', function () {
                    expect(party.players[0].cardsPossible).toEqual([cardPossible1, cardPossible2]);
                });

                it('should delete card possible when card is false (2)', function () {
                    party.cardPlayerFalse(party.players[0], cardPossible1.shift());
                    expect(party.players[0].cardsPossible).toEqual([cardPossible1, cardPossible2]);
                });

                it('should delete all card possible of round when card is true (2)', function () {
                    party.cardPlayerTrue(party.players[0], cardPossible1.shift());
                    expect(party.players[0].cardsPossible).toEqual([cardPossible2]);
                });

                it('should delete card possible when card is false (3)', function () {
                    party.cardPlayerFalse(party.players[0], cardPossible1.shift());
                    party.cardPlayerTrue(party.players[0], cardPossible2.shift());
                    expect(party.players[0].cardsPossible).toEqual([cardPossible1]);
                });

                it('should delete all card possible when 2 card is false and other passed in true', function () {
                    party.cardPlayerFalse(party.players[0], cardPossible1.shift());
                    party.cardPlayerFalse(party.players[0], cardPossible1.shift());
                    var cardPlayer = $filter('filter')(party.players[0].cards, cardPossible1.shift()).shift();
                    var index = party.players[0].cards.indexOf(cardPlayer);
                    expect(party.players[0].cardsPossible).toEqual([cardPossible2]);
                    expect(party.players[0].cards[index].hand).toEqual(true);
                    party.players.forEach(function (player, i) {
                        if (i != 0) {
                            expect(player.cards[index].hand).toEqual(false);
                        }
                    });
                    expect(party.hypothesis[index].hand).toEqual(false);
                });
            });
        });
    });
});
