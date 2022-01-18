// global //
var medicos = "";
var modulos = "";
// inicialización de functions
$(document).ready(function () {
    cargaData();
    //postReserva();
    getMedicos();
    eventosFlujo();
    convert();
});

//Inicializa controles de horario y calendario
$(document).ready(function () {
    $("#cbxServicio").jqxComboBox({
        width: '100%',
        theme: 'material',
        autoItemsHeight: true,
        dropDownHeight: '150px',
        autoComplete: true,
        animationType: 'fade',
        enableBrowserBoundsDetection: true,
        placeHolder: "Seleccione un servicio",
    });
    $("#cbxMedicos").jqxComboBox({
        width: '100%',
        theme: 'material',
        autoItemsHeight: true,
        dropDownHeight: '150px',
        autoComplete: true,
        animationType: 'fade',
        enableBrowserBoundsDetection: true,
        disabled: true,
        placeHolder: "Seleccione un médico",
    });
    var restrictedDates = [];
    var date = new Date();
    date.setHours(0, 0, 0);
    date.setDate(5, 3);
    restrictedDates.push(date);
    // create jqxcalendar.
    $("#calendario").jqxCalendar({
        width: 250,
        height: 220,
        culture: 'es-ES',
        theme: 'material',
        enableTooltips: true,
        backText: "Atrás",
        forwardText: "Adelante",
        enableWeekend: true,
        disabled: true,
        restrictedDates: restrictedDates // solo para presentar, restringe la fecha
    });




    $("#cbxHorarios").jqxComboBox({
        width: '100%',
        theme: 'material',
        autoItemsHeight: true,
        dropDownHeight: '150px',
        autoComplete: true,
        animationType: 'fade',
        enableBrowserBoundsDetection: true,
        disabled: true,
        placeHolder: "Seleccione una hora",
    });
});

//Loader
$(window).on('load', function () {
    setTimeout(function () {
        $(".loader-page").css({visibility: "hidden", opacity: "0"})
    }, 2000);
});

//Get source servicios
function cargaData() {
    $.ajax({
        url: "../getDataReserva/",
        datatype: 'json',
        type: 'GET',
        success: function (data) {
            console.log(data)
            medicos = data.medicos;
            modulos = data.modulos;
            reservas = data.reservas;
            reservas_prc = data.reservas_prc
            eventosFlujo(medicos, modulos, reservas, reservas_prc);
            $("#cbxServicio").jqxComboBox({
                source: data.serviciosM,
                displayMember: "nombre",
                valueMember: "id",
            });
        }
    })
}

function eventosFlujo() {
    $('#cbxServicio').on('select', function (event) {
        $("#cbxMedicos").jqxComboBox({disabled: true});
        $("#cbxMedicos").jqxComboBox('clearSelection');
        $("#calendario").jqxCalendar({disabled: true});
        $('#calendario').jqxCalendar('clear');
        $("#cbxHorarios").jqxComboBox({disabled: true});
        $("#cbxHorarios").jqxComboBox('clearSelection');
        var id_servicio = $("#cbxServicio").val();
        var jsonMedicos = {};
        var arrMedicos = [];
        for (var i = 0; i < medicos.length; i++) {
            if (id_servicio === medicos[i].servicio_id) {
                jsonMedicos = {
                    "id": medicos[i].id_usuario,
                    "nombre": medicos[i].nombre_usuario
                }
                arrMedicos.push(jsonMedicos);
            }
        }
        var newArrMedicos = [];
        var objectMedicos = {};

        for (var i in arrMedicos) {
            objectMedicos[arrMedicos[i]['nombre']] = arrMedicos[i];
        }

        for (i in objectMedicos) {
            newArrMedicos.push(objectMedicos[i]);
        }
        $("#cbxMedicos").jqxComboBox({
            source: newArrMedicos,
            displayMember: "nombre",
            valueMember: "id",
            disabled: false,
        });
    });

    $('#cbxMedicos').on('select', function (event) {
        $("#calendario").jqxCalendar({disabled: false});
        $('#calendario').jqxCalendar('clear');
        $("#cbxHorarios").jqxComboBox({disabled: true});
        $("#cbxHorarios").jqxComboBox('clearSelection');

        fecha_hoy = fechaActual(today = new Date());
        /*
        Fecha actual
        Idx 0 = YYYY
        Idx 1 = MM
        Idx 2 = DD
        */
        $('#calendario').jqxCalendar('setMinDate', new Date(fecha_hoy[0], fecha_hoy[1], fecha_hoy[2]));
    });
    $('#calendario').on('change', function (event) {
        var dia_id = "";
        var jsonHorarios = {};
        var arrHorarios = [];
        var diasNoDisponible = [];
        var horarios_src = [];
        var horarios_json = {};
        var selected_medico = $("#cbxMedicos").val();
        var selected_servicio = $("#cbxServicio").val();
        $("#cbxHorarios").jqxComboBox({disabled: false});
        $("#cbxHorarios").jqxComboBox('clearSelection');
        var getDate = $("#calendario").datepicker({dateFormat: 'dd/mm/yyyy'}).val();
        var dia = String(getDate).substr(0, 3);
        if (dia === 'Sun') {
            dia_id = 0;
        } else if (dia === 'Mon') {
            dia_id = 1;
        } else if (dia === 'Tue') {
            dia_id = 2;
        } else if (dia === 'Wed') {
            dia_id = 3;
        } else if (dia === 'Thu') {
            dia_id = 4;
        } else if (dia === 'Fri') {
            dia_id = 5;
        } else if (dia === 'Sat') {
            dia_id = 6;
        }
        $("#p_fecha").html(getDate);
        document.getElementById("diaNombre").value = dia_id;
        document.getElementById("dia").value = convert(getDate);
        // ciclo for para armar array de objetos con las horas no disponibles del día elegido
        for (var i = 0; i < reservas_prc.length; i++) {
            if (reservas_prc[i].fecha_reserva.substr(0, 10) === convert(getDate) &&
                reservas_prc[i].usuario_id === selected_medico && reservas_prc[i].servicio_id ===
                selected_servicio) {
                diasNoDisponible.push(reservas_prc[i].hora);
            }
        }
        console.log(diasNoDisponible)
        // ciclo for para traer los horarios disponibles del día elegido (independiente de la semana)
        for (var i = 0; i < modulos.length; i++) {
            if (dia_id === modulos[i].dia_id && selected_medico === modulos[i].usuario_id && selected_servicio === modulos[i].servicio_id) {
                jsonHorarios = {
                    "horario": modulos[i].hora_inicio
                }
                arrHorarios.push(jsonHorarios);
            }
        }

        for (var i = 0; i < arrHorarios.length; i++) {
            for (var j = 0; j < diasNoDisponible.length; j++) {
                if (arrHorarios[i].horario === diasNoDisponible[j]) {
                    arrHorarios.splice(i, 1);
                }
            }
        }

        if (arrHorarios.length <= 0) {
            $("#cbxHorarios").jqxComboBox({disabled: true});
            $("#cbxHorarios").jqxComboBox('clearSelection');
            $("#noDisponible").css({
                'display': 'block'
            });
        } else {
            $("#noDisponible").css({
                'display': 'none'
            });
        }

        $("#cbxHorarios").jqxComboBox({
            source: arrHorarios,
            displayMember: "horario",
            valueMember: "horario",
        });
    });


}

function validarReserva() {
    $("#alertReserva").hide();
    var servicio = $("#cbxServicio").val();
    var medico = $("#cbxMedicos").val();
    var hora = $("#cbxHorarios").val();
    if (servicio === "" || servicio === undefined || servicio === null) {
        $("#alertReserva").show();
        $("#p_servicio").show();
        event.preventDefault();
        $("#cbxServicio").click(function () {
            $("#p_servicio").hide();
        });
    }
    if (medico === "" || medico === undefined || medico === null) {
        $("#alertReserva").show();
        $("#p_medico").show();
        event.preventDefault();
        $("#cbxMedicos").click(function () {
            $("#p_medico").hide();
        });
    }
    if (hora === "" || hora === undefined || hora === null) {
        $("#alertReserva").show();
        $("#p_horario").show();
        event.preventDefault();
        $("#cbxHorarios").click(function () {
            $("#p_horario").hide();
        });
    }
}

//////////////////////////
/*
function postReserva() {
    //var screen = $("#carga-registro");
    //loadingRegistro(screen);
    var formReserva = $("#formReserva");
    formReserva.submit(function (event) {
        console.log("function post")
         //event.preventDefault();
        var reservaData = formReserva.serialize();
        var $thisURL = formReserva.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: reservaData,
            success: handleSuccess,
            error: handleError,
            processData: false,
            contentType: false,
        });

        function handleSuccess(data) {
            //$('#mensaje_registro').html("¡Hecho!").delay(500).fadeIn('slow');
            //$('#mensaje_registro').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        };
    });
};
*/

// FUNCION PARA DAR FORMATO DE FECHA A DATEPICKER
function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

function fechaActual(fecha) {
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = parseInt(yyyy) + ', ' + ((parseInt(mm)) - 1) + ', ' + parseInt(dd);
    return [parseInt(yyyy), ((parseInt(mm)) - 1) , parseInt(dd)];
}