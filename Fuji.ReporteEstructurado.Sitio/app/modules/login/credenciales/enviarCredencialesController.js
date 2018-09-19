angular.module('login').controller('enviarCredencialesController', ['$scope', '$mdDialog', '$location', 'loginServices',
    function ($scope, $mdDialog, $location, loginServices) {
        $scope.loading = false;
        $scope.EnviarCredenciales = function (request, ev) {
            $scope.loading = true;
            loginServices.EnviarCredenciales(request, function (response) {
                $scope.loading = false;
                var alert = $mdDialog.alert({
                    title: 'Mensaje del sistema',
                    textContent: response.Message,
                    ok: 'Aceptar'
                });
                $mdDialog.show(alert).then(function () {
                    if (response.Success) {
                        $location.path('/login');
                    }
                });
            });
        }
    }]);