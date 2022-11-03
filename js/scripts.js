const ingre_btn = $('#ingresa-btn')
const regis_btn = $('#registra-btn')
const modalbg = $('.modal-background')
const modal = $('.modal')
const modalregis = $('#modal-regis')
const modalingre = $('#modal-ingre')
const modalnpost = $('#modal-npost')
const modaleditu = $('#modal-editu')
const btn_nombre = $('#btn_nombre')
const btn_salir = $('#btn_salir')
const btn_registrar = $('#registrar')
const btn_ingresar = $('#ingresar')
const btn_agregar = $('#agregar')
const btn_actualizar = $('#actualizar')
const btn_guardar_post = $('#crear')
const mural = $('#mural')
const boton_comentario = $('.button-comentario')
//montamos
$( document ).ready(function() {
    if(localStorage.hasOwnProperty("usuario")){ //carga datos del usuario
        usuario = JSON.parse(localStorage.getItem("usuario"))
        regis_btn.hide()
        ingre_btn.hide()
        btn_nombre.html(usuario.nombre)
        btn_nombre.show()
        btn_salir.show()
        btn_agregar.show()
    }else{
        regis_btn.show()
        ingre_btn.show()
        btn_nombre.hide()
        btn_salir.hide()
        btn_agregar.hide()
    }
    if(localStorage.hasOwnProperty("usuarios")){
        usuarios = JSON.parse(localStorage.getItem("usuarios"))
        //recuperamos los post de lso usuarios
        if(localStorage.hasOwnProperty('posts')){
            posts = JSON.parse(localStorage.getItem("posts"))
            texto = ''
            largo = posts.length-1
            for (let index = largo; 0 <= index; index--) {
                post = posts[index]
                texto += '<div class="card article">'
                texto +=    '<div class="card-content">'
                texto +=        '<div class="media">'
                texto +=            '<div class="media-content has-text-centered">'
                texto +=                '<p class="title article-title">'+post.titulo+'</p>'
                texto +=                    '<div class="tags has-addons level-item">'
                var autor = usuarios[post.usuario_id]
                texto +=                        '<span class="tag is-rounded is-info">'+autor.nombre+'</span>'
                texto +=                        '<span class="tag is-rounded">'+fechaToString(new Date(post.creado_en))+'</span>'
                texto +=                    '</div>'
                texto +=                '</div>'
                texto +=            '</div>'
                texto +=            '<div class="content article-body">'
                texto +=                '<h3 class="has-text-centered">'+post.subtitulo+'</h3>'
                texto +=                '<p>'+post.texto+'</p>'

                texto +=            '</div>'
                //mostrar comentarios
                texto += '<span class="tag is-rounded is-success">Comentarios:</span>'
                if(post.comentarios.length > 0){
                    post.comentarios.forEach(function(comentario){
                        texto += '<div class="box">'
                        texto +=    '<div class="content">'
                        texto +=        '<p>'
                        var comentador = usuarios[comentario.usuario_id]
                        texto +=            '<strong>'+comentador.nombre+'</strong> <small>'+fechaToString(new Date(comentario.creado_en))+'</small>'
                        texto +=            '<br>'
                        texto +=             comentario.comentario
                        texto +=        '</p>'
                        texto +=    '</div>'
                        texto += '</div>'
                    })
                }else{
                    texto += '<div class="box">Sin comentarios</div>'
                }
                
                // preguntamos si el usuario esta logueado para dejar un coentario 
                if(localStorage.hasOwnProperty("usuario")){
                    texto += '<div class="field">'
                    texto +=    '<div class="control">'
                    texto +=        '<input type="text" class="input" placeholder="Deja tu comentario" name="coment_post_'+index+'">'
                    texto +=    '</div>'
                    texto +=    '<span id="feed_post_'+index+'"></span>'
                    texto +=  '</div>'
                    texto += '<button class="button is-small is-info button-comentario" title="comentar" onclick="comentar_en('+index+')">Agregar comentario</button>'
                }
                texto +=      '</div>'
                texto += '</div>'
            }     
            mural.html(texto)
        }else{
            posts = []
        }
    }else{
        usuarios = []
    }
    
})
//modal login
regis_btn.click(function() {
    modalregis.addClass('is-active')
})
ingre_btn.click(function() {
    modalingre.addClass('is-active')
})
modalbg.click(function(){
    modal.removeClass('is-active')
})

btn_registrar.click(function(){
    if($('input[name=nombre]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar su nombre completo</p>')
        return false
    }
    if($('input[name=correo]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar un correo electronico</p>')
        return false
    }
    if($('input[name=contrasenia]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar una contraseña</p>')
        return false
    }
    var cont = $('input[name=contrasenia]').val()
    var cont2 = $('input[name=contrasenia2]').val()
    if(cont!=cont2){
        $("#feed_reg").html('<p class="help is-danger">Las contraseñas no coinciden</p>')
        return false
    }else{
        let corr = $('input[name=correo]').val()
        let indice = usuarios.findIndex( i => i.correo == corr )
        if(indice>-1){
            modalregis.removeClass('is-active')
            modalingre.addClass('is-active')
            $('input[name=email]').val(corr)
            $("#feed_log").html('<p class="help is-info">El usuario ya existe</p>')
        }else{
            usuario = {             
                nombre : $('input[name=nombre]').val(),
                correo : $('input[name=correo]').val(),
                contrasenia : $('input[name=contrasenia]').val(),
            }
            usuarios.push(usuario)//agregamos el usuario en base de datos
            localStorage.setItem('usuarios',JSON.stringify(usuarios))
            localStorage.setItem('usuario',JSON.stringify(usuario))//iniciamos session de usuario
            location.reload()
        }  
    }
})

