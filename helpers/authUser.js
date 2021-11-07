module.exports = {
    authUser: (req, res, next)=>{
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error_msg", "Você deve está logado para poder acessar essa página!");
        res.redirect('/user/login')
    }
}