$(document).ready(function () {
    cargaRegiones();
    cargaPersonal();
    cargaCorreo();
    cargaDocumentos();
    tablaReservas();
    correoExistente();
    cargaAnular();
});

var correos = "";

// validar datos personales

function validarPersonal() {
    $("#alertPersonal").hide();
    var genero = $("#genero").val();
    var numMovil = $("#numMovil").val();
    var numFijo = $("#numFijo").val();
    var region = $("#region").val();
    var comuna = $("#comuna").val();
    var direccion = $("#direccion").val();
    if (genero === "" || genero === undefined || genero === null) {
        $("#alertPersonal").show();
        $("#p_genero").show();
        event.preventDefault();
        $("#genero").click(function () {
            $("#p_genero").hide();
        });
    }
    ;
    if (numMovil === "" || numMovil === undefined || numMovil === null || numMovil.length < 8) {
        $("#alertPersonal").show();
        $("#p_movil").show();
        event.preventDefault();
        $("#numMovil").click(function () {
            $("#p_movil").hide();
        });
    }
    ;
    if (numFijo === "" || numFijo === undefined || numFijo === null || numFijo.length < 8) {
        $("#alertPersonal").show();
        $("#p_fijo").show();
        event.preventDefault();
        $("#numFijo").click(function () {
            $("#p_fijo").hide();
        });
    }
    ;
    if (region === "" || region === undefined || region === null) {
        $("#alertPersonal").show();
        $("#p_region").show();
        event.preventDefault();
        $('#region').on('open', function (event) {
            $("#p_region").hide();
        });
    }
    ;
    if (comuna === "" || comuna === undefined || comuna === null) {
        $("#alertPersonal").show();
        $("#p_comuna").show();
        event.preventDefault();
        $('#comuna').on('open', function (event) {
            $("#p_comuna").hide();
        });
    }
    ;
    if (direccion === "" || direccion === undefined || direccion === null) {
        $("#alertPersonal").show();
        $("#p_direccion").show();
        event.preventDefault();
        $("#direccion").click(function () {
            $("#p_direccion").hide();
        });
    }
    ;
}

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

// validar información de cuenta

function validarCuenta() {
    var correo = $("#correo").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (correo === "" || correo === undefined || correo === null
        || !document.getElementById("correo").value.match(mailformat)) {
        $("#alertCuenta").show();
        $("#p_correo").show();
        event.preventDefault();
        $("#correo").click(function () {
            $("#p_correo").hide();
        });
    }
    for (i = 0; i < correos.length; i++) {
        if (correo === correos[i].correos) {
            $("#alertCuenta").show();
            $("#p_existente").show();
            event.preventDefault();
            $("#correo").click(function () {
                $("#p_correo").hide();
                $("#alertCuenta").hide();
            });
        }
    }
};

// función para validar el peso en kb de un documento

Filevalidation = (id) => {
    var fi = document.getElementById(id);
    var allowedExtensions = /(\.pdf)$/i;
    var documento = $("#" + id).val();
    // Check if any file is selected.
    if (fi.files.length > 0) {
        for (var i = 0; i <= fi.files.length - 1; i++) {

            var fsize = fi.files.item(i).size;
            var file = Math.round((fsize / 1024));
            // The size of the file. 
            if (file >= 2048 || !allowedExtensions.exec(documento)) {
                $("#alertDocumentos").show();
                $("#p_" + id).show();
                document.getElementById(id).value = '';
                $("#" + id).click(function () {
                    $("#alertDocumentos").hide();
                    $("#p_" + id).hide();
                });
            } else if (file < 30 || !allowedExtensions.exec(documento)) {
                $("#p_" + id).show();
                document.getElementById(id).value = '';
                $("#" + id).click(function () {
                    $("#alertDocumentos").hide();
                    $("#p_" + id).hide();
                });
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

// esconder errores (validaciones)

function hideError() {
    $("#alertPersonal").hide();
    $("#alertCuenta").hide();
    $("#alertDocumentos").hide();
};

// get src combobox
var datos = "";
var mis_reservas = "";

function cargaRegiones() {
    $.ajax({
        url: 'getDataPerfil/',
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data)
            mis_reservas = data.l_misreservas;
            tablaReservas(mis_reservas);
            $("#region").jqxComboBox({ // set data src para region
                width: '90%',
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

            $("#comuna").jqxComboBox({ // inicializa comuna pero con src vacio
                width: '90%',
                height: '90%',
                theme: 'material',
                autoItemsHeight: true,
            });
            $('#region').on('select', function (event) // evento click para filtrar comunas por region
            {
                l_comunas = data.comunas;
                var valueRegion = $("#region").jqxComboBox('val');
                var srcComunas = l_comunas.filter(l_comunas => l_comunas.id_region === valueRegion)

                $("#comuna").jqxComboBox({ // le da el src filtrado
                    width: '90%',
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

            if (data.l_usuarios.es_extranjero === true) {
                $("#rowPasaporte").css({
                    'display': 'flex'
                });
            } else {
                $("#rowPasaporte").css({
                    'display': 'none'
                });
            }
            ;
            datos = data;
            setCombobox(datos);
            tablaDocumentos(datos);
        }
    })
}

function setCombobox() {
    $("#genero").jqxComboBox({ // inicializa cbx genero con src
        width: '90%',
        height: '90%',
        source: datos.generos,
        displayMember: "titulo",
        valueMember: "id",
        theme: 'material',
        autoItemsHeight: true,
        dropDownHeight: '150px',
        autoComplete: true,
        animationType: 'fade',
        enableBrowserBoundsDetection: true,
    });
    var info_usuarios = datos.l_usuarios;
    $("#genero").val(info_usuarios.genero);
    $("#region").val(info_usuarios.region);
    $("#comuna").val(info_usuarios.comuna);
}

function tablaDocumentos() {
    console.log(datos.l_documentos)
    for (var i = 0; i < datos.l_documentos.length; i++) {
        table = document.getElementById("tablaDocumentos"); // selecciona a través de la id la tabla
        tRow = document.createElement("tr"); // crea una fila nueva
        tData1 = document.createElement("td"); // crea una celda nueva
        tData2 = document.createElement("td"); // crea una celda nueva
        text1 = document.createTextNode(datos.l_documentos[i].documento); // crea un texto

        aData = document.createElement("a");
        createAText = document.createTextNode("Ver");
        aData.setAttribute('href', "/media/" + datos.l_documentos[i].ruta);
        aData.setAttribute('target', "_blank");
        aData.appendChild(createAText);
        //var text2 = document.createTextNode("media/"+datos.l_documentos[i].ruta);

        tData1.appendChild(text1);
        tData2.appendChild(aData);
        tRow.appendChild(tData1);
        tRow.appendChild(tData2);
        table.appendChild(tRow);
    }
}

$(document).ready(function () {
    $imgSrc = $('#imgProfile').attr('src');

    function readURL(input) {

        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgProfile').attr('src', e.target.result);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    $('#btnChangePicture').on('click', function () {
        // document.getElementById('profilePicture').click();
        if (!$('#btnChangePicture').hasClass('changing')) {
            $('#profilePicture').click();
        } else {
            // change
        }
    });
    $('#profilePicture').on('change', function () {
        readURL(this);

        $('#btnDiscard').removeClass('d-none');
        // $('#imgProfile').attr('src', '');
    });

    $('#btnDiscard').on('click', function () {
        // if ($('#btnDiscard').hasClass('d-none')) {
        $('#btnChangePicture').removeClass('changing');
        $('#btnChangePicture').attr('value', 'Cambiar');
        $('#btnDiscard').addClass('d-none');
        $('#imgProfile').attr('src', $imgSrc);
        $('#profilePicture').val('');
        // }
    });
});

// POST información personal

function cargaPersonal() {
    var screen = $("#carga-personal");
    loadingPersonal(screen);
    var formPersonal = $("#infoPersonalForm");
    formPersonal.submit(function (event) {
        event.preventDefault();
        var personalData = new FormData(document.getElementById("infoPersonalForm"))
        var $thisURL = formPersonal.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: personalData,
            success: handleSuccess,
            error: handleError,
            processData: false,
            contentType: false,
        });

        function handleSuccess(data) {
            $('#mensaje_personal').html("¡Hecho!").delay(500).fadeIn('slow');
            $('#mensaje_personal').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
};

function loadingPersonal(screen) {
    $(document).ajaxStart(function () {
        $("#guardarPersonal").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#guardarPersonal").prop('disabled', false);
        screen.fadeOut();
    })
};

// POST correo

function cargaCorreo() {
    var screen = $("#carga-correo");
    loadingCorreo(screen);
    var formCorreo = $("#infoCuentaForm");
    formCorreo.submit(function (event) {
        event.preventDefault();
        var correoData = formCorreo.serialize();
        var $thisURL = formCorreo.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: correoData,
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(data) {
            $('#mensaje_correo').html("¡Hecho!").delay(500).fadeIn('slow');
            $('#mensaje_correo').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
};

function loadingCorreo(screen) {
    $(document).ajaxStart(function () {
        $("#guardarCorreo").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#guardarCorreo").prop('disabled', false);
        screen.fadeOut();
    })
};

var file = document.getElementById("profilePicture");

function validarFoto() {
    var fileName = file.value,
        idxDot = fileName.lastIndexOf(".") + 1,
        extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png") {
        //validado
    } else {
        alert("Solo se permiten imagenes jpg o png.");
        file.value = "";  // reinicia el input
    }
}

// POST documentos

function cargaDocumentos() {
    var screen = $("#carga-documentos");
    loadingDocumentos(screen);
    var formDocumentos = $("#formDocumentos");
    formDocumentos.submit(function (event) {
        event.preventDefault();
        var documentosData = new FormData(document.getElementById("formDocumentos"));
        var $thisURL = formDocumentos.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: documentosData,
            success: handleSuccess,
            error: handleError,
            processData: false,
            contentType: false,
        });

        function handleSuccess(data) {
            formDocumentos[0].reset()
            $('#mensaje_documentos').html("¡Hecho!").delay(500).fadeIn('slow');
            $('#mensaje_documentos').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
};

function loadingDocumentos(screen) {
    $(document).ajaxStart(function () {
        $("#guardarDocumentos").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#guardarDocumentos").prop('disabled', false);
        screen.fadeOut();
    })
};

// tabla reservas

function tablaReservas() {
    console.log(mis_reservas)
    for (var i = 0; i < mis_reservas.length; i++) {
        table = document.getElementById("tablaReservas"); // selecciona a través de la id la tabla

        tRow = document.createElement("tr"); // crea una fila nueva

        tData1 = document.createElement("td"); // crea una celda nueva
        tData2 = document.createElement("td"); // crea una celda nueva
        tData3 = document.createElement("td"); // crea una celda nueva
        tData4 = document.createElement("td"); // crea una celda nueva
        tData5 = document.createElement("td"); // crea una celda nueva
        tData6 = document.createElement("td"); // crea una celda nueva

        text1 = document.createTextNode(mis_reservas[i].id); // crea un texto
        text2 = document.createTextNode(mis_reservas[i].servicio); // crea un texto
        text3 = document.createTextNode(mis_reservas[i].nombre_medico); // crea un texto
        text4 = document.createTextNode(mis_reservas[i].fecha_reserva.substr(0, 10)); // crea un texto
        text5 = document.createTextNode(mis_reservas[i].hora == "08:00" || mis_reservas[i].hora == "09:00" || mis_reservas[i].hora == "10:00" || mis_reservas[i].hora == "11:00" ? mis_reservas[i].hora + " AM" : mis_reservas[i].hora + " PM"); // crea un texto
        text6 = document.createTextNode("N° " + mis_reservas[i].box); // crea un texto


        /*aData = document.createElement("input");
        aData.setAttribute('value', 'Ver reserva')
        aData.setAttribute('type', 'button')*/

        tData1.appendChild(text1);
        tData2.appendChild(text2);
        tData3.appendChild(text3);
        tData4.appendChild(text4);
        tData5.appendChild(text5);
        tData6.appendChild(text6);

        tRow.appendChild(tData1);
        tRow.appendChild(tData2);
        tRow.appendChild(tData3);
        tRow.appendChild(tData4);
        tRow.appendChild(tData5);
        tRow.appendChild(tData6);

        table.appendChild(tRow);
    }
}

function correoExistente() {
    $.ajax({
        url: 'correoExistente/',
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data);
            correos = data;
            validarCuenta(correos);
            $("#alertCuenta").hide();
        }
    })
}

/*function show_confirm() {
    var r = confirm("¿Estás seguro que deseas anular la reserva?");
    if (r == true) {
        document.getElementById("anularForm").submit();
    }
}*/


//POST ANULAR

function cargaAnular() {
    var screen = $("#carga-anular");
    loadingAnular(screen);
    var formAnular = $("#anularForm");
    formAnular.submit(function (event) {
        event.preventDefault();
        var anularData = formAnular.serialize();
        var $thisURL = formAnular.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: anularData,
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(data) {
            //console.log(data);
            $('#mensaje_anular').html("¡Hecho! La página se refrescará en unos segundos para aplicar el cambio..").delay(500).fadeIn('slow');
            $('#mensaje_anular').delay(6000).fadeOut('slow');
            setTimeout(function() {
              window.location.href = "/perfil";
            }, 4000);
        }

        function handleError(e) {
            console.log(e);
        };
    });
};

function loadingAnular(screen) {
    $(document).ajaxStart(function () {
        $("#anularReserva").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#anularReserva").prop('disabled', false);
        screen.fadeOut();
    })
};