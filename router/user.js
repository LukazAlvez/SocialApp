const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users')
require('../models/Post');
const Post = mongoose.model('posts')
const bcrypt = require('bcryptjs')
const passport = require('passport');
const { Passport } = require('passport');
const { authUser } = require('../helpers/authUser')


router.get('/perfil', authUser, (req, res) => {
    Post.find({userPost: req.user.name}).sort('-date').then((posts)=>{
        res.render('user/perfil', {posts: posts.map(posts => posts.toJSON())}); 
    }).catch((err)=>{
        console.log(err)
    })
})

//login
router.get('/login', (req, res) => {
    res.render('user/login')
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

//registrando user
router.get('/register', (req, res) => {
    res.render('user/register')
})
router.post('/register', (req, res) => {
    const newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    var error = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        error.push({ texto: "Campo nome inválido ou vazio!" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        error.push({ texto: "Campo email inválido ou vazio!" })
    }
    if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
        error.push({ texto: "Campo senha inválido ou vazio!" })
    }
    if (!req.body.passwordConf || typeof req.body.passwordConf == undefined || req.body.passwordConf == null) {
        error.push({ texto: "Campo confirme sua senha inválido ou vazio!" })
    }
    if (req.body.password !== req.body.passwordConf) {
        error.push({ texto: "As senhas não conferem" })
    }
    if (error.length > 0) {
        res.render('user/register', { error: error })
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash('error_msg', 'Email já cadastrado!')
                res.redirect('/user/register')
            } else {

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.password, salt, (erro, hash) => {
                        if (erro) {
                            req.flash('error_msg', "Houve um erro ao salvar")
                            res.redirect('/user/register')
                        }
                        newUser.password = hash
                        new User(newUser).save().then(() => {
                            req.flash("success_msg", "Usuário cadastrado com sucesso!")
                            res.redirect('/user/login')
                        }).catch((err) => {
                            req.flash("error_msg", "Erro ao cadastrar usuário")
                            res.redirect('/user/register')
                        })
                    })
                })


            }
        }).catch((err) => {
            req.flash("error_msg", "Erro interno")
            res.redirect('/')
        })

    }
})

//add postagem
router.post('/post/add', authUser, (req, res) => {
    const newPost = {
        userPost: req.user.name,
        feed: req.body.feed,
        img: req.body.img
    }

    if (!req.body.feed || typeof req.body.feed == undefined || req.body.feed == null) {
        req.flash("error_msg", "Texto invalido ou campo vazio")
        res.redirect('/')
    } else {
        new Post(newPost).save().then(() => {
            req.flash("success_msg", "Sucesso!")
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro ao salvar.")
            res.redirect('/')
        })
    }


})

//curtidas
router.post('/like', authUser,(req, res)=>{
    Post.findOne({_id: req.body.id}).then((posts)=>{
        posts.likes += 1

        posts.save().then(()=>{
            res.redirect('/')
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao salvar')
            console.log(err)
            res.redirect('/')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Erro interno')
    })
} )

//logout
router.get('/logout', (req,res)=>{
    req.logout()
    res.redirect('/user/login')
})




// const validarRegistro = () =>{
//     var error = []

//     if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
//         error.push("Campo nome inválido")
//     }
//     if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
//         error.push("Campo email inválido")
//     }
//     if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
//         error.push("Campo senha inválido")
//     }
//     if(req.body.password < 8){
//         error.push("Senha muito curta, digite uma senha com no mínimo 8 digitos")
//     }
//     if(req.body.password != req.body.password2 ){
//         error.push("Senhas não conferem")
//     }

//     return error
// }
module.exports = router;