(function(){
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
})();