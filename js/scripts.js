const ingre_btn = $('#ingresa-btn')
const regis_btn = $('#registra-btn')
const modalbg = $('.modal-background')
const modal = $('.modal')
const modalregis = $('#modal-regis')
const modalingre = $('#modal-ingre')
const modalnpost = $('#modal-npost')
const btn_nombre = $('#btn_nombre')
const btn_salir = $('#btn_salir')
const btn_registrar = $('#registrar')
const btn_ingresar = $('#ingresar')
const btn_agregar = $('#agregar')
const btn_guardar_post = $('#crear')
const mural = $('#mural')

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
            posts.forEach(post => {
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
                texto +=                '<p>'+post.texto+'</p>'
                texto +=            '</div>'
                texto +=        '</div>'
                texto +=    '</div>'
    
            })      
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


//inicio scripts blog



//inicio escripts comentarios


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