from django import forms
from .models import Suscribir, Contacto_Form, Usuario


class formBoletin(forms.ModelForm):
    class Meta:
        model = Suscribir
        fields = ('boletin', 'nombre')


class formContacto(forms.ModelForm):
    class Meta:
        model = Contacto_Form
        fields = ('nombre', 'asunto', 'mensaje')
