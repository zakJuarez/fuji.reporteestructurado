angular.module('login').controller('recuperarCredencialesController', ['$scope', '$location', '$mdDialog', 'loginServices',
    function ($scope, $location, $mdDialog, loginServices) {
        $scope.loading = false;
        $scope.usuario = {
            intUsuarioID: '',
            vchNombre: '',
            new_password: '',
            old_password: '',
            token: $location.search().token
        };
        function load() {
            $scope.loading = true;
            var request = {
                token: $scope.usuario.token
            };
            loginServices.PermitirModificarCredenciales(request, function (response) {
                $scope.loading = false;
                if (response.Success) {
                    $scope.usuario.intUsuarioID = response.intUsuarioID;
                    $scope.usuario.vchNombre = response.vchNombre;
                    $scope.usuario.old_password = response.old_password;
                }
                else {
                    var alert = $mdDialog.alert({
                        title: 'Mensaje del sistema',
                        textContent: response.Message,
                        ok: 'Aceptar'
                    });
                    $mdDialog.show(alert).then(function () {
                        if (!response.Success) {
                            $location.path('/login');
                        }
                    });
                }
            });
        }
        load();
        $scope.ModificarPassword = function (ev) {
            $scope.loading = true;
            var request = {
                intUsuarioID: $scope.usuario.intUsuarioID,
                old_password: $scope.usuario.old_password,
                new_password: $scope.usuario.new_password,
                token: $scope.usuario.token
            };
            loginServices.ModificarPassword(request, function (response) {
                $scope.loading = false;
                var alert = $mdDialog.alert({
                    title: 'Mensaje del sistema',
                    textContent: response.Message,
                    ok: 'Aceptar'
                });
                $mdDialog.show(alert).then(function () {
                    $location.search('token', null);
                    $location.path('/login');
                });
            });
        };
    }]);