angular.module('login').controller('loginController', ['$scope', '$rootScope', '$mdDialog', '$cookieStore', '$location', 'loginServices',
    function ($scope, $rootScope, $mdDialog, $cookieStore, $location, loginServices) {
        $scope.loading = false;
        var clearGlobals = function () {
            $rootScope.Globals = {};
            $cookieStore.remove('Globals');
            $scope.loading = false;
            $rootScope.logeado = false;
        };
        var setGlobals = function (data) {
            $rootScope.Globals = {
                CurrentUser: data
            };
            $cookieStore.put('Globals', $rootScope.Globals);
        };
        clearGlobals();
        $scope.Ingresar = function (data, event) {
            $scope.loading = true;
            loginServices.Ingresar(data, function (response) {
                $scope.loading = false;
                if (response.Success) {
                    setGlobals(response.CurrentUser);
                    $rootScope.logeado = true;
                    $location.path('/');
                }
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .clickOutsideToClose(false)
                            .title('Mensaje del sistema')
                            .textContent(response.Message)
                            .ariaLabel('mensaje de login')
                            .ok('Aceptar')
                            .targetEvent(event)
                    );
                }
                $scope.loading = false;
            });
        };
        $scope.RecuperarCredenciales = function (ev) {
            $location.path('/login/enviar-credenciales');
        };
    }]);