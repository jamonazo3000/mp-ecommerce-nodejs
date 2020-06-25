var express = require('express');
const bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var exphbs = require('express-handlebars');

var mercadopago = require('mercadopago');
mercadopago.configure({
    sandbox: false,
    integrator_id:"dev_24c65fb163bf11ea96500242ac130004",
    access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948'
});

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    item = req.query;
    let preference = {
        items: [
            {
                id: 1234,
                title: item.title,
                description: 'Dispositivo móvil de Tienda e-commerce',
                picture_url: 'https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/'+item.img.substring(2,item.img.length),
                unit_price: parseFloat(item.price),
                quantity: 1,
            }
        ],
        payer: {
            name: "Lalo",
            surname: "Landa",
            email: "test_user_58295862@testuser.com",
            phone: {
                area_code: '52',
                number: 5549737300
            },
            address: {
                zip_code: '03940',
                street_name: "Insurgentes Sur",
                street_number: 1602
            }
        },
        payment_methods :{
            excluded_payment_methods :[
                {id:"amex"}
            ],
            excluded_payment_types :[
                {id:"atm"}
            ],
            installments: 6
        },
        back_urls: {
            "success": "https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/success",
            "failure": "https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/failure",
            "pending": "https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/pending"
        },
        notification_url: "https://nicolasgl-mp-ecommerce-nodejs.herokuapp.com/webhook",
        auto_return: "approved",
        external_reference: 'nico17.ngl@gmail.com'
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
            global.init_point = response.body.init_point;
            console.log(response.body);
            console.log('preference id: ' + response.body.id);

            req.query.init_point = response.body.init_point;
            res.render('detail', req.query);
        }).catch(function (error) {
            console.log(error);
        });
});

app.get('/success', function (req, res) {
    res.send(req.query);
});

app.get('/failure', function (req, res) {
    //console.log(req.query);
    res.send(req.query);
});

app.get('/pending', function (req, res) {
    //console.log(req.query);
    res.send(req.query);
});

/*app.post('/webhook', function (req, res) {
    console.log('webhook');
    console.log(req.query);
    res.sendStatus(200);
});*/

app.get('/webhook', (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port, function () {
    console.log('Example app listening on port !');
});