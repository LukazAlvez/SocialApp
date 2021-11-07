if(process.env.NODE_ENV == "production"){
    module.exports = { mongoURI: 'mongodb+srv://lucasDb:lc92630028@meuserver.2pesv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}else{
    module.exports = { mongoURI: 'mongodb+srv://lucasDb:lc92630028@meuserver.2pesv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'}
}