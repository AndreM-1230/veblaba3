
const express = require('express')
const app = express()
const crypto = require('crypto')
const urlencodedParser = express.urlencoded({extended: false});
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const secret = "YOUR_SECRET_KEY"


app.use(express.json());
app.use(cookieParser());
app.listen(8080)
app.use("/image", express.static('image'))
app.use("/script", express.static('script'))
app.use("/css", express.static('css'))

var Datastore = require('nedb');
var users = new Datastore({ filename: 'users.db', autoload: true });
const admin = {
    login: 'admin',
    password: 'd033e22ae348aeb5660fc2140aec35850c4da997'
};
users.ensureIndex({ fieldName: 'login', unique: true });
users.insert(admin);

app.get('/v1/authorization', function (req, res) {
    res.sendFile(__dirname + '/views/authorization.html')
});

const authorization = (req, res, next) => {
    const access_token = req.headers.authorization
    if (!access_token) {
        return res.status(403).sendFile(__dirname + '/views/403.html');
    }
    try {
        const bdata = jwt.verify(access_token, secret);
        req.userId = bdata.id;
        req.userRole = bdata.role;
        return next();
    } catch {
        return res.status(403).sendFile(__dirname + '/views/403.html');
    }
};

app.get('/', function(req, res){
    res.sendFile(__dirname + '/views/index.html')
});

app.post("/v1/authorization",
    urlencodedParser,
    function (req, res) {
        let sha1 = crypto.createHash('sha1')
        let hash = sha1.update(req.body.password).digest('hex')
        req.body.password = hash
        users.findOne({login: req.body.login},function (err,doc){
        if(doc.password === req.body.password){
            const token = jwt.sign({ id: 1, role: "admin" }, secret);
            return res
                .status(200)
                .send({"access_token":token})
        }
        else
            return res.status(403).sendFile(__dirname + '/views/403.html');
        });
    });


app.get("/v1/cars", authorization, (req, res) => {
    res.sendFile(__dirname + '/views/cars.html')
});

app.get("/SignOut", authorization, (req, res) => {
    return res
        .clearCookie("access_token")
        .redirect('/')
});

app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + '/views/404.html')
});

