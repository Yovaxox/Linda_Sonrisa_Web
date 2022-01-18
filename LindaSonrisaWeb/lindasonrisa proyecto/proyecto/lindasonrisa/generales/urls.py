from django.urls import include, path
from django.contrib.auth import views as auth_views

from generales.views import Home, Nosotros, Servicios, Convenios, Contacto, Iniciar_sesion, Proceso_reserva, \
    getDataCombobox, postRegistro, Registro, getDataReserva, Reserva_Finalizada, getBoletin, datosExistente

app_name = 'generales'

urlpatterns = [
    path('', Home, name='home'),
    path('nosotros/', Nosotros.as_view(), name='nosotros'),
    path('servicios/', Servicios.as_view(), name='servicios'),
    path('convenios/', Convenios.as_view(), name='convenios'),
    path('contacto/', Contacto, name='contacto'),
    # path('registro/', Registro.as_view(), name='registro'),
    path('registro/', Registro.as_view(), name='registro'),
    path('proceso_reserva/', Proceso_reserva.as_view(), name='proceso_reserva'),
    path('reserva_finalizada/', Reserva_Finalizada.as_view(), name='reserva_finalizada'),

    path('iniciar_sesion/', auth_views.LoginView.as_view(template_name='generales/iniciar_sesion.html'),
         name='iniciar_sesion'),
    path('logout/', auth_views.LogoutView.as_view(template_name='generales/nosotros.html'), name='logout'),

    path('reiniciar_contrasena/',
         auth_views.PasswordResetView.as_view(template_name='registration/password_reset_form.html',
                                              html_email_template_name='registration/password_reset_email.html'),
         name='password_reset'),

    path('postRegistro/', postRegistro, name="postRegistro"),
    #path('postReserva/', postReserva, name="postReserva"),
    path('getDataCombobox/', getDataCombobox, name="getDataCombobox"),
    path('getDataReserva/', getDataReserva, name="getDataReserva"),
    path('getBoletin/', getBoletin, name="getBoletin"),
    path('datosExistente/', datosExistente, name="datosExistente"),
    #path('getMedicos/', getMedicos, name="getMedicos"),


]
