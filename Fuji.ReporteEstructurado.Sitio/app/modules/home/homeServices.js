angular.module('StructuredReport').factory('homeServices', ['$http',
    function ($http) {
        var service = {};
        service.EditarUsuario = function (data, callback) {
            $http.post(location.origin + '/api/usuarios/EditarUsuario',
                data, { headers: { 'Content-Type': 'application/json' } }).then(
                function (response) {
                    callback(response.data);
                }, function (response) {
                    response = {
                        Message: "Error al consumir el API: " + response.statusText + "(" + response.status + ")",
                        Success: false
                    }
                    callback(response);
                });
        };
        return service;
    }]);