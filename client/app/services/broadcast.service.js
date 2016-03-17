(function(){
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
})();