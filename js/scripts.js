const ingre_btn = $('#ingresa-btn');
const regis_btn = $('#registra-btn');
const modalbg = $('.modal-background');
const modal = $('.modal');
const modalregis = $('#modal-regis');
const modalingre = $('#modal-ingre');
const btn_nombre = $('#btn_nombre');
const btn_salir = $('#btn_salir');
const btn_registrar = $('#registrar');
const btn_ingresar = $('#ingresar');

$( document ).ready(function() {
    if(localStorage.hasOwnProperty("usuario")){ //carga datos del usuario
        usuario = JSON.parse(localStorage.getItem("usuario"));
        regis_btn.hide();
        ingre_btn.hide();
        btn_nombre.html(usuario.nombre)
        btn_nombre.show();
        btn_salir.show();
    }else{
        regis_btn.show();
        ingre_btn.show();
        btn_nombre.hide();
        btn_salir.hide();
    }
    if(localStorage.hasOwnProperty("usuarios")){
        usuarios = JSON.parse(localStorage.getItem("usuarios"));
    }else{
        usuarios = []
    }
});
//modal login
regis_btn.click(function() {
    modalregis.addClass('is-active');
    regis_btn.hide();
    ingre_btn.hide();
});
ingre_btn.click(function() {
    modalingre.addClass('is-active');
    regis_btn.hide();
    ingre_btn.hide();
});
modalbg.click(function(){
    regis_btn.show();
    ingre_btn.show();
    modal.removeClass('is-active');
});

btn_registrar.click(function(){
    if($('input[name=nombre]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar su nombre completo</p>')
        return false;
    }
    if($('input[name=correo]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar un correo electronico</p>')
        return false;
    }
    if($('input[name=contrasenia]').val()==''){
        $("#feed_reg").html('<p class="help is-danger">Debe ingresar una contraseña</p>')
        return false;
    }
    var cont = $('input[name=contrasenia]').val();
    var cont2 = $('input[name=contrasenia2]').val();
    if(cont!=cont2){
        $("#feed_reg").html('<p class="help is-danger">Las contraseñas no coinciden</p>')
        return false;
    }else{
        let corr = $('input[name=correo]').val()
        let indice = usuarios.findIndex( i => i.correo == corr );
        if(indice>-1){
            modalregis.removeClass('is-active');
            modalingre.addClass('is-active');
            $('input[name=email]').val(corr)
            $("#feed_log").html('<p class="help is-info">El usuario ya existe</p>')
        }else{
            usuario = {             
                nombre : $('input[name=nombre]').val(),
                correo : $('input[name=correo]').val(),
                contrasenia : $('input[name=contrasenia]').val(),
            }
            usuarios.push(usuario);//agregamos el usuario en base de datos
            localStorage.setItem('usuarios',JSON.stringify(usuarios));
            localStorage.setItem('usuario',JSON.stringify(usuario));//iniciamos session de usuario
            location.reload();
        }  
    }
});

btn_ingresar.click(function(){
    var cont = $('input[name=password]').val();
    var corr = $('input[name=email]').val();
    let indice = usuarios.findIndex( i => i.correo == corr );
    if(indice>-1){
        if(usuarios[indice].contrasenia == cont){
            usuario = usuarios[indice];
            localStorage.setItem('usuario',JSON.stringify(usuario));
            location.reload();
        }else{
            $("#feed_log").html('<p class="help is-danger">La contraseña es incorrecta</p>')
            return false;
        }
    }else{
        $("#feed_log").html('<p class="help is-danger">El usuario no fue encontrado</p>')
        return false;
    }
});

btn_salir.click(function(){
    localStorage.removeItem('usuario');
    location.reload();
});