var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
//-------------------------------------------
var http = require('http');
var multer = require('multer');
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public')
        // cb(null, 'public/app/vdo')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        console.log("File : " + file.fieldname);
        cb(null, file.originalname)
        // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ storage: storage })
app.use(express.static(path.join(__dirname, 'public')));
app.post('/savedata', upload.single('file'), function (req, res, next) {
    console.log('Upload Successful ', req.file, req.body);
    res.setHeader('Content-Type', 'text/plain');
    res.write('OK');
    res.end();

});
// var storage = multer.diskStorage({ //multers disk storage settings
//     destination: function (req, file, cb) {
//         cb(null, 'public/app/vdo')
//     },
//     filename: function (req, file, cb) {
//         var datetimestamp = Date.now();
//         console.log("File : " + file.fieldname);
//         cb(null, file.originalname)
//         // cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
//     }
// });
// var upload = multer({ storage: storage })
// app.use(express.static(path.join(__dirname, 'public')));
// app.post('/savedata', upload.single('file'), function (req, res, next) {
//     console.log('Upload Successful ', req.file, req.body);
//     res.setHeader('Content-Type', 'text/plain');
//     res.write('OK');
//     res.end();

// });
// http.createServer(app).listen(app.get('port'), function () {
//     console.log('Express server listening on port ' + app.get('port'));
// });
//-----------------------------------------------
// config files
require("dotenv").config({ path: '.env.demonews' });
// require("dotenv").config({ path: '.env.metta-prod' });
var db = require('./config/db');
mongoose.connect(db.dbpath, () => {
    console.log('DB Connected to', mongoose.connection.host);
});

app.use(cors());
app.use(express.static('public'));
app.use(express.static('app'));
//app.use(express.static('images'));

// app.use(bodyParser.json());
//app.use(bodyParser.json({limit: '1.2mb'})); // parse application/json and set limit as 1.2 MB
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));

require('./app/routes')(app);
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/app/authen/login.html");
})

app.get('/q', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_authen/login.html");
})
app.get('/qregist', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_regist/index.html");
})
app.get('/qsit', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_sit/index.html");
})
app.get('/qscreen', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_screen/index.html");
})
app.get('/qadmin', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_admin/index.html");
})
app.get('/qdepartmentname', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_departmentname/index.html");
})
app.get('/qroom', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_setroom/index.html");
})
app.get('/qlcd', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_lcd/index.html");
})
app.get('/qopd', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_opd/index.html");
})
app.get('/qcashier', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_cashier/index.html");
})
app.get('/qpharma', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_pharma/index.html");
})
app.get('/qor', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_or/index.html");
})
app.get('/qer', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_er/index.html");
})
app.get('/qlcder', function (req, res) {
    res.sendFile(__dirname + "/public/app/q_lcd_er/index.html");
})


// app.use('*',function(req,res,next){
//     var utcOffset = 420;
//     if (req.body.fromdate) {
//         utcOffset = moment(req.body.fromdate).utcOffset();
//     }
//     if (req.body.todate) {
//         utcOffset = moment(req.body.todate).utcOffset();
//     }
//     req.utcoffset = utcOffset;
//     req.timezone = utcOffset * 60 * 1000;

//     next();
// });
var server = app.listen(8888, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)

    // console.log("server start")

});