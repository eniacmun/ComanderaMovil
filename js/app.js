
angular.module('starter', ['ionic', 'starter.Directives','starter.controllers','starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.logueo', {
      url: '/logueo',
      views: {
        'menuContent': {
          templateUrl: 'templates/logueo.html',
          controller: 'Logueo'
        }
      }
    })
	.state('app.mesas', {
      url: '/mesas/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/mesas.html?1500',
          controller: 'Mesas'
        }
      }
    })
	.state('app.submesas', {
      url: '/submesas/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/submesas.html?1500',
          controller: 'Submesas'
        }
      }
    })
	.state('app.llevar', {
      url: '/llevar/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/llevar.html?1500',
          controller: 'Llevar'
        }
      }
    })
	.state('app.comedor', {
      url: '/comedor',
      views: {
        'menuContent': {
          templateUrl: 'templates/comedor.html?1500',
          controller: 'Comedor'
        }
      }
    })
	.state('app.aperturanota', {
      url: '/aperturanota/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/aperturanota.html?1500',
          controller: 'Aperturanota'
        }
      }
    })
	.state('app.nota', {
      url: '/nota/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/nota.html?1500',
          controller: 'Nota'
        }
      }
    })
	.state('app.notac', {
      url: '/notac/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/notac.html?1500',
          controller: 'NotaC'
        }
      }
    })
  .state('app.delivery', {
      url: '/delivery/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/plataformas.html?1500',
          controller: 'Delivery'
        }
      }
    })
  .state('app.seleccionapp', {
      url: '/seleccionapp/:param',
      views: {
        'menuContent': {
          templateUrl: 'templates/seleccionapp.html?1500',
          controller: 'Delivery'
        }
      }
    })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/logueo');
});
