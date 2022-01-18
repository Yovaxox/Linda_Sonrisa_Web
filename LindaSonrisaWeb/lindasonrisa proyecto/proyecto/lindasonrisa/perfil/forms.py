from django import forms
from generales.models import Usuario, DocumentoCliente
from django.forms import FileInput


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ('ap_materno', 'fecha_nacimiento', 'fono_fijo', 'fono_movil', 'direccion')


class formFoto(forms.ModelForm):
    class Meta:
        model = Usuario
        fields = ['ruta_foto', 'fono_movil', 'fono_fijo', 'direccion', 'genero_id', 'comuna_id', ]
        widgets = {
            'ruta_foto': FileInput(
                attrs={'id': 'profilePicture', 'name': 'ruta_foto', 'accept': 'image/x-png,image/gif,image/jpeg'}),
            # agrego atributos al field de foto
        }
        labels = {
            'ruta_foto': '',
        }


class formDocumentos(forms.ModelForm):
    class Meta:
        model = DocumentoCliente
        fields = ('ruta',)
