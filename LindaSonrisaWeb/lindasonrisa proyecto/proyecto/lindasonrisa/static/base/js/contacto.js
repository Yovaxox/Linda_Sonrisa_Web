// ajax contacto

$(document).ready(function () { // se encarga de que cuando el documento se ejecute inmediatamente una acción
    var screen = $("#carga-contacto");
    configureLoadingScreen(screen); // le paso un parámetro a la funcion de cargar pantalla
    var formContacto = $("#form_contactanos");
    formContacto.submit(function (event) {
        event.preventDefault(); // cuando apreta un submit, no carga la página
        var contactoData = formContacto.serialize(); // serialize significa que lo transforma en JSON
        var $thisURL = formContacto.attr('data-url') || windows.location.href;
        $.ajax({
            method: 'POST',
            url: $thisURL,
            data: contactoData,
            success: handleSuccess,
            error: handleError
        });

        function handleSuccess(data) {
            formContacto[0].reset()
            $('#mensaje_contacto').html("Hemos recibido tu correo, responderemos a la brevedad.").delay(500).fadeIn('slow');
            $('#mensaje_contacto').delay(3000).fadeOut('slow');
        }

        function handleError(e) {
            console.log(e);
        }
    });
});

function configureLoadingScreen(screen) {
    $(document).ajaxStart(function () {
        $("#enviarContacto").prop('disabled', true);
        screen.fadeIn();
    })
    $(document).ajaxStop(function () {
        $("#enviarContacto").prop('disabled', false);
        screen.fadeOut();
    })
}