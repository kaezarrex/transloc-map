var express = require("express"),
    stylus = require('stylus') ,
    nib = require('nib'),
    logfmt = require("logfmt"),
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

var port = Number(process.env.PORT || 5000);

app.listen(port, function() {
    console.log("Listening on " + port);
});
