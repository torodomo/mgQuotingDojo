var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    port = 8000,
    app = express();

// Set up body-parser to parse form data
app.use(bodyParser.urlencoded({extended: true}));

// Set up database connection, Schema, model
mongoose.connect('mongodb://localhost/quoting_dojo');

var QuoteSchema = new mongoose.Schema({
    name: String,
    quote: String,
    }, {timestamps: true});

var Quote = mongoose.model('quotes', QuoteSchema);

// Point server to views
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, "./public")));
// We're using ejs as our view engine
app.set('view engine', 'ejs');

// Here are our routes!
app.get('/', function(req, res){
    res.render('index');
});

app.get('/quotes', function(req, res){
// Logic to grab all quotes and pass into the rendered view
    Quote.find({}, function(err, results){
        if(err) { 
            console.log(err); 
        } else {
            console.log(results);
        res.render('quotes', { quotes: results});
        }
    });
});

app.post('/quotes', function(req, res){
    Quote.create(req.body, function(err){
        if(err) { 
            console.log(err); 
        } else {
            res.redirect('/quotes');
        }
    });
});
// END OF ROUTING...

var server = app.listen(port, function() {
    console.log("listening on port: ", port);
});

