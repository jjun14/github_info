var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client")));

var pgp = require('pg-promise')({});
var cn = {
  host: 'localhost',
  port: 5432,
  database: "github_notetaker",
  user: "jimmysjun",
  password: "codingdojo15",
}
var db = pgp(cn);

app.get('/notes/:username', function(req, res){
  console.log('here');
  console.log(req.params);
  db.any("SELECT * FROM notes WHERE username=$1", req.params.username)
    .then(function(data){
      console.log("DATA", data);
      res.json(data);
    })
})

app.post('/notes', function(req, res){
  console.log("CREATING A NOTE!");
  db.one("INSERT INTO notes(username, content) values($1, $2) returning *", [req.body.username, req.body.content])
    .then(function(data){
      console.log('inserted note');
      console.log(data);
      res.json(data);
    })
})

app.listen(8000, function(){
  console.log("listening on port 8000");
})
