describe('InitCtrl', function () {
    var $scope, $controller;

    beforeEach(module('cluedoApp.init'));

    beforeEach(inject(function ($rootScope, _$controller_) {
        $scope = $rootScope.$new();
        $controller = _$controller_;
    }));

    describe('function call correctly', function () {
        var party;

        beforeEach(function () {
            party = jasmine.createSpyObj('party', ['init', 'setPlayers']);
            var controller = $controller('InitCtrl', {
                $scope: $scope,
                party: party
            });
        });

        it('should set save function', function () {
            expect($scope.save).toBeDefined();
        });

        it('should set finish function', function () {
            expect($scope.finish).toBeDefined();
        });

        it('should call party.init and party.setPlayers when call finish', function () {
            $scope.finish();
            expect(party.init).toHaveBeenCalled();
            expect(party.setPlayers).toHaveBeenCalled();
        });

        it('should set saveAndFinish function', function () {
            expect($scope.saveAndFinish).toBeDefined();
        });

        it('should call save and finish if call saveAndFinish function', function () {
            spyOn($scope, 'finish');
            spyOn($scope, 'save');
            $scope.saveAndFinish();

            expect($scope.save).toHaveBeenCalled();
            expect($scope.finish).toHaveBeenCalled();
        });
    });
});