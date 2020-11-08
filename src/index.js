const express = require('express');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1); // enable this if you run behind a proxy (e.g. nginx)
const RedisStore = connectRedis(session)

//Configure redis client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
})

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

app.get("/", (req, res) => {
    sess = req.session;
    if (sess.username && sess.password) {
        sess = req.session;
        if (sess.username) {
            res.write(`<h1>Welcome ${sess.username} </h1><br>`)
            res.write(
                `<h3>This is the Home page</h3>`
            );
            res.end('<a href=' + '/logout' + '>Click here to log out</a >')
        }
    } else {
        res.sendFile(__dirname + "/login.html")
    }
});

app.post("/login", (req, res) => {
    sess = req.session;
    sess.username = req.body.username
    sess.password = req.body.password
    // add username and password validation logic here if you want.If user is authenticated send the response as success
    res.end("success")
});

app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect("/")
    });
});

app.listen(3000, () => {
    console.log("Server started at port 3000")
});
