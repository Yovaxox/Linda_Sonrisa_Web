from django.contrib import admin
from generales.models import Suscribir, Contacto_Form, Region, Comuna, Genero, Usuario, \
    Documento, DocumentoCliente


# Register your models here.

class RegionAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo')

    def region_info(self, obj):
        return obj.titulo


class ComunaAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo')

    def comuna_info(self, obj):
        return obj.titulo


class GeneroAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo')

    def genero_info(self, obj):
        return obj.titulo


admin.site.register(Suscribir)
admin.site.register(Contacto_Form)
admin.site.register(Region, RegionAdmin)
admin.site.register(Comuna, ComunaAdmin)
admin.site.register(Genero, GeneroAdmin)
admin.site.register(Usuario)
admin.site.register(Documento)
admin.site.register(DocumentoCliente)
