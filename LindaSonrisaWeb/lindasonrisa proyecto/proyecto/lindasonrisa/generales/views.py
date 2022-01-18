from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.views import generic
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Suscribir, Contacto_Form, Region, Comuna, Genero, User, Usuario, DocumentoCliente, Servicio, Modulo, \
    Reserva, Suscribir, Proveedor, AspNetUser, AspNetUserRole, AspNetRole
from .forms import formBoletin, formContacto
from django.http import JsonResponse

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.db import connection
import cx_Oracle
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def send_email(mail, nombre):
    context = {'nombre': nombre}
    template = get_template('correos/boletin.html')
    content = template.render(context)
    email = EmailMultiAlternatives(
        '¡Gracias por suscribirte a Linda Sonrisa!',
        'Linda Sonrisa',
        settings.EMAIL_HOST_USER,
        [mail]
    )
    email.attach_alternative(content, 'text/html')
    email.send()


def Home(request):
    lista = []
    if request.method == 'POST':
        mail = request.POST.get('boletin')
        nombre = request.POST.get('nombre')
        for idx, e in enumerate(Suscribir.objects.all()):
            lista.append(e.boletin)
            pass
        if mail in lista:
            return render(request, 'generales/home.html', {})
        else:
            print("no existe el correo:", mail)
        send_email(mail, nombre)
    if request.is_ajax():
        form = formBoletin(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = request.user
            instance.save()
            data = {
                'message': 'form is saved'
            }
            return JsonResponse(data)

    return render(request, 'generales/home.html', {})


def email_contacto(nombre, asunto, mensaje):
    context = {'nombre': nombre, 'asunto': asunto, 'mensaje': mensaje}
    template = get_template('correos/contactar.html')
    content = template.render(context)
    email = EmailMultiAlternatives(
        asunto,
        nombre,
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER]
    )
    email.attach_alternative(content, 'text/html')
    email.send()


def Contacto(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        asunto = request.POST.get('asunto')
        mensaje = request.POST.get('mensaje')
        email_contacto(nombre, asunto, mensaje)
    if request.is_ajax():
        form = formContacto(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = request.user
            instance.save()
            data = {
                'mensaje': 'el correo ha sido enviado'
            }
            return JsonResponse(data)
    return render(request, 'generales/contacto.html', {})


class Nosotros(generic.TemplateView):
    template_name = 'generales/nosotros.html'

    def get_context_data(self, **kwargs):
        clientes_satisfechos = Reserva.objects.count()
        servicios = Servicio.objects.count()
        proveedores = Proveedor.objects.count()
        context = super().get_context_data(**kwargs)
        #context['contador'] = Servicio.objects.all()
        context = {
            "clientes": clientes_satisfechos,
            "servicios": servicios,
            "proveedores": proveedores
        }
        return context


class Servicios(generic.ListView):
    paginate_by = 3
    model = Servicio
    template_name = 'generales/servicios.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['servicios'] = Servicio.objects.all()
        return context


class Convenios(generic.TemplateView):
    template_name = 'generales/convenios.html'


class Iniciar_sesion(generic.TemplateView):
    template_name = 'generales/iniciar_sesion.html'


class Registro(generic.TemplateView):
    template_name = 'generales/registro.html'


class Reserva_Finalizada(generic.TemplateView):
    template_name = 'generales/reserva_finalizada.html'


class Proceso_reserva(LoginRequiredMixin, generic.TemplateView):
    template_name = 'generales/proceso_reserva.html'
    login_url = 'generales:iniciar_sesion'

    def post(self, request):
        user = request.user
        servicio = request.POST.get('servicio')
        medico = request.POST.get('medico')
        horarios = request.POST.get('horarios')
        diaNombre = request.POST.get('diaNombre')
        # STOCK PROCEDURE PARA OBTENER ID DEL USUARIO #
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(int)
        resultIdUser = cursor.callproc("sp_usuario_id", [user.id, out_args])[1]
        ####
        # STOCK PROCEDURE PARA OBTENER ID DEL MODULO #
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(int)
        resultIdModulo = cursor.callproc("sp_modulo_id", [servicio, medico, horarios, diaNombre, out_args])[4]
        ###
        fue_anulada = 0
        fecha_reserva = request.POST.get('dia')
        hora = request.POST.get('horarios')
        usuario_id = resultIdUser
        reserva = Reserva(fue_anulada=fue_anulada, fecha_reserva=fecha_reserva, modulo_id=resultIdModulo,
                          usuario_id=usuario_id, hora=hora)
        reserva.save()
        return HttpResponseRedirect("../reserva_finalizada")
        # return render(request, self.template_name)


def insertDocumentos(ruta, tipo_doc, usuario_id):
    documents = DocumentoCliente(ruta=ruta, documento_id=tipo_doc, usuario_id=usuario_id)
    return documents


def postRegistro(request):
    if request.method == 'POST':
        es_extranjero = request.POST.get('extranjero')
        if es_extranjero == "on":
            es_extranjero = 1
        else:
            es_extranjero = 0
        username = request.POST.get('rut')
        pwd = request.POST.get('password')
        correo = request.POST.get('correo')
        user = User.objects.create_user(username=username, password=pwd, email=correo)
        user.save()

        id_user = user.id
        nombre = request.POST.get('nombre')
        p_apellido = request.POST.get('apellidoPaterno')
        p_materno = request.POST.get('apellidoMaterno')
        fecha_nacimiento = request.POST.get('fecha_nacimiento')
        fono_fijo = request.POST.get('numFijo')
        fono_movil = request.POST.get('numMovil')
        direccion = request.POST.get('direccion')
        id_genero = request.POST.get('genero_id')
        id_comuna = request.POST.get('comuna_id')
        user_extend = Usuario(nombre=nombre, ap_paterno=p_apellido, ap_materno=p_materno,
                              fecha_nacimiento=fecha_nacimiento, fono_fijo=fono_fijo,
                              fono_movil=fono_movil, direccion=direccion,
                              genero_id=id_genero, comuna_id=id_comuna, user_id=id_user, es_extranjero=es_extranjero)
        user_extend.save()

        id_user_extend = user_extend.id
        if 'afp' in request.FILES:
            docs = insertDocumentos(ruta=request.FILES['afp'], tipo_doc=1, usuario_id=id_user_extend)
            docs.save()
        if 'liquidaciones' in request.FILES:
            docs = insertDocumentos(ruta=request.FILES['liquidaciones'], tipo_doc=2, usuario_id=id_user_extend)
            docs.save()
        if 'finiquitos' in request.FILES:
            docs = insertDocumentos(ruta=request.FILES['finiquitos'], tipo_doc=3, usuario_id=id_user_extend)
            docs.save()
        if 'salud' in request.FILES:
            docs = insertDocumentos(ruta=request.FILES['salud'], tipo_doc=4, usuario_id=id_user_extend)
            docs.save()
        if 'c_pasaporte' in request.FILES:
            docs = insertDocumentos(ruta=request.FILES['c_pasaporte'], tipo_doc=5, usuario_id=id_user_extend)
            docs.save()
        if request.is_ajax():
            data = {
                'mensaje': 'datos guardados'
            }
            return JsonResponse(data)


def getDataCombobox(request):
    if request.method == 'GET':
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
        lista = ({"regiones": regiones, "comunas": comunas, "generos": generos})
        return JsonResponse(lista, safe=False)


def getDataReserva(request):
    if request.method == 'GET':
        moduloList = Modulo.objects.all().filter(disponible=1).order_by('hora_inicio')
        modulos = []
        for m in moduloList:
            modulos.append({
                "id": m.id,
                "hora_inicio": m.hora_inicio,
                "hora_termino": m.hora_termino,
                "box": m.box,
                "disponible": m.disponible,
                "dia_id": m.dia_id,
                "servicio_id": m.servicio_id,
                "usuario_id": m.usuario_id
            })
        # Procedure servicios
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(cx_Oracle.CURSOR)
        resultServicios = cursor.callproc("sp_servicios", [out_args])[0]
        l_servicios = []
        for l in resultServicios:
            l_servicios.append({"id": l[0], "nombre": l[1]})
            pass
        # Procedure medicos
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(cx_Oracle.CURSOR)
        resultMedicos = cursor.callproc("sp_medicos_nuevo", [out_args])[0]
        l_medicos = []
        for m in resultMedicos:
            l_medicos.append({"id": m[0],
                              "servicio_id": m[1],
                              "nombre_servicio": m[2],
                              "id_usuario": m[3],
                              "nombre_usuario": m[4]
                              })
            pass
        # Procedure reservas
        d_cursor = connection.cursor()
        cursor = d_cursor.connection.cursor()
        out_args = cursor.var(cx_Oracle.CURSOR)
        resultReservas = cursor.callproc("sp_reserva", [out_args])[0]
        l_reservas_prc = []
        for r in resultReservas:
            l_reservas_prc.append({"fecha_reserva": r[0],
                                   "modulo_id": r[1],
                                   "hora": r[2],
                                   "servicio_id": r[4],
                                   "usuario_id": r[5]
                                   })
            pass
        reservaList = Reserva.objects.all()
        l_reservas = []
        for r in reservaList:
            l_reservas.append({"id": r.id,
                               "solicitado_el": r.solicitado_el,
                               "fue_anulada": r.fue_anulada,
                               "fecha_reserva": r.fecha_reserva,
                               "fecha_anulacion": r.fecha_anulacion,
                               "fecha_modificacion": r.fecha_modificacion,
                               "modulo_id": r.modulo_id,
                               "usuario_id": r.usuario_id,
                               "hora": r.hora})
            pass
        listaReserva = ({"modulos": modulos, "medicos": l_medicos, "serviciosM": l_servicios, "reservas": l_reservas,
                         "reservas_prc": l_reservas_prc})
        return JsonResponse(listaReserva, safe=False)


def getBoletin(request):
    if request.method == 'GET':
        correos_boletin = Suscribir.objects.all()
        l_boletin = []
        for b in correos_boletin:
            l_boletin.append({"correos": b.boletin})
            pass
        return JsonResponse(l_boletin, safe=False)


def datosExistente(request):
    if request.method == 'GET':
        datos_existentes = User.objects.all()
        l_existentes = []
        for d in datos_existentes:
            l_existentes.append({"correos": d.email,
                                 "usuarios": d.username})
            pass
        return JsonResponse(l_existentes, safe=False)