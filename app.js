var express = require('express');
var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');

var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'TEST-3281958681696328-121705-82d4c2491f00b7d04a5fc70a64e53e0c-135489656'
});

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    let preference = {
        items: [
          {
            title: 'Mi producto',
            unit_price: 100,
            quantity: 1,
          }
        ]
      };
      
      mercadopago.preferences.create(preference)
      .then(function(response){
        global.init_point = response.body.init_point;
      }).catch(function(error){
        console.log(error);
      });
        res.render('detail', req.query);
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port, function () {
    console.log('Example app listening on port !');
});