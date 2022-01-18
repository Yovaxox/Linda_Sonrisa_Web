/*Jquery starts here*/
$(document).ready(function () {
    $('select.dropdown').dropdown();
    $('.ui.radio.checkbox').checkbox();
    $('.message .close')
        .on('click', function () {
            $(this)
                .closest('.message')
                .transition('fade')
            ;
        });
    postRegistro();
    cargaRegiones();
    datosExistente();
});
/*Jquery ends here*/

/*Javascript starts here*/
//Define some variables for hold form fields data
var correo, usuario, password, cpassword,
    rut, nombre, apellidoP, apellidoM, fecha_nacimiento, genero, numMovil, numFijo, region, comuna, direccion,
    extranjero,
    afp, liquidaciones, finiquitos, salud, pasaporte

//Etapa 1
function processStepOne() {

    $('#error-msg').removeClass('hidden');
    //Almacena el correo en una variable
    correo = $.trim($("#correo").val());
    //Almacena el usuario en una variable
    /*usuario = $.trim($("#usuario").val());*/
    //Almacena la contraseña en una variable
    password = $.trim($("#password").val());
    //Almacena la confirmacion de contraseña en una variable
    cpassword = $.trim($("#confirm-password").val());
    //Revisa los campos vacíos al clickear siguiente
    var key = true;
    for (var i = 0; i < datos.length; i++) {
        if (correo === datos[i].correos) {
            $("#error-msg").css({
                'display': 'block'
            });
            $("#p_correo_existe").show();
            $("#p_correo_existe").text(" - Error en el correo. Correo ya existe.");
            $("#pwd_confirm").hide();
            key = false;
        } else {
            $("#p_correo_existe").hide();
        }
    }
    if (correo === ""
        || correo === undefined
        || correo === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    }
    /*else if (usuario == "") {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    }*/
    else if (password === ""
        || password === undefined
        || password === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (cpassword === ""
        || cpassword === undefined
        || cpassword === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (key == false) {
        $("#error-msg").css({
            'display': 'block'
        });
    } else {
        if (password === cpassword && key == true) {
            //Mostrar carga
            $('#loader').css({
                'display': 'block'
            });
            setTimeout(function () {
                //Esconde carga
                $('#loader').css({
                    'display': 'none'
                });
                //Remove the user icon from the first step progress bar
                $(".step_one > i").removeClass('user');
                //Add the check icon to the first step progress bar
                $(".step_one > i").addClass('checkmark box').css('color', 'green');
                //Add caption completed to the first step bar
                $(".step_one .description").html('Completado').css('color', 'green');
                //Remove the active from the first step progress bar
                $(".step_one").removeClass('active');
                //Remove the disabled class from the second step progress bar
                $(".step_two").removeClass('disabled');
                //Add the active class to the second step progress bar
                $(".step_two").addClass('active');
                //Hide the error message
                $("#error-msg").css({
                    'display': 'none'
                });
                //Show the second step
                $("#step_two").css({
                    'display': 'block'
                });
                //Hide the first step
                $("#step_one").css({
                    'display': 'none'
                });
            }, 500);
        } else {
            $("#error-msg").css({
                'display': 'block'
            });
            $("#pwd_confirm").show();
            $("#pwd_confirm").text(" - Error en las contraseñas. Deben ser iguales");
        }
    }
}

//Back to step one
function backToStepOne() {
    //Show the loader
    $('#loader').css({
        'display': 'block'
    });
    setTimeout(function () {
        //hide the loader
        $('#loader').css({
            'display': 'none'
        });
        //Hide the second step
        $("#step_two").css({
            'display': 'none'
        });
        //Show the first step
        $("#step_one").css({
            'display': 'block'
        });
        //Remove the check icon from the first step progress bar
        $(".step_one > i").removeClass('checkmark box');
        //Add the user icon to the first step progress bar
        $(".step_one > i").addClass('user').css('color', 'black');
        //Remove caption completed from the first step bar
        $(".step_one .description").html('');
        //Remove the active from the second step progress bar
        $(".step_two").removeClass('active');
        //Add the disabled class from the second step progress bar
        $(".step_two").addClass('disabled');
        //Add the active class to the first step progress bar
        $(".step_one").addClass('active');
        //Hide the error message
        $("#error-msg").css({
            'display': 'none'
        });
    }, 1500);
}

//Etapa 2
function processStepTwo() {
    $('#error-msg').removeClass('hidden');
    //Almacena el rut en variable local
    rut = $.trim($("#rut").val());
    //Almacena el nombre en variable local
    nombre = $.trim($("#nombre").val());
    //Almacena los apellidos en variable local
    apellidoP = $.trim($("#apellidoPaterno").val());

    apellidoM = $.trim($("#apellidoMaterno").val());

    fecha_nacimiento = $("#fechaNacimiento").val();

    genero = $("#genero").val();
    //Almacena el telefono en variable local
    numMovil = $.trim($("#numMovil").val());

    numFijo = $.trim($("#numFijo").val());

    regiones = $("#regiones").val();

    comunas = $("#comunas").val();
    //Almacena la direccion en variable local
    direccion = $.trim($("#direccion").val());

    //Check empty field on click of next button
    var key = true;
    for (var i = 0; i < datos.length; i++) {
        if (rut === datos[i].usuarios) {
            $("#error-msg").css({
                'display': 'block'
            });
            $("#p_rut_existe").show();
            $("#p_rut_existe").text(" - Error en el RUT. Correo ya RUT.");
            //$("#pwd_confirm").hide();
            key = false;
        } else {
            $("#p_rut_existe").hide();
        }
    }

    if (rut === ""
        || rut === undefined
        || rut === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (nombre === ""
        || nombre === undefined
        || nombre === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (apellidoP === ""
        || apellidoP === undefined
        || apellidoP === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (apellidoM === ""
        || apellidoM === undefined
        || apellidoM === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (fecha_nacimiento === ""
        || fecha_nacimiento === undefined
        || fecha_nacimiento === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (genero === ""
        || genero === undefined
        || genero === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (numMovil === ""
        || numMovil === undefined
        || numMovil === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (numFijo === ""
        || numFijo === undefined
        || numFijo === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (regiones === ""
        || regiones === undefined
        || regiones === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (comunas === ""
        || comunas === undefined
        || comunas === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (direccion === ""
        || direccion === undefined
        || direccion === null) {
        //Show the error message
        $("#error-msg").css({
            'display': 'block'
        });
    } else if (key == false) {
        $("#error-msg").css({
            'display': 'block'
        });
    } else {
        //Show the loader
        $('#loader').css({
            'display': 'block'
        });
        setTimeout(function () {
            //hide the loader
            $('#loader').css({
                'display': 'none'
            });
            //Remove the user icon from the second step progress bar
            $(".step_two > i").removeClass('shield');
            //Add the check icon to the second step progress bar
            $(".step_two > i").addClass('checkmark box').css('color', 'green');
            //Add caption completed to the second step progress bar
            $(".step_two .description").html('Completado').css('color', 'green');
            //Remove the active from the second step progress bar
            $(".step_two").removeClass('active');
            //Remove the disabled class from the third step progress bar
            $(".step_three").removeClass('disabled');
            //Add the active class to the third step progress bar
            $(".step_three").addClass('active');
            //Hide the error message
            $("#error-msg").css({
                'display': 'none'
            });
            //Show the third step
            $("#step_three").css({
                'display': 'block'
            });
            //Hide the second step
            $("#step_two").css({
                'display': 'none'
            });
        }, 1500);
    }

}

//Back to step two
function backToStepTwo() {
    //Show the loader
    $('#loader').css({
        'display': 'block'
    });
    setTimeout(function () {
        //hide the loader
        $('#loader').css({
            'display': 'none'
        });
        //Hide the third step
        $("#step_three").css({
            'display': 'none'
        });
        //Show the second step
        $("#step_two").css({
            'display': 'block'
        });
        //Remove the check icon from the second step progress bar
        $(".step_two > i").removeClass('checkmark box');
        //Add the shield icon to the second step progress bar
        $(".step_two > i").addClass('shield').css('color', 'black');
        //Remove caption completed from the second step progress bar
        $(".step_two .description").html('');
        //Remove the active from the third step progress bar
        $(".step_three").removeClass('active');
        //Add the disabled class to the third step progress bar
        $(".step_three").addClass('disabled');
        //Add the active class to the second step progress bar
        $(".step_two").addClass('active');
        //Hide the error message
        $("#error-msg").css({
            'display': 'none'
        });
    }, 1500);
}

//Etapa 3
function processStepThree() {
    $('#error-msg-pdf').removeClass('hidden');
    //Almacena afp en una variable local
    afp = $.trim($("#afp").val());
    //Almacena liquidaciones en una variable local
    liquidaciones = $.trim($("#liquidaciones").val());
    //Almacena finiquitos en una variable local
    finiquitos = $.trim($("#finiquitos").val());
    //Almacena salud en una variable local
    salud = $.trim($("#salud").val());

    pasaporte = $.trim($("#c_pasaporte").val());

    //Check empty field on click of next button
    /*if (afp === ""
        || afp === undefined
        || afp === null) {
        //Show the error message
        $("#error-msg-pdf").css({
            'display': 'block'
        });
    } else if (liquidaciones === ""
        || liquidaciones === undefined
        || liquidaciones === null) {
        //Show the error message
        $("#error-msg-pdf").css({
            'display': 'block'
        });
    } else if (finiquitos === ""
        || finiquitos === undefined
        || finiquitos === null) {
        //Show the error message
        $("#error-msg-pdf").css({
            'display': 'block'
        });
    } else if (salud === ""
        || salud === undefined
        || salud === null) {
        //Show the error message
        $("#error-msg-pdf").css({
            'display': 'block'
        });
    } else if ($("#field_pasaporte").is(":visible") && pasaporte === ""
        || $("#field_pasaporte").is(":visible") && pasaporte === undefined
        || $("#field_pasaporte").is(":visible") && pasaporte === null) {
        $("#error-msg-pdf").css({
            'display': 'block'
        });
    } else {*/
    //Show the loader
    $('#loader').css({
        'display': 'block'
    });
    setTimeout(function () {
        //hide the loader
        $('#loader').css({
            'display': 'none'
        });
        //Remove the map icon from the third step progress bar
        $(".step_three > i").removeClass('map');
        //Add the check icon to the third step progress bar
        $(".step_three > i").addClass('checkmark box').css('color', 'green');
        //Add caption completed to the third step progress bar
        $(".step_three .description").html('Completado').css('color', 'green');
        //Remove the active from the third step progress bar
        $(".step_three").removeClass('active');
        //Hide the error message
        $("#error-msg-pdf").css({
            'display': 'none'
        });
        //Show the fourth step
        $("#step_four").css({
            'display': 'block'
        });
        //Hide the third step
        $("#step_three").css({
            'display': 'none'
        });
    }, 1500);
    //}
}

//Cancel the submission of the form
function submitCancel() {
    if (confirm('¿Estás seguro de cancelar el registro y a los beneficios?')) {
        window.location.href = "{% url 'generales:home' %}";
    }
}

function validarPDF(id) {
    var fileInput = document.getElementById(id);
    var filePath = fileInput.value;
    var allowedExtensions = /(\.pdf)$/i;
    if (!allowedExtensions.exec(filePath)) {
        fileInput.value = '';
        $("#error-msg-pdf").css({
            'display': 'block'
        });
        return false;
    }
}

//Hide the error message on focus event for input field
function hideErrorMsg(id) {
    $("#" + id).fadeOut(500);
}

/*Javascript ends here*/

// etapa 1

function ValidateEmail() {
    //genera el formato RegEx del correo
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // inicia la condicion, trae el valor de la ID correo y lo compara con el formato RegEx
    if (document.getElementById("correo").value.match(mailformat)) {
        //si es igual la comparacion el parrafo se esconde y retorna true
        $("#p_correo").hide();
        document.getElementById("correo").focus();
    } else {
        // si no, se vuelve visible  y muestra el error
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_correo").show();
        $("#p_correo").text(" - Error en el correo. Ej: javier@outlook.com");
        document.getElementById("correo");
    }
    for (var i = 0; i < datos.length; i++) {
        if (document.getElementById("correo").value === datos[i].correos) {
            $("#error-msg").css({
                'display': 'block'
            });
            $("#p_correo_existe").show();
            $("#p_correo_existe").text(" - Error en el correo. Correo ya existe.");
        }
    }
}

function validarPwd() {
    var valor = $("#password").val();
    if (valor.match(/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,}$/)) {
        $("#p_pwd").hide();
        return true;
    } else {
        $("#p_pwd").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_pwd").text(" - Error en la contraseña. Debe contener un mínimo de 6 carácteres, máximo 12 y mínimo un número.");
        return false;
    }
};

// etapa 2

function validarRut() {
    //genera el formato RegEx del correo
    var rutformat = /^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/;
    // inicia la condicion, trae el valor de la ID correo y lo compara con el formato RegEx
    if (document.getElementById("rut").value.match(rutformat)) {
        //si es igual la comparacion el parrafo se esconde y retorna true
        $("#p_rut").hide();
        document.getElementById("rut").focus();
    } else {
        // si no, se vuelve visible  y muestra el error
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_rut").show();
        $("#p_rut").text(" - Error en el RUT. Ej: 12.025.365-6");
        document.getElementById("rut");
    }
    for (var i = 0; i < datos.length; i++) {
        if (document.getElementById("rut").value === datos[i].usuarios) {
            console.log("rut existe")
            $("#error-msg").css({
                'display': 'block'
            });
            $("#p_rut_existe").show();
            $("#p_rut_existe").text(" - Error en el RUT. RUT ya existe.");
        }
    }
};

function validarNombre() {
    var valor = $("#nombre").val();
    var formatoNombre = /^[A-Za-zÁÉÍÓÚñáéíóúÑ]*$/;
    if (valor == "" || valor === undefined || valor === null || valor.length < 3) {
        $("#p_nombre").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_nombre").text(" - Error en el nombre. El nombre debe contener un mínimo \
        de 3 carácteres y un máximo de 20 carácteres. Además, no debe contener números.");
        return false;
    } else if (document.getElementById("nombre").value.match(formatoNombre)) {
        $("#p_nombre").hide();
        document.getElementById("nombre").focus();
        return true;
    } else {
        $("#p_nombre").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_nombre").text(" - Error en el nombre. No debe contener números ni carácteres especiales.");
        return false;
    }
    ;
};

function validarApellidoP() {
    var valor = $("#apellidoPaterno").val();
    var formatoApellidoP = /^[A-Za-zÁÉÍÓÚñáéíóúÑ]*$/;
    if (valor == "" || valor === undefined || valor === null || valor.length < 3) {
        $("#p_apellidop").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_apellidop").text(" - Error en el apellido paterno. El apellido debe contener un mínimo \
        de 3 carácteres y un máximo de 20 carácteres. Además, no debe contener números.");
        return false;
    } else if (document.getElementById("apellidoPaterno").value.match(formatoApellidoP)) {
        $("#p_apellidop").hide();
        document.getElementById("apellidoPaterno").focus();
        return true;
    } else {
        $("#p_apellidop").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_apellidop").text(" - Error en el apellido paterno. No debe contener números ni carácteres especiales.");
        return false;
    }
    ;
};

function validarApellidoM() {
    var valor = $("#apellidoMaterno").val();
    var formatoApellidoM = /^[A-Za-zÁÉÍÓÚñáéíóúÑ]*$/;
    if (valor == "" || valor === undefined || valor === null || valor.length < 3) {
        $("#p_apellidom").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_apellidom").text(" - Error en el apellido materno. El apellido debe contener un mínimo \
        de 3 carácteres y un máximo de 20 carácteres. Además, no debe contener números.");
        return false;
    } else if (document.getElementById("apellidoMaterno").value.match(formatoApellidoM)) {
        $("#p_apellidom").hide();
        document.getElementById("apellidoMaterno").focus();
        return true;
    } else {
        $("#p_apellidom").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_apellidom").text(" - Error en el apellido materno. No debe contener números ni carácteres especiales.");
        return false;
    }
    ;
};

function validarCombobox() {
    var genero = $("#genero").val();
    var regiones = $("#regiones").val();
    var comunas = $("#comunas").val();
    var fecha = $("#fechaNacimiento").val();

    console.log(fecha)
    $("#p_genero").hide();
    $("#p_comuna").hide();
    $("#p_fecha").hide();
    $("#p_region").hide();
    if (genero === "" || genero === null || genero === undefined) {
        $("#p_genero").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_genero").text(" - Error al seleccionar género. Debes seleccionar un género.")
    }
    ;
    if (regiones === "" || regiones === null || regiones === undefined) {
        $("#p_region").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_region").text(" - Error al seleccionar región. Debes seleccionar una región.");
    }
    ;
    if (comunas === "" || comunas === null || comunas === undefined) {
        $("#p_comuna").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_comuna").text(" - Error al seleccionar comuna. Debes seleccionar una comuna.");
    }
    ;
    if (fecha === "" || fecha === null || fecha === undefined) {
        $("#p_fecha").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_fecha").text(" - Error con la fecha de nacimiento. Eliga una fecha válida.");
    }
    ;
}

// validacion numMovil
function validarMovil() {
    var movil = $("#numMovil").val();
    if (movil === "" || movil === undefined || movil === null || movil.length < 8) {
        $("#p_movil").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_movil").text(" - Error en el número móvil. Debe contener un largo de 8 números");
        return false;
    } else {
        $("#p_movil").hide();
        document.getElementById("numMovil").focus();
        return true;
    }
    ;
};

var inputQuantityMov = [];
$(function () {
    $("#numMovil").each(function (i) {
        inputQuantityMov[i] = this.defaultValue;
        $(this).data("idx", i); // save this field's index to access later
    });
    $("#numMovil").on("keyup", function (e) {
        var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index
        //        window.console && console.log($field.is(":invalid"));
        //  $field.is(":invalid") is for Safari, it must be the last to not error in IE8
        if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid")) {
            this.value = inputQuantityMov[$thisIndex];
            return;
        }
        if (val.length > Number($field.attr("maxlength"))) {
            val = val.slice(0, 8);
            $field.val(val);
        }
        inputQuantityMov[$thisIndex] = val;
    });
});

// fin validacion movil

// validar numero fijo

function validarFijo() {
    var nFijo = $("#numFijo").val();
    if (nFijo === "" || nFijo === undefined || nFijo === null || nFijo.length < 8) {
        $("#p_fijo").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_fijo").text(" - Error en el número fijo. Debe contener un largo de 8 números");
        return false;
    } else {
        $("#p_fijo").hide();
        document.getElementById("numFijo").focus();
        return true;
    }
    ;
};

var inputQuantityFijo = [];
$(function () {
    $("#numFijo").each(function (i) {
        inputQuantityFijo[i] = this.defaultValue;
        $(this).data("idx", i); // save this field's index to access later
    });
    $("#numFijo").on("keyup", function (e) {
        var $field = $(this),
            val = this.value,
            $thisIndex = parseInt($field.data("idx"), 10); // retrieve the index
        //        window.console && console.log($field.is(":invalid"));
        //  $field.is(":invalid") is for Safari, it must be the last to not error in IE8
        if (this.validity && this.validity.badInput || isNaN(val) || $field.is(":invalid")) {
            this.value = inputQuantityFijo[$thisIndex];
            return;
        }
        if (val.length > Number($field.attr("maxlength"))) {
            val = val.slice(0, 8);
            $field.val(val);
        }
        inputQuantityFijo[$thisIndex] = val;
    });
});

// fin validar fijo

// validar dirección

function validarDireccion() {
    var v_Direccion = $("#direccion").val();
    if (v_Direccion === "" || v_Direccion === undefined || v_Direccion === null) {
        $("#p_direccion").show();
        $("#error-msg").css({
            'display': 'block'
        });
        $("#p_direccion").text(" - Error en la dirección. Ingrese su dirección.");
        return false;
    } else {
        $("#p_direccion").hide();
        document.getElementById("direccion").focus();
        return true;
    }
    ;
}

// etapa 3

function checkExtranjero() {
    $("#p_pasaporte").hide();
    $("#field_pasaporte").hide();
    var valor;
    if (document.getElementById("extranjero").checked) {
        valor = "si";
    } else {
        valor = "no";
    }

    if (valor == "si") {
        $("#p_pasaporte").show();
        $("#p_pasaporte").text("Debe adjuntar su pasaporte en el siguiente paso.");

        $("#field_pasaporte").show();
    } else if (valor == "no") {
        $("#p_pasaporte").hide();
        $("#field_pasaporte").hide();
    }
}

// función para validar el peso en kb de un documento

Filevalidation = (id) => {
    var fi = document.getElementById(id);
    // Check if any file is selected.
    if (fi.files.length > 0) {
        for (var i = 0; i <= fi.files.length - 1; i++) {

            var fsize = fi.files.item(i).size;
            var file = Math.round((fsize / 1024));
            // The size of the file.
            if (file >= 2048) {
                alert(
                    "Archivo muy pesado, por favor seleccione un archivo de menos de 2 mb.");
                document.getElementById(id).value = '';
            } else if (file < 30) {
                alert(
                    "Archivo muy liviano, por favor seleccione un archivo de más de 30kb.");
                document.getElementById(id).value = '';
            } else {
                /*document.getElementById('size').innerHTML = '<b>'
                + file + '</b> KB'; */
            }
            ;
        }
        ;
    }
    ;
};

function postRegistro() {
    var screen = $("#carga-registro");
    loadingRegistro(screen);
    var formRegistro = $("#formRegistro");
    formRegistro.submit(function (event) {
        event.preventDefault();
        var registroData = new FormData(document.getElementById("formRegistro"));
        var $thisURL = formRegistro.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: registroData,
            success: handleSuccess,
            error: handleError,
            processData: false,
            contentType: false,
        });

        function handleSuccess(data) {
            $('#mensaje_registro').html("¡Hecho!").delay(500).fadeIn('slow');
            $('#mensaje_registro').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            $("#p_usuario_registrado").show();
            $("#error-msg").css({
                'display': 'block'
            });
            $("#p_usuario_registrado").text(" - Error al registrar usuario. El RUT ya existe.");
            console.log(e);
        };
    });
};

function loadingRegistro(screen) {
    $(document).ajaxStart(function () {
        $("#guardar").prop('disabled', true);
        $("#cancelar").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#guardar").prop('disabled', false);
        $("#cancelar").prop('disabled', false);
        screen.fadeOut();
    })
};

function cargaRegiones() {
    $.ajax({
        url: '../getDataCombobox/',
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            $("#genero").jqxComboBox({ // inicializa cbx genero con src
                width: '100%',
                height: '90%',
                source: data.generos,
                displayMember: "titulo",
                valueMember: "id",
                theme: 'material',
                autoItemsHeight: true,
                dropDownHeight: '150px',
                autoComplete: true,
                animationType: 'fade',
                enableBrowserBoundsDetection: true,
            });

            $("#regiones").jqxComboBox({ // set data src para region
                width: '100%',
                height: '90%',
                source: data.regiones,
                displayMember: "titulo",
                valueMember: "id",
                theme: 'material',
                autoItemsHeight: true,
                dropDownHeight: '150px',
                autoComplete: true,
                animationType: 'fade',
                enableBrowserBoundsDetection: true,
            });

            $("#comunas").jqxComboBox({ // inicializa comuna pero con src vacio
                width: '100%',
                height: '90%',
                theme: 'material',
                autoItemsHeight: true,
            });
            $('#regiones').on('select', function (event) // evento click para filtrar comunas por region
            {
                l_comunas = data.comunas;
                console.log(l_comunas)
                var valueRegion = $("#regiones").jqxComboBox('val');
                console.log(valueRegion)
                var srcComunas = l_comunas.filter(l_comunas => l_comunas.id_region === valueRegion)
                console.log(srcComunas)
                $("#comunas").jqxComboBox({ // le da el src filtrado
                    width: '100%',
                    height: '90%',
                    source: srcComunas,
                    displayMember: "titulo",
                    valueMember: "id",
                    theme: 'material',
                    autoItemsHeight: true,
                    dropDownHeight: '150px',
                    autoComplete: true,
                    animationType: 'fade',
                    enableBrowserBoundsDetection: true,
                });
            });
        }
    })
}

function datosExistente() {
    $.ajax({
        url: '../datosExistente/',
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            datos = data;
            ValidateEmail(datos);
            processStepOne(datos);
            validarRut(datos)
            $("#error-msg").hide();
        }
    })
}