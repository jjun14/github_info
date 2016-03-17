(function(){
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