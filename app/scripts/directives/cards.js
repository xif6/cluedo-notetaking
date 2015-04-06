'use strict';

angular.module('cluedoApp.cardsDirective', [])
    .directive('cards', function () {
        return {
            restrict: 'E',
            scope: {
                cards: '=',
                viewData: '=',
                typeView: '@'
            },
            templateUrl: 'views/partials/cards.html'
        };
    })
    .directive('cardsType', ['$filter', function ($filter) {
        return {
            restrict: 'E',
            scope: {
                cards: '=',
                filter: '=',
                orderBy: '@',
                viewData: '=',
                typeView: '='
            },
            templateUrl: 'views/partials/cards-type.html',
            link: function (scope, element, attrs) {
                scope.viewData = scope.viewData || {};
                if (angular.isArray(scope.viewData.model)) {
                    scope.model = $filter('filter')(scope.viewData.model, {type: attrs.type}).shift();
                }
            }
        };
    }])
;