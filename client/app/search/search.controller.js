(function(){
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
})();