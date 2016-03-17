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
          controller: "searchController"
        })
          .state('index.user', {
            url:'/user/:username',
            resolve: {
              userProfile: function(githubFactory,$stateParams){
                console.log('resolving');
                return githubFactory.requestProfile($stateParams.username);
              },
              userRepos: function(githubFactory, $stateParams){
                console.log('resolving second');
                return githubFactory.requestRepos($stateParams.username);
              },
              userNotes: function(notesFactory, $stateParams){
                console.log('resolving third');
                return notesFactory.requestNotes($stateParams.username);
              }
            },
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
          .state('index.user.addnote', {
            url: '/addnote',
            templateUrl: "partials/user.notes.addnotes.html",
            contoller: 'notesConroller as notes'
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
      requestProfile: requestProfile,
      requestRepos: requestRepos,
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

  searchController.$inject = ['$scope', 'githubFactory', '$state'];

  function searchController($scope, githubFactory, $state){

    $scope.getUserInfo = function(user){
      console.log(user);
      if(user){
        githubFactory.requestUserInfo(user.username, function(){
          $state.go('index.user', {username: user.username}, {reload: true});
        });
      }
    }
  }
  
  // profile controller
  angular
    .module('github-notetaker')
    .controller('profileController', profileController);

  profileController.$inject = ['$scope', 'githubFactory', 'userProfile'];

  function profileController($scope, githubFactory, userProfile){
    $scope.userProfile = userProfile.data;

    //init(); 
    //function init(){
    //  githubFactory.getUserProfile(function(data){
    //    profile.userProfile = data;
    //    console.log(profile.userProfile);
    //  });
    //}
  }

  // repos controller
  angular
    .module('github-notetaker')
    .controller('reposController', reposController);

  reposController.$inject = ['$scope', 'githubFactory', '$state', 'userRepos'];

  function reposController($scope, githubFactory, $state, userRepos){
   // console.log($state.params);
    $scope.userRepos = userRepos.data;

    //init();

    //function init(){
    //  githubFactory.getUserRepos(function(data){
    //    repos.userRepos = data;
    //    console.log(repos.userRepos);
    //  })
    //}
  }

  // broadcast service
  angular
    .module('github-notetaker')
    .factory('broadcastService', broadcastService)

  broadcastService.$inject = ['$rootScope']

  function broadcastService($rootScope){
    var factory = {
      send: send
    }

    return factory;

    function send(msg, data){
      $rootScope.$broadcast(msg, data);
    }
  }

  // notes factory
  angular
    .module('github-notetaker')
    .factory('notesFactory', notesFactory);

  notesFactory.$inject = ['$http', 'broadcastService'];

  function notesFactory($http, broadcastService){
    var notes = [];
    var factory = {
      requestNotes: requestNotes,
      addNote: addNote
    }

    return factory;

    function requestNotes(username){
      return $http.get('/notes/'+username)
      //$http.get('/notes/'+username).success(function(data){
      //  notes = data;
      //  callback(notes);
      //});
    }

    function addNote(data, callback){
      console.log('here');
      $http.post('/notes', data).success(function(res){
        console.log('added new note and broadcasting');
        broadcastService.send('newNote', res);
        callback();
      })
    }
  }

  // notes controller
  angular
    .module('github-notetaker')
    .controller('notesController', notesController);

  notesController.$inject = ['$scope', 'notesFactory', '$state', 'userNotes']

  function notesController($scope, notesFactory, $state, userNotes){
    $scope.form = {};
    $scope.userNotes = userNotes.data;

    $scope.$on('newNote', function(event, args){
      console.log('got the broadcast!');
      $scope.userNotes.push(args);
    })

    $scope.addNote = function(newNote){
      console.log("adding note!");
      newNote.username = $state.params.username;
      notesFactory.addNote(newNote, function(){
        console.log('finished adding note!');
      });
    }
    //init();

    //function init(){
    //  notesFactory.getNotesForUser($state.params.username, function(data){
    //    notes.userNotes = data;
    //    console.log(notes.userNotes);
    //  })
    //}
  }
})();
