var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var pgp = require('pg-promise')({});
var cn = {
  host: 'localhost',
  port: 5432,
  database: "github_notetaker",
  user: "jimmysjun",
  password: "codingdojo15",
}
var db = pgp(cn);

app.use(express.static(path.join(__dirname, "../client")));

app.get('/notes/:username', function(req, res){
  console.log(req.params);
  db.any("SELECT * FROM notes WHERE username=$1", req.params.username)
    .then(function(data){
      console.log("DATA", data);
      res.json(data);
    })
})

app.listen(8000, function(){
  console.log("listening on port 8000");
})
