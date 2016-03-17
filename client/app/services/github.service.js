(function(){
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
})();