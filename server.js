const express = require('express');
const app = express();

// enviroment var for port 
// for local amchine
const port = process.env.Port || 3006;
const expbs =require('express-handlebars');


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

app.listen(port, () => {
console.log(`server is running on port ${port}`);

});
