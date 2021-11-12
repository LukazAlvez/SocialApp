const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('users');
require('../models/Post');
const Post = mongoose.model('posts');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { Passport } = require('passport');
const { authUser } = require('../helpers/authUser');


//tela perfil

router.get('/perfil', authUser, async (req, res) => {
    try{
        const posts = await Post.find({user: {_id: req.user._id}}).populate('user').sort({date: 'desc'})
        return res.render('user/perfil',{posts: posts.map(posts => posts.toJSON())})
       
    }catch{
        return res.send('error 404')
    }
})

//editar img perfil
router.post('/perfil', authUser, async (req, res) => {
    try{
        const filter = {_id: req.user._id}
        const update = {imgPerfil: req.body.imgLink}
        await User.findByIdAndUpdate(filter,update ,{new: true})
        req.flash('success_msg', 'Imagem de perfil Salva')
        res.redirect('/user/perfil')
       
    }catch{
        req.flash('error_msg', 'Erro ao salvar a imagem de perfil')
        res.redirect('/user/perfil')
    }
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

//add post
router.post('/post/add', authUser, (req, res) => {
    
    const newPost = {
        user: req.user._id,
        post: req.body.feed,
        img: req.body.img,
        datePost: moment().add(3, 'days').calendar(),
        date: Date.now()
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
//deletar posts
router.post('/delete/post', authUser, async (req, res) => {
    try{
        const id = req.body.idPost
        
        await Post.findByIdAndRemove(id)
        req.flash('success_msg', 'Post deletado')
        res.redirect('/user/perfil')
       
    }catch{
        req.flash('error_msg', 'Erro ao Deletar post')
        res.redirect('/user/perfil')
    }
})
//comentar posts tela principal
router.post('/coment', authUser, async (req, res)=>{
    try{ 
        const id = req.body.postId
        const update = {
            coments:{
                user: req.user.name,
                coment: req.body.coment
            }
        }
        await Post.findByIdAndUpdate({_id: id},{$push:update})
        req.flash("success_msg", "Sucesso!")
        res.redirect('/')
    }catch(err){
        console.log(err)
        req.flash("error_msg", "Houve um erro ao salvar.")
        res.redirect('/')
    }
       
})
//comentar posts tela perfil
router.post('/coment/perfil', authUser, async (req, res)=>{
    try{ 
        const id = req.body.postId
        const update = {
            coments:{
                user: req.user.name,
                coment: req.body.coment
            }
        }
        await Post.findByIdAndUpdate({_id: id},{$push:update})
        req.flash("success_msg", "Sucesso!")
        res.redirect('/user/perfil')
    }catch(err){
        console.log(err)
        req.flash("error_msg", "Houve um erro ao salvar.")
        res.redirect('/user/perfil')
    }
       
})
//deletar comentario
router.post('/delete/coment', authUser, async (req, res) => {
    try{
        
        const id = req.body.id
        const index = req.body.indexComent
        console.log(index, id)
        await Post.findOneAndUpdate({_id: id},
           {$pull:{"coments": {index} }}
        )
        req.flash('success_msg', 'Comentário deletado')
        res.redirect('/user/perfil')
       
    }catch(err){
        console.log(err)
        req.flash('error_msg', 'Erro ao Deletar comentário')
        res.redirect('/')
    }
})


//curtidas
// router.post('/like', authUser,(req, res)=>{
//     Post.findOne({_id: req.body.id}).then((posts)=>{
//         posts.likes += 1

//         posts.save().then(()=>{
//             res.redirect('/')
//         }).catch((err)=>{
//             req.flash('error_msg', 'Houve um erro ao salvar')
//             console.log(err)
//             res.redirect('/')
//         })
//     }).catch((err)=>{
//         req.flash('error_msg', 'Erro interno')
//     })
// } )

//logout
router.get('/logout', (req,res)=>{
    req.logout()
    res.redirect('/user/login')
})

dateNow = ()=>{
    const options = {
        timeZone: 'America/Sao_Paulo',
        hour: 'numeric',
        minute: 'numeric'
    };
    const date = new Intl.DateTimeFormat([], options);
    const dataAtual = date.format(new Date())
   

    const dias = new Date()
    const semana = ['domingo','segunda','terça','quarta','quinta','sexta','sábado']
    return semana[dias.getDay()] + " às " + dataAtual 
}

module.exports = router;