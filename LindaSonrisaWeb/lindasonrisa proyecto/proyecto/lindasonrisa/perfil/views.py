from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect

from django.contrib.auth.mixins import LoginRequiredMixin

from django.views import generic
from generales.models import Region, Comuna, Genero, Usuario, User, DocumentoCliente, Reserva
from django.core import serializers

from django.db import connection
import cx_Oracle
from django.template import loader

from .forms import formFoto, formDocumentos
from datetime import datetime
from django.utils.datastructures import MultiValueDictKeyError
from django.core.exceptions import ObjectDoesNotExist
import datetime


# Create your views here.
# Generando template views de las páginas
class Perfil(LoginRequiredMixin, generic.TemplateView):
    template_name = 'perfil/perfil.html'
    login_url = 'generales:iniciar_sesion'

    def get_context_data(self,
                         **kwargs):  # en esta definicion se agrega un contexto al templateview, permitiendo asi
        # poder modificar el contexto que retorna la clase creada
        context = super(Perfil, self).get_context_data(
            **kwargs)  # le indica que de la vista misma modifique el contexto
        context[
            'form'] = formFoto()  # crea un contexto llamado form la cual contiene los fields del formulario formFoto
        return context  # retorna el contexto hacia la clase anterior y lo lleva a la pagina


def getDataPerfil(request):
    if request.method == 'GET':
        user_id = request.user
        # STOCK PROCEDURE PARA OBTENER ID DEL USUARIO #
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(int)
        resultIdUser = cursor.callproc("sp_usuario_id", [user_id.id, out_args])[1]

        user = User.objects.get(username=request.user.username)
        # CONEXION
        d_cursor = connection.cursor()  # se crea la variable d_cursor y le pasa como valor la conexión a la base de
        # datos para que pueda realizar QUERYS
        cursor = d_cursor.connection.cursor()  # crea la variable cursor donde le indico el valor de la conexion más
        # la propiedad .connection.cursor()
        out_args = cursor.var(
            cx_Oracle.CURSOR)  # se crea la variable out_args que le paso como valor el TIPO DE DATO cursor,
        # es decir, cursor es un arrayList[]
        result = cursor.callproc("sp_usuario", [str(user), out_args])[
            1]  # en la varpiable result le pasamos el valor de cursor donde le agregamos la propiedad callproc() para
        # llamar a un procedimiento almacenado de la BD  \ Además, dentro del paréntesis van estos parámetros (
        # "NOMBRE DEL PROCEDURE", [LOS PARAMETROS IN, OUT])[I] // DONDE [I] ES UN INDICE O INDEX
        l_usuarios = []  # VARIABLE TIPO LISTA
        for line in result:  # INICIAR UN FOR
            l_usuarios = {
                "nombre": line[0],
                "primer_apellido": line[1],
                "segundo_apellido": line[2],
                "genero": line[3],
                "fecha_nacimiento": line[4],
                "fono_fijo": line[5],
                "fono_movil": line[6],
                "region": line[7],
                "comuna": line[8],
                "direccion": line[9],
                "es_extranjero": True if line[10] == 1 else False
            }
            pass
        # Cursor documentos
        docu_cursor = connection.cursor()
        cursor_docu = docu_cursor.connection.cursor()
        args_docu = cursor_docu.var(cx_Oracle.CURSOR)
        documentos = cursor_docu.callproc("sp_documentos", [str(user), args_docu])[1]
        l_documentos = []
        for d in documentos:
            l_documentos.append({"id": d[0], "ruta": d[1], "documento": d[2]})
            pass
        # Info region
        regionList = Region.objects.all()
        regiones = []
        for r in regionList:
            regiones.append({"id": r.id, "titulo": r.titulo})
            pass
        # Info comunas
        comunaList = Comuna.objects.all()
        comunas = []
        for c in comunaList:
            comunas.append({"id": c.id, "titulo": c.titulo, "id_region": c.region_id})
            pass
        # Info genero
        generoList = Genero.objects.all()
        generos = []
        for g in generoList:
            generos.append({"id": g.id, "titulo": g.titulo})
            pass
        # Procedure misreservas
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(cx_Oracle.CURSOR)
        resultMisReservas = cursor.callproc("sp_misreservas", [resultIdUser, out_args])[1]
        l_misreservas = []
        for mr in resultMisReservas:
            l_misreservas.append({"solicitado_el": mr[0],
                                  "fue_anulada": mr[1],
                                  "fecha_reserva": mr[2],
                                  "fecha_anulacion": mr[3],
                                  "fecha_modificacion": mr[4],
                                  "hora": mr[5],
                                  "box": mr[6],
                                  "servicio": mr[7],
                                  "nombre_medico": mr[8],
                                  "id": mr[9]
                                  })
            pass
        # JSON
        lista = ({"regiones": regiones, "comunas": comunas, "generos": generos, "l_usuarios": l_usuarios,
                  "l_documentos": l_documentos, "l_misreservas": l_misreservas})
        return JsonResponse(lista, safe=False)


def postPersonal(request):
    if request.method == 'POST':
        current_user = request.user
        user = Usuario.objects.get(user_id=current_user.id)
        form = formFoto(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
        if request.is_ajax():
            data = {
                'message': 'form is saved'
            }
            return JsonResponse(data)


def postCorreo(request):
    if request.method == 'POST':
        # variables
        correo = request.POST.get('correo')
        # actualizado = datetime.now()
        # id del usuario
        current_user = request.user
        # conexion a procedure
        correo_cursor = connection.cursor()
        cursor_correo = correo_cursor.connection.cursor()
        cursor_correo.callproc("sp_correo", (int(current_user.id), str(correo)))
        # respuesta a ajax
        if request.is_ajax():
            data = {
                'message': 'form is saved'
            }
            return JsonResponse(data)


def validateDocument(user_id, pk_doc):
    consult = DocumentoCliente.objects.filter(usuario_id=user_id, documento_id=pk_doc)
    if consult.exists():
        return consult[0]
    obj = DocumentoCliente()
    obj.documento_id = pk_doc
    return obj


def postDocumentos(request):
    if request.method == 'POST':
        user = request.user
        # STOCK PROCEDURE PARA OBTENER ID DEL USUARIO #
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(int)
        resultIdUser = cursor.callproc("sp_usuario_id", [user.id, out_args])[1]
        ####
        if 'afp' in request.FILES:
            doc_cli = validateDocument(user_id=resultIdUser, pk_doc=1)
            # doc_cli.documento_id = 1
            doc_cli.usuario_id = resultIdUser
            doc_cli.ruta = request.FILES['afp']
            doc_cli.save()
        if 'liquidacion' in request.FILES:
            doc_cli = validateDocument(user_id=user.id, pk_doc=2)
            # doc_cli.documento_id = 2
            doc_cli.usuario_id = resultIdUser
            doc_cli.ruta = request.FILES['liquidacion']
            doc_cli.save()
        if 'finiquito' in request.FILES:
            doc_cli = validateDocument(user_id=user.id, pk_doc=3)
            # doc_cli.documento_id = 3
            doc_cli.usuario_id = resultIdUser
            doc_cli.ruta = request.FILES['finiquito']
            doc_cli.save()
        if 'salud' in request.FILES:
            doc_cli = validateDocument(user_id=user.id, pk_doc=4)
            # doc_cli.documento_id = 4
            doc_cli.usuario_id = resultIdUser
            doc_cli.ruta = request.FILES['salud']
            doc_cli.save()
        if 'pasaporte' in request.FILES:
            doc_cli = validateDocument(user_id=user.id, pk_doc=5)
            # doc_cli.documento_id = 5
            doc_cli.usuario_id = resultIdUser
            doc_cli.ruta = request.FILES['pasaporte']
            doc_cli.save()
        if request.is_ajax():
            data = {
                'message': 'form is saved'
            }
            return JsonResponse(data)


def correoExistente(request):
    if request.method == 'GET':
        correos_existentes = User.objects.all()
        l_correo_existente = []
        for c in correos_existentes:
            l_correo_existente.append({"correos": c.email})
            pass
        return JsonResponse(l_correo_existente, safe=False)


def usuarioId(id):
    d_cursor = connection.cursor()
    cursor = d_cursor.connection.cursor()
    out_args = cursor.var(int)
    resultIdUser = cursor.callproc("sp_usuario_id", [id, out_args])[1]
    return resultIdUser


def anularReserva(request):
    if request.method == 'POST':
        print(request.POST.get)
        codigo = request.POST.get('codigo_reserva')
        user = request.user
        user_id = usuarioId(user.id)
        now = datetime.datetime.now()
        print(user_id)
        Reserva.objects.filter(id=codigo, usuario_id=user_id).update(fue_anulada="1", fecha_anulacion=now)
        if request.is_ajax():
            data = {
                'message': 'form is saved'
            }
            return JsonResponse(data)
