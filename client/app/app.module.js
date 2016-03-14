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
      $urlRouterProvider.otherwise("");

      $stateProvider
        .state('index', {
          url: "",
          templateUrl: "partials/home.html",
          controller: "searchController as search"
        })
          .state('index.user', {
            url:'/user/:username',
            views: {
              "profile": {
                templateUrl: "partials/user.profile.html",
                controller: "profileController as profile"
              },
              "repos": {
                templateUrl: "partials/user.repos.html"
              },
              "notes": {
                templateUrl: "partials/user.notes.html"
              }
            }
          })
    })
  // github factory
  angular
    .module('github-notetaker')
    .factory('githubFactory', githubFactory);

  githubFactory.$inject = ['$http', '$q'];

  function githubFactory($http, $q){
    var userProfile = {};
    var userRepos = {};
    var factory = {
      requestUserInfo:  requestUserInfo,
      getUserProfile: getUserProfile,
      getUserRepos: getUserRepos
    }

    return factory;

    function requestProfile(username){
      var client_id = 'cc7a572cd3b2246c3270';
      var client_secret = '03577191232b7c4d755d63c3d0d652ac46616c37'
      // request to grab user profile
      return $http.get("https://api.github.com/users/"+username+"?client_id="+client_id+"&client_secret="+client_secret)
    }

    function requestRepos(username){
      var client_id = 'cc7a572cd3b2246c3270';
      var client_secret = '03577191232b7c4d755d63c3d0d652ac46616c37'
      return $http.get("https://api.github.com/users/"+username+"/repos?client_id="+client_id+"&client_secret="+client_secret)
    }

    function requestUserInfo(username, callback){
      console.log('in the factory setting data');
      var userProfilePromise = requestProfile(username);
      var userReposPromise = requestRepos(username);
      $q.all([userProfilePromise, userReposPromise]).then(function(data){
        userProfile = data[0];
        userRepos = data[1];
        callback();
      });
    }

    function getUserProfile(callback){
      callback(userProfile);
    }

    function getUserRepos(callback){
      callback(userRepos);
    }
  }

  // search controller
  angular
    .module('github-notetaker')
    .controller('searchController', searchController);

  searchController.$inject = ['githubFactory', '$q', '$state'];

  function searchController(githubFactory, $q, $state){
    var vm = this;
    vm.getUserInfo = function(user){
      githubFactory.requestUserInfo(user.username, function(){
        $state.go('index.user', {username: user.username}, {reload: true});
      });
    }
  }
  
  // profile controller
  angular
    .module('github-notetaker')
    .controller('profileController', profileController);

  profileController.$inject = ['githubFactory'];

  function profileController(githubFactory){
    var vm = this;

    init();

    function init(){
      githubFactory.getUserProfile(function(data){
        console.log(data);
        vm.profile = data;
      });
    }
  }

})();
