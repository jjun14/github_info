(function(){
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
})();