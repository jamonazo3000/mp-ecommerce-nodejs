var express = require('express');
var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');

var mercadopago = require('mercadopago');
mercadopago.configure({
    sandbox: false,
    integrator_id:"dev_24c65fb163bf11ea96500242ac130004",
    access_token: 'APP_USR-6718728269189792-112017-dc8b338195215145a4ec035fdde5cedf-491494389'
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
                picture_url: item.img,
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
            console.log('collector id: ' + response.body.collector_id);
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