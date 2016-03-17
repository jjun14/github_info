(function(){
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
})();
