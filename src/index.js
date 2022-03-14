const express = require('express')
const app = express()
const path = require('path');
var cors = require('cors')
app.use(cors({origin: true, credentials: true}));
//notification
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('secret'));

app.use(session({
        secret : 'something',
        resave :true,
        saveUninitialized: true,
        cookie : {maxAge:null}      
    }));
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })

//body-parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());




//set public
app.use(express.static(path.join(__dirname, 'public/')));



//database
const db = require('./config/db')
db.connect()

//xac dinh tuyen duong
const route = require('./routes');
route(app);




app.listen(process.env.PORT || 8000)








// //database
// const db = require('./config/db')
// db.connect()



// //set public
// app.use(express.static(path.join(__dirname, 'public/')));


//
//xac dinh tuyen duong
// const route = require('./routes');
// route(app);

// app.listen(process.env.PORT || 8080);