btn_ingresar.click(function(){
    var cont = $('input[name=password]').val()
    var corr = $('input[name=email]').val()
    let indice = usuarios.findIndex( i => i.correo == corr )
    if(indice>-1){
        if(usuarios[indice].contrasenia == cont){
            usuario = usuarios[indice]
            localStorage.setItem('usuario',JSON.stringify(usuario))
            location.reload()
        }else{
            $("#feed_log").html('<p class="help is-danger">La contraseña es incorrecta</p>')
            return false
        }
    }else{
        $("#feed_log").html('<p class="help is-danger">El usuario no fue encontrado</p>')
        return false
    }
})

btn_salir.click(function(){
    localStorage.removeItem('usuario')
    location.reload()
})
//fin scripts logins y registro
btn_agregar.click(function(){
    modalnpost.addClass('is-active')
})

//inicio scripts blog

btn_guardar_post.click(function(){
    var titulo = $('input[name=titulo]').val()
    var subtitulo = $('input[name=subtitulo]').val()
    var texto = $('#contenido').val()
    var usuario_id = usuarios.findIndex( i => i.correo == usuario.correo )
    console.log(titulo)
    console.log(subtitulo)
    console.log(texto)
    console.log(usuario_id)
    post = {             
        titulo : titulo,
        subtitulo : subtitulo,
        texto : texto,
        usuario_id : usuario_id,
        comentarios: [],
        creado_en: new Date()
    }
    posts.push(post)
    localStorage.setItem('posts',JSON.stringify(posts))
    location.reload()
})

//inicio escripts comentarios

function comentar_en(elemento){
    var comentario = $('input[name=coment_post_'+elemento+']').val()
    if(comentario.length < 5 ){
        $("#feed_post_"+elemento).html('<p class="help is-info">debe ingresar al menos 5 caracteres</p>')
    }
    var usuario_id = usuarios.findIndex( i => i.correo == usuario.correo )
    var comentarios = posts[elemento].comentarios
    comentar = {
        creado_en: new Date(),
        usuario_id: usuario_id,
        comentario: comentario
    }
    comentarios.push(comentar)
    posts[elemento].comentarios = comentarios
    localStorage.setItem('posts',JSON.stringify(posts))
    location.reload()
}

// actualizar datos usuario
btn_nombre.click(function(){
    console.log('actualizar datos de usuario')
    modaleditu.addClass('is-active')
    $('input[name=nombre_editar]').val(usuario.nombre)
    $('input[name=correo_editar]').val(usuario.correo)
});


btn_actualizar.click(function(){
    var usuario_id = usuarios.findIndex( i => i.correo == usuario.correo )
    if($('input[name=contrasenia_editar]').val()!=''){
        usuario_actualizado = {   
            nombre : $('input[name=nombre_editar]').val(),
            correo : $('input[name=correo_editar]').val(),          
            contrasenia : $('input[name=contrasenia_editar]').val(),
        }
    }else{
        usuario_actualizado = {      
            nombre : $('input[name=nombre_editar]').val(),
            correo : $('input[name=correo_editar]').val(),       
            contrasenia : usuario.contrasenia,
        }
    }
    usuarios[usuario_id]=usuario_actualizado//agregamos el usuario en base de datos
    localStorage.setItem('usuarios',JSON.stringify(usuarios))
    usuario = usuario_actualizado
    localStorage.setItem('usuario',JSON.stringify(usuario))//iniciamos session de usuario
    location.reload()
})

//helpers
function fechaToString(fecha){
    let hora_n = fecha.getHours()
    if( hora_n < 10 ){
        hora_n = "0"+hora_n
    }
    let minuto_n = fecha.getMinutes()
    if (minuto_n == 0)
        minuto_n = '00'
    let horasyMinutos = hora_n+":"+minuto_n
    let dia = fecha.getDay()
    switch (dia) {
        case 1:
            nombre_dia = 'Lunes'
            break
        case 2:
            nombre_dia = 'martes'
            break
        case 3:
            nombre_dia = 'Miercoles'
            break
        case 4:
            nombre_dia = 'Jueves'
            break
        case 5:
            nombre_dia = 'Viernes'
            break
        case 6:
            nombre_dia = 'Sabado'
            break
        case 7:
            nombre_dia = 'Domingo'
            break
        default:
            break
    }
    return  nombre_dia+', '+fecha.getDate()+'/'+(fecha.getMonth()+1)+'/'+fecha.getFullYear()+' '+horasyMinutos+' Hrs.'
}
