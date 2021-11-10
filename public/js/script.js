

function insertImg(){
    document.getElementById('addImg').innerHTML = "<input class ='inputImg' name='img' placeholder='Cole o link da imagem' type='text'>"
}

function addImgPerfil(){
    document.getElementById('addPerfil').innerHTML ="<form action='/user/perfil' method='post' class='insertImg'> <input type='text' name='imgLink' placeholder='Cole like de uma imagem'> <button type='submit'>Salvar</button></form>"
}

