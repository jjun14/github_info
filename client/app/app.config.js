(function(){
  angular
    .module('github-notetaker')
    .config(function($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise("");

      $stateProvider
        .state('index', {
          url: "",
          templateUrl: "app/search/search.html",
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
                templateUrl: "app/profile/profile.html",
                controller: "profileController"
              },
              "repos": {
                templateUrl: "app/repos/repos.html",
                controller: "reposController"
              },
              "notes": {
                templateUrl: "app/notes/notes.html",
                controller: 'notesController'
              }
            }
          })
          .state('index.user.addnote', {
            url: '/addnote',
            templateUrl: "app/notes/addnotes.html",
            contoller: 'notesConroller'
          })
    })
})();