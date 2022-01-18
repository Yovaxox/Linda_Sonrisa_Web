from django.urls import include, path

from perfil.views import Perfil, getDataPerfil, postPersonal, postCorreo, postDocumentos, correoExistente, anularReserva

urlpatterns = [
    path('', Perfil.as_view(), name='perfil'),

    # métodos get
    path('getDataPerfil/', getDataPerfil, name='getDataPerfil'),
    path('correoExistente/', correoExistente, name='correoExistente'),

    # métodos post
    path('postPersonal/', postPersonal, name='postPersonal'),
    path('postCorreo/', postCorreo, name='postCorreo'),
    path('postDocumentos/', postDocumentos, name='postDocumentos'),
    path('postDocumentos/', postDocumentos, name='postDocumentos'),
    path('anularReserva/', anularReserva, name='anularReserva'),

]
