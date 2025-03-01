const express = require('express');
const session = require('express-session')
const jwt = require('jsonwebtoken');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(req.session);
    if (req.session.authorization) {
        const token = req.session.authorization["accessToken"];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
                return;
            }
            return res.status(403).json({ message: "User not authenticated" });
        });
        return;
    }
    return res.status(403).json({ message: "User not logged in" });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, _ => console.log("Server is running"));


/*

curl -i --raw http://localhost:5000
curl -i --raw http://localhost:5000/isbn/3
curl -i --raw http://localhost:5000/author/unknown
curl -i --raw http://localhost:5000/title/things%20fall%20apart
curl -i --raw http://localhost:5000/review/10
curl -i --raw -d '{"username":"test", "password":"secure-password"}' -H "Content-Type: application/json" -X POST http://localhost:5000/register/
curl -i --raw -d '{"username":"test", "password":"secure-password"}' -H "Content-Type: application/json" -X POST http://localhost:5000/customer/login/ -c cookie-file.txt
curl -i --raw -d '{"review":"OK!"}' -H "Content-Type: application/json" -X PUT http://localhost:5000/customer/auth/review/10 -b cookie-file.txt -v
curl -i --raw -X DELETE http://localhost:5000/customer/auth/review/10 -b cookie-file.txt


    Usefull links:

    https://gist.github.com/subfuzion/08c5d85437d5d4f00e58
    https://medium.com/@evangow/server-authentication-basics-express-sessions-passport-and-curl-359b7456003d
    https://stackoverflow.com/questions/37486631/nodemon-app-crashed-waiting-for-file-changes-before-starting

*/
