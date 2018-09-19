angular.module('StructuredReport').controller('homeController', ['$scope', '$rootScope', '$mdDialog', '$location', 'homeServices',
    function ($scope, $rootScope, $mdDialog, $location, homeServices) {
        $scope.loading = false;
        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };
        $scope.EditarUsuario = function (ev) {
            $mdDialog.show({
                controller: 'editarUsuarioController',
                templateUrl: 'app/modules/home/user/update/editarUsuarioView.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                fullscreen: true,
                skipHide: true
            }).then(function (response) {
                var alert = $mdDialog.alert({
                    title: 'Mensaje del sistema',
                    textContent: response.Message,
                    ok: 'Aceptar',
                    skipHide: true
                });
                $mdDialog.show(alert);
            });
        };
        $scope.AdministrarUsuarios = function (ev) {
            $location.path('/usuarios');
        };
        $scope.AdministrarJornadas = function (ev) {
            $location.path('/jornadas');
        };
        $scope.AdministrarOrdenesPago = function (ev) {
            $location.path('/ordenescompra');
        };
        $scope.AdministrarSitios = function (ev) {
            $location.path('/sitios')
        };
    }]);