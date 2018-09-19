angular.module('login').factory('loginServices', ['$http',
    function ($http) {
        var service = {};
        service.Ingresar = function (data, callback) {
            $http.post(location.origin + '/api/usuarios/Login',
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
        service.EnviarCredenciales = function (data, callback) {
            $http.post(location.origin + '/api/usuarios/EnviarCredenciales',
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
        service.PermitirModificarCredenciales = function (data, callback) {
            $http.post(location.origin + '/api/usuarios/PermitirModificarCredenciales',
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
        service.ModificarPassword = function (data, callback) {
            $http.post(location.origin + '/api/usuarios/ModificarPassword',
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