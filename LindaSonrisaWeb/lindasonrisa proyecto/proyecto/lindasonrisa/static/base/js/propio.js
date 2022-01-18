$('#modalservice_1').appendTo("body");
var correos_boletin = "";
$(document).ready(function () {
    $("#alertRecuperarCorreo").hide();
    cargaBoletin();
    cargaRecuperar();
    getBoletin();
});

// validacion form contacto

function validacion() {
    var nombre = $("#nombre").val();
    /*var correo = $("#correo").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;*/
    var asunto = $("#asunto").val();
    var mensaje = $("#mensaje").val();
    if (nombre === "" || nombre === undefined || nombre === null) {
        $("#alertNombre").show();
        event.preventDefault();
        $("#nombre").click(function () {
            $("#alertNombre").hide();
        });
    }
    ;
    /*if (correo === "" || correo === undefined || correo === null || !document.getElementById("correo").value.match(mailformat)) {
        $("#alertCorreo").show();
        event.preventDefault();
        $("#correo").click(function () {
            $("#alertCorreo").hide();
        });
    };*/
    if (asunto === "" || asunto === undefined || asunto === null) {
        $("#alertAsunto").show();
        event.preventDefault();
        $("#asunto").click(function () {
            $("#alertAsunto").hide();
        });
    }
    ;
    if (mensaje === "" || mensaje === undefined || mensaje === null) {
        $("#alertMensaje").show();
        event.preventDefault();
        $("#mensaje").click(function () {
            $("#alertMensaje").hide();
        });
    }
    ;
};

// función que permite el conteo de carácteres del form contacto
function contar() {
    var max = "250";
    var str1 = "Quedan ";
    var str2 = " carácteres.";
    var cadena = document.getElementById("mensaje").value;
    var longitud = cadena.length;

    if (longitud <= max) {
        document.getElementById("contador").value = str1.concat(max - longitud) + str2;
    } else {
        document.getElementById("mensaje").value = cadena.substr(0, max);
    }
}

// validación form de login
function validarLogin() {
    var rut = $("#id_username").val();
    var password = $("#id_password").val();

    if (rut === null || rut === undefined || rut === "") {
        $("#alertRut").show();
        event.preventDefault(); // este evento de JQUERY deshabilita el submit de un form, incluso un button
        $("#id_username").click(function () {
            $("#alertRut").hide();
        });
    }
    if (password === null || password === undefined || password === "") {
        $("#alertPassword").show();
        event.preventDefault();
        $("#id_password").click(function () {
            $("#alertPassword").hide();
        });
    }
    ;
};

// validación form de recuperar contraseña
function validarRecuperarPwd() {
    var correo = $("#input_recuperarCorreo").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (correo === "" || correo === null || correo === undefined || !document.getElementById("input_recuperarCorreo").value.match(mailformat)) {
        $("#alertRecuperarCorreo").show();
        event.preventDefault();
        $("#input_recuperarCorreo").click(function () {
            $("#alertRecuperarCorreo").hide();
        });
    }
    ;
};

function validarBoletin() {
    var correo = $("#correoBoletin").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var nombre = $("#nombreBoletin").val();
    if (correo === "" || correo === null || correo === undefined || !document.getElementById("correoBoletin").value.match(mailformat)
        || nombre === "" || correo === null || correo === undefined) {
        $("#alertBoletin").show();
        $("#c_valido").show();
        event.preventDefault();
        $("#correoBoletin").click(function () {
            $("#alertBoletin").hide();
        });
    }
    for (var k = 0; k < correos_boletin.length; k++) {
        if (correo === correos_boletin[k].correos) {
            event.preventDefault();
            $("#c_existente").show();
            $("#correoBoletin").click(function () {
                $("#alertBoletin").hide();
            });
        }
    }
};

// ajax boletin


function cargaBoletin() {
    var screen = $("#loading-screen");
    configureLoadingScreen(screen);
    var formBoletin = $(".subscribe-form");
    formBoletin.submit(function (event) {
        event.preventDefault();
        var boletinData = formBoletin.serialize();
        var $thisURL = formBoletin.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: boletinData,
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(data) {
            formBoletin[0].reset()
            $('#msg').html("¡Hecho!").delay(500).fadeIn('slow');
            //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message 
            $('#msg').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
};

function configureLoadingScreen(screen) {
    $(document).ajaxStart(function () {
        $("#btnSuscribir").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#btnSuscribir").prop('disabled', false);
        screen.fadeOut();
    })
};


// ajax recuperar contraseña

function cargaRecuperar() {
    var screen = $("#recuperarPwd");
    screenRecuperar(screen);
    var formRecuperar = $(".formRecuperar");
    formRecuperar.submit(function (event) {
        event.preventDefault();
        var recuperarData = formRecuperar.serialize();
        var $thisURL = formRecuperar.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: recuperarData,
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(data) {
            formRecuperar[0].reset()
            console.log("hecho")
            $('#msgRecuperar').html("Hemos enviado un correo a tu bandeja de entrada, sigue los pasos..").delay(500).fadeIn('slow');
            //$('#msg').html("data insert successfully").fadeIn('slow') //also show a success message
            $('#msgRecuperar').delay(4000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
}

function screenRecuperar(screen) {
    $(document).ajaxStart(function () {
        $("#btnRecuperar").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#btnRecuperar").prop('disabled', false);
        screen.fadeOut();
    })
};

function getBoletin() {
    $.ajax({
        url: 'getBoletin/',
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            correos_boletin = data;
            validarBoletin(correos_boletin);
            $("#alertBoletin").css({
                'display': 'none'
            });
        }
    })
}