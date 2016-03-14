(function(){
  'use strict';

  angular
    .module('github-notetaker', [
    'ui.router',
    'ui.bootstrap'
  ]);

  angular
    .module('github-notetaker')
    .config(function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise("/index");

      $stateProvider
        .state('index', {
          url: "/index",
          templateUrl: "partials/home.html",
          controller: "searchController as search"
        })
          .state('index.user', {
            url:'/user/:username',
            views: {
              "profile": {
                templateUrl: "partials/index.user.profile.html"
              },
              "repos": {
                templateUrl: "partials/index.user.repos.html"
              },
              "notes": {
                templateUrl: "partials/index.user.notes.html"
              }
            }
          })
    })
  // github factory
  angular
    .module('github-notetaker')
    .factory('githubFactory', githubFactory);

  githubFactory.$inject = ['$http']

  function githubFactory($http){
    var userInfo = {};
    var userRepos = {};
    var factory = {
      getUserInfo:  getUserInfo,
      getUserRepos: getUserRepos
    }

    return factory;

    function getUserInfo(username){
      console.log('retrieving info in the factory');
      var client_id = 'cc7a572cd3b2246c3270';
      var client_secret = '03577191232b7c4d755d63c3d0d652ac46616c37'
      // request to grab user profile
      return $http.get("https://api.github.com/users/"+username+"?client_id=+"+client_id+"&client_secret="+client_secret)
    }

    function getUserRepos(username){
      console.log('here');
      var client_id = 'cc7a572cd3b2246c3270';
      var client_secret = '03577191232b7c4d755d63c3d0d652ac46616c37'
      return $http.get("https://api.github.com/users/"+username+"/repos?client_id=+"+client_id+"&client_secret="+client_secret)
    }
  }

  // search controller
  angular
    .module('github-notetaker')
    .controller('searchController', searchController);

  searchController.$inject = ['githubFactory', '$q'];

  function searchController(githubFactory, $q){
    var vm = this;
    vm.getUserInfo = function(user){
      var userInfoPromise = githubFactory.getUserInfo(user.username);
      var reposPromise = githubFactory.getUserRepos(user.username);
      $q.all([userInfoPromise, reposPromise]).then(function(data){
        vm.userInfo = data[0];
        vm.userRepos = data[1];
      });
    }
  }
  
  // profile controller
  angular
    .module('github-notetaker')
    .controller('profileController', profileController);

  profileController.$inject = ['$stateParams'];

  function profileController($stateParams){

  }

})();
