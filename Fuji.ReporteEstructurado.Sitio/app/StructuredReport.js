angular.module('login', ['ngMaterial', 'ngMessages']);
angular.module('StructuredReport', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngCookies', 'ngSanitize', 'ui.bootstrap', 'ngIdle', 'login', 'ui.bootstrap'])
    .config(function ($mdThemingProvider) {
        var zaKTheme = $mdThemingProvider.extendPalette('blue', {
            //Poner el tema de la empresa
        });
        $mdThemingProvider.definePalette('zaKTheme', zaKTheme);
        $mdThemingProvider.theme('default')
            .backgroundPalette('grey', {
                'default': '200'
            })
            .primaryPalette('teal');
    })
    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
        $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
        $mdDateLocaleProvider.firstDayOfWeek = 1;
        $mdDateLocaleProvider.weekNumberFormatter = function (weekNumber) {
            return 'Semana ' + weekNumber;
        };
        $mdDateLocaleProvider.msgCalendar = 'Calendario';
        $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
        $mdDateLocaleProvider.formatDate = function (date) {
            var m = moment(date);
            return m.isValid() ? m.format('DD/MM/YYYY') : '';
        };
        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/modules/login/loginView.html',
                controller: 'loginController'
            })
            .when('/login/enviar-credenciales', {
                templateUrl: 'app/modules/login/credenciales/enviarCredencialesView.html',
                controller: 'enviarCredencialesController'
            })
            .when('/login/recuperar-credenciales', {
                templateUrl: 'app/modules/login/credenciales/recuperarCredencialesView.html',
                controller: 'recuperarCredencialesController'
            })
            .when('/', {
                templateUrl: 'app/modules/home/homeView.html',
                controller: 'homeController'
            })
            .when('/usuarios', {
                templateUrl: 'app/modules/home/admin/users/usuariosView.html',
                controller: 'usuariosController'
            })
            .when('/series', {
                templateUrl: 'app/modules/series/seriesView.html',
                controller: 'seriesController'
            })
            .when('/sitios', {
                templateUrl: 'app/modules/home/admin/sites/sitiosView.html',
                controller: 'sitiosController'
            })
            .when('/ordenescompra', {
                templateUrl: 'app/modules/home/admin/ordenescompra/ordenescompraView.html',
                controller: 'ordenescompraController'
            })
            .when('/jornadas', {
                templateUrl: 'app/modules/home/admin/jornadas/jornadasView.html',
                controller: 'jornadasController'
            })
            .when('/partidos', {
                templateUrl: 'app/modules/partidos/partidosView.html',
                controller: 'partidosController'
            })
            .when('/catalogos', {
                templateUrl: 'app/modules/catalogos/catalogoView.html',
                controller: 'catalogoController'
            })
            .when('/quinielas', {
                templateUrl: 'app/modules/quinielas/quinielasView.html',
                controller: 'quinielasController'
            })
            .when('/estadisticas', {
                templateUrl: 'app/modules/estadisticas/estadisticasView.html',
                controller: 'estadisticasController'
            })
            .when('/clasificacion', {
                templateUrl: 'app/modules/clasificacion/clasificacionView.html',
                controller: 'clasificacionController'
            })
            .when('/clasificacionfinal', {
                templateUrl: 'app/modules/clasificacionfinal/clasificacionfinalView.html',
                controller: 'clasificacionFinalController'
            })
            .when('/catalogos/view', {
                templateUrl: 'app/modules/catalogos/view/viewCatalogoView.html',
                controller: 'viewCatalogoController'
            })
    }])
    .config(function (IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(299); // 5 min
        IdleProvider.timeout(1);
    })
    .run(['$rootScope', '$location', '$cookieStore', '$http', '$mdDialog', '$templateCache', 'Idle',
        function ($rootScope, $location, $cookieStore, $http, $mdDialog, $templateCache, Idle) {
            $rootScope.$on('IdleTimeout', function () {
                var alert = $mdDialog.alert({
                    title: 'Advertencia',
                    textContent: 'se ha terminado su sesión',
                    ok: 'Aceptar'
                });
                $mdDialog.show(alert).then(function () {
                    //$location.path('/login');
                });
                $location.path('/login');
            });
            $rootScope.logeado = false;
            $rootScope.Globals = $cookieStore.get('Globals') || {};
            if ($rootScope.Globals.CurrentUser) {
                $rootScope.logeado = true;
            }
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                /*
                    Generar método para control de accesos
                */
                var location = $location.path();
                switch (location) {
                    case '/login':
                        Idle.unwatch();
                        $location.path('/login');
                        break;
                    case '/login/enviar-credenciales':
                        $location.path('/login/enviar-credenciales');
                        break;
                    case '/login/recuperar-credenciales':
                        var token = $location.search().token;
                        if (token)
                            $location.path('/login/recuperar-credenciales');
                        else
                            $location.path('/login');
                        break;
                    case '/usuarios':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/usuarios');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/series':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser) {
                            $location.path('/series');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/sitios':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/sitios');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/ordenescompra':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1 || $rootScope.Globals.CurrentUser.intTipoUsuarioID === 2) {
                            $location.path('/ordenescompra');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/jornadas':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/jornadas');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/partidos':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/partidos');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/catalogos':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/catalogos');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/quinielas':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser) {
                            $location.path('/quinielas');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/estadisticas':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser) {
                            $location.path('/estadisticas');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/clasificacion':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser) {
                            $location.path('/clasificacion');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/clasificacionfinal':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser) {
                            $location.path('/clasificacionfinal');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    case '/catalogos/view':
                        Idle.watch();
                        if ($rootScope.Globals.CurrentUser.intTipoUsuarioID === 1) {
                            $location.path('/catalogos/view');
                        }
                        else {
                            $location.path('/');
                        }
                        break;
                    default:
                        //if ($rootScope.Globals.CurrentUser) {
                            Idle.watch(); // Inicie el contador para que se cierre sesión
                            $location.path('/');
                        //}
                        //else
                            //$location.path('/login');
                        break;
                }
            })
        }]);