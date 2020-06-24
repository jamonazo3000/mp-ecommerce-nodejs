var express = require('express');
var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');

var mercadopago = require('mercadopago');
mercadopago.configure({
    sandbox: false,
    integrator_id:"dev_24c65fb163bf11ea96500242ac130004",
    access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948'
});

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    item = req.query;
    console.log(item);
    let preference = {
        items: [
            {
                id: 1234,
                title: item.title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: 'https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/'+item.img,
                unit_price: parseInt(item.price),
                quantity: 1,
            }
        ],
        external_reference: 'nico17.ngl@gmail.com',
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            
            global.init_point = response.body.init_point;
            console.log('init point: ' + global.init_point);
            console.log('preference id: ' + response.body.id);
            req.query.init_point = response.body.init_point;
            res.render('detail', req.query);

        }).catch(function (error) {
            console.log(error);
        });
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port, function () {
    console.log('Example app listening on port !');
});