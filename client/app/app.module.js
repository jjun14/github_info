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
                templateUrl: "partials/user.repos.html",
                controller: "reposController as repos"
              },
              "notes": {
                templateUrl: "partials/user.notes.html",
                controller: 'notesController as notes'
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
      console.log(username);
      var userProfilePromise = requestProfile(username);
      var userReposPromise = requestRepos(username);
      $q.all([userProfilePromise, userReposPromise]).then(function(data){
        userProfile = data[0].data;
        userRepos = data[1].data;
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
    var search = this;

    search.getUserInfo = function(user){
      console.log(user);
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
    var profile = this;

    init();

    function init(){
      githubFactory.getUserProfile(function(data){
        profile.userProfile = data;
        console.log(profile.userProfile);
      });
    }
  }

  // repos controller
  angular
    .module('github-notetaker')
    .controller('reposController', reposController);

  reposController.$inject = ['githubFactory'];

  function reposController(githubFactory){
    var repos = this;

    init();

    function init(){
      githubFactory.getUserRepos(function(data){
        repos.userRepos = data;
        console.log(repos.userRepos);
      })
    }
  }

  // notes factory
  angular
    .module('github-notetaker')
    .factory('notesFactory', notesFactory);

  notesFactory.$inject = ['$http'];

  function notesFactory($http){
    var notes = [];
    var factory = {
      getNotesForUser: getNotesForUser
    }

    return factory;

    function getNotesForUser(username, callback){
      $http.get('/notes/'+username).success(function(data){
        notes = data;
        callback(notes);
      });
    }
  }

  // notes controller
  angular
    .module('github-notetaker')
    .controller('notesController', notesController);

  notesController.$inject = ['notesFactory', '$state']

  function notesController(notesFactory, $state){
    console.log($state.params);
    var notes = this;

    init();

    function init(){
      notesFactory.getNotesForUser($state.params.username, function(data){
        notes.userNotes = data;
        console.log(notes.userNotes);
      })
    }
  }
})();
