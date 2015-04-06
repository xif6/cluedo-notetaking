'use strict';


angular.module('cluedoApp.party', ['cluedoApp.Player', 'cluedoApp.Cards'])
    .factory('party',
    ['$filter', '$location', 'Player', 'Cards',
        function ($filter, $location, Player, Cards) {
            var isPlayersSet = false;

            var scope = {};

            scope.limitToOthers = 0;
            scope.hypothesis = new Cards().getCardsPlayers();
            scope.nonPlayer = new Player();
            scope.nonPlayer.name = '-- NPC --';
            scope.nbCardsTotal = scope.hypothesis.length;
            scope.nbCardsAvailable = scope.hypothesis.length - 3;
            scope.players = [];
            scope.nbCardsByPlayer = 0;
            scope.nbCardsNonPlayer = 0;
            scope.currentPlayer = '';

            scope.setPlayers = function (players) {
                if (players.length >= 2) {
                    scope.players = players;
                    scope.nbCardsByPlayer = Math.floor(scope.nbCardsAvailable / scope.players.length);
                    scope.nbCardsNonPlayer = scope.nbCardsAvailable % scope.players.length;

                    scope.players.forEach(function (player) {
                        player.nbCardsExpected = scope.nbCardsByPlayer;
                    });
                    scope.nonPlayer.nbCardsExpected = scope.nbCardsNonPlayer;

                    var me = $filter('filter')(scope.players, {me: true}).shift();
                    if (me) {
                        $filter('filter')(me.cards, {hand: true}).forEach(function (card) {
                            scope.cardPlayerTrue(me, card, true);
                        });
                    }
                    isPlayersSet = true;
                    scope.limitToOthers = 0 - (scope.players.length - 1);
                }
            };

            scope.setNonPlayerCards = function (nonPlayerCards) {
                scope.nonPlayer.cards = nonPlayerCards;
                $filter('filter')(scope.nonPlayer.cards, {hand: true}).forEach(function (card) {
                    scope.cardPlayerTrue(scope.nonPlayer, card, true);
                });
            };

            scope.init = function () {
                if (!isPlayersSet) {
                    $location.path('/init');
                } else if (scope.nonPlayer.nbCardsExpected != scope.nonPlayer.nbCardsKnown) {
                    $location.path('/init-non-player');
                } else if (scope.currentPlayer == '') {
                    $location.path('/init-player-order');
                } else {
                    $location.path('/game');
                }
            };

            scope.playerHypothesis = function (playerShowCard, round, roundShow) {
                var currentPlayer = scope.players[0];
                var otherPlayers = $filter('limitTo')(scope.players, scope.limitToOthers);
                otherPlayers.every(function (player) {
                    if (player.name != playerShowCard) {
                        round.forEach(function (card) {
                            scope.cardPlayerFalse(player, card);
                        });
                        return true;
                    } else {
                        if (!player.locked) {
                            if (roundShow && roundShow.name != '') {
                                scope.cardPlayerTrue(player, roundShow);
                            } else {
                                scope.addCardsPossible(player, round);
                            }
                        }
                        return false;
                    }
                });
                // next player
                scope.players.push(scope.players.shift());
            };

            scope.cardPlayerFalse = function (player, card) {
                card = cleanCard(card);
                var playerCard = $filter('filter')(player.cards, card).shift();
                if (playerCard.hand === false) {
                    return;
                }
                playerCard.hand = false;
                cardPossiblePlayerFalse(player, card);
                var cardHandFalse = angular.copy(card);
                cardHandFalse.hand = false;
                var playersAll = scope.players.concat(scope.nonPlayer);
                if ($filter('filter')(playersAll, {cards: cardHandFalse}).length == playersAll.length) {
                    cardHypothesisTrue(card);
                }

                var nbCardsKnownFalse = $filter('filter')(player.cards, {hand: false}).length;
                if (scope.nbCardsTotal == nbCardsKnownFalse + player.nbCardsExpected) {
                    $filter('filter')(player.cards, {hand: null}).forEach(function (card) {
                        scope.cardPlayerTrue(player, card);
                    });
                }
            };

            scope.cardPlayerTrue = function (player, card, force) {
                card = cleanCard(card);
                var playerCard = $filter('filter')(player.cards, card).shift();
                if (force !== true && playerCard.hand === true) {
                    return;
                }
                playerCard.hand = true;
                player.nbCardsKnown = $filter('filter')(player.cards, {hand: true}).length;
                player.locked = (player.nbCardsExpected == player.nbCardsKnown);
                cardPossiblePlayerTrue(player, card);

                if (player.locked) {
                    $filter('filter')(player.cards, {hand: null}).forEach(function (card) {
                        scope.cardPlayerFalse(player, card);
                    });
                } else {
                    lastCardFind(player);
                }

                cardPlayersFalse(player, card);
                cardHypothesisFalse(card);
            };

            scope.addCardsPossible = function (player, cards) {
                var handTrue = [];
                var handFalse = [];
                var handNull = [];
                cards.forEach(function (card) {
                    var cardHand = $filter('filter')(player.cards, card).shift();
                    if (cardHand.hand === null) {
                        handNull.push(card);
                    } else if (cardHand.hand === true) {
                        handTrue.push(card);
                    } else if (cardHand.hand === false) {
                        handFalse.push(card);
                    }
                });

                if (handTrue.length != 0) {
                    // nothing
                } else if (handFalse.length == 2) {
                    scope.cardPlayerTrue(player, handNull.shift());
                } else {
                    player.cardsPossible.push(handNull);
                    lastCardFind(player);
                }
            };

            var lastCardFind = function (player) {
                if (player.nbCardsExpected == (player.nbCardsKnown + 1)) {
                    if (player.cardsPossible.length > 1) {
                        var cardsByType = {suspects: [], weapons: [], rooms: []};
                        player.cardsPossible.forEach(function (cards) {
                            cards.forEach(function (card) {
                                cardsByType[card.type].push(card.name);
                            });
                        });
                        var nameCardTrue = null;
                        for (var type in cardsByType) {
                            var cards = _.uniq(cardsByType[type]);
                            if (cards.length == 1 && nameCardTrue == null) {
                                nameCardTrue = {type: type, name: cards.splice()};
                            } else {
                                nameCardTrue = null;
                            }
                        }
                        if (nameCardTrue != null) {
                            scope.cardPlayerTrue(player, nameCardTrue);
                        }
                    }
                }
            };

            var cardPossiblePlayerFalse = function (player, card) {
                player.cardsPossible.forEach(function (cardsPossible, i) {
                    var cardPossible = $filter('filter')(cardsPossible, card).shift();
                    var indexCards = cardsPossible.indexOf(cardPossible);
                    if (indexCards >= 0) {
                        cardsPossible.splice(indexCards, 1);
                    }
                    if (cardsPossible.length == 1) {
                        scope.cardPlayerTrue(player, cardsPossible.shift());
                        player.cardsPossible.splice(i, 1);
                    }
                });
            };

            var cardPossiblePlayerTrue = function (player, card) {
                $filter('filter')(player.cardsPossible, card).forEach(function (cards) {
                    var indexCardsPossible = player.cardsPossible.indexOf(cards);
                    if (indexCardsPossible >= 0) {
                        player.cardsPossible.splice(indexCardsPossible, 1);
                    }
                });
            };

            var cardPlayersFalse = function (player, card) {
                var players = [];
                if (angular.isDefined(player.name)) {
                    players = $filter('filter')(scope.players, {name: '!' + player.name});
                } else {
                    players = scope.players;
                }
                players.forEach(function (player) {
                    scope.cardPlayerFalse(player, card);
                });
            };

            var cardHypothesisFalse = function (card) {
                card = cleanCard(card);
                var hypothesisCard = $filter('filter')(scope.hypothesis, card).shift();
                if (hypothesisCard.hand === false) {
                    return;
                }
                hypothesisCard.hand = false;
                var cardsByType = $filter('filter')(scope.hypothesis, {type: card.type});
                var cardsByTypeFalse = $filter('filter')(scope.hypothesis, {type: card.type, hand: false});
                if (cardsByType.length == (cardsByTypeFalse.length + 1)) {
                    var cardTrue = _.difference(cardsByType, cardsByTypeFalse).shift();
                    cardHypothesisTrue(cardTrue);
                }
            };

            var cardHypothesisTrue = function (card) {
                card = cleanCard(card);
                console.log(card);
                var hypothesisCard = $filter('filter')(scope.hypothesis, card).shift();
                if (hypothesisCard.hand === true) {
                    return;
                }
                console.log(card);
                hypothesisCard.hand = true;
                $filter('filter')(scope.hypothesis, {type: card.type, hand: null}).forEach(function (card) {
                    cardHypothesisFalse(card);
                });
                cardPlayersFalse({}, card);
            };

            var cleanCard = function (card) {
                var cardTmp = angular.copy(card);
                delete cardTmp.hand;
                return cardTmp;
            };

            return scope;
        }]);