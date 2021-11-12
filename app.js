//carregando modulos
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const user = require('./router/user');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Post');
const Post = mongoose.model('posts');
require('./models/User');
const User = mongoose.model('users')
const passport = require('passport')
require('./config/auth')(passport);
const {authUser} = require('./helpers/authUser');
const db = require('./config/db');

//configuracoes

    //session
    app.use(session({
        secret:'userSocialApp',
        resave:true,
        saveUninitialized: true
    }));
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash());


    //middleware
    app.use((req, res, next)=>{
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null;
        next()
    })


    //body parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())


    //handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}));
    app.set('view engine', 'handlebars');


    //mongoose
    mongoose.Promise = global.Promise
    mongoose.connect(db.mongoURI).then(()=>{
        console.log("Conectado ao banco de dados online")
    }).catch((err)=>{
        console.log(err)
    })
    
    
    //public
    app.use(express.static(path.join(__dirname, 'public')));


//rotas

    app.use('/user', user)

    //pagina inicial
    app.get('/', authUser, async(req, res)=>{
        try{
            const posts = await Post.find().populate('user').sort({date: 'desc'})
            return res.render('main/index',{posts: posts.map(posts => posts.toJSON())})
           
        }catch{
            return res.send('error')
        }
    })



//outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=>{
    console.log("Servidor online");
});
