var express = require("express"),
    stylus = require('stylus') ,
    nib = require('nib'),
    logfmt = require("logfmt"),
    https = require('https'),
    url = require('url'),
    app = express();

var app = express();

function compile(str, path) {
    return stylus(str).set('filename', path).use(nib())
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(stylus.middleware({
    src: __dirname + '/public' ,
    compile: compile
} ));
app.use(express.static(__dirname + '/public'));
app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
    res.render('index', { title : 'Home' } );
});

function mashape(path, success, error) {

    var options = {
      hostname: 'transloc-api-1-2.p.mashape.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
          'X-Mashape-Authorization': process.env.MASHAPE_KEY
      }
    };

    var req = https.request(options, function(res) {
      var body = '';

      res.on('data', function(d) {
          body += d.toString();
      });
      res.on('end', function() {
          success(body);
      });
    });


    req.on('error', function(e) {
        error(e);
    });

    req.end();
}

app.get('/api/:entity', function (req, res) {

    var path = url.format({
        pathname: '/' + req.param('entity'),
        query: req.query
    });

    res.set('Content-Type', 'application/json');

    mashape(path, function(data) {
      res.send(data);
    }, function(e) {
      console.log(e);
      res.json(500, { error: e })
    });
});

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
    console.log("Listening on " + port);
});
