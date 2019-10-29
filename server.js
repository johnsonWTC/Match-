const express = require('express');
const expbs =require('express-handlebars');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const password = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport-facebook')

// load models
const Message = require('./models/message.js');
const user = require('./models/user');


const app = express();

//load keys file
const keys = require('./config/keys')
// use body parser mindleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// config for authonthification

app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: true,
    saveUninitialized: true
}));
//require('./passport/facebook');
app.use(passport.initialize());
app.use(passport.session());
// facebook strategy



// conect to mlab MongoDB


mongoose.connect(keys.MongoDB,{useNewUrlParser:true}).then(() => {
    console.log("connection is sucessful ")
}).catch((err) => {
    console.log(err);
});


// enviroment var for port 
// for local amchine
const port = process.env.port || 3000;



// setup view engine
app.engine('handlebars',expbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

app.get('/',(req,res)=> {
    res.render('home',{
        title: 'home'
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'about'
    });
});



app.get('/contact',(req,res) => {
    res.render('contact',{
        title: 'contact'
    });
});


app.get('/auth/facebook',passport.authothicate('facebook'));
app.get('/auth/facebook/callback',passport.authothicate('facebook',{
    successRedirect:'/profile',
    failureRedirect: '/'

}));

app.post('/contactUs',(req,res) => {
    console.log(req.body);
    const newMessage = {
        fullname : req.body.fullname,
        email : req.body.email,
        message : req.body.message,
        date : new Date()
    }
    new Message(newMessage).save((err,message) => {
        if (err) {
            throw err;
        }else{
            Message.find({}).then((messages) => {
                if(messages){
                    res.render('newmessage',{
                        title : 'sent',
                        messages: messages
                });
            }else{
                res.render('noMessage',{
                    title : 'not found'
            });
        }
    });
}
});
});









app.listen(port, () => {
console.log(`server is running on port ${port}`);

});
