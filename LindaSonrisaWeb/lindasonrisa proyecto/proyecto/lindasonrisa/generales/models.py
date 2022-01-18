# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User


class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)
    password = models.CharField(max_length=128, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AspNetRoleClaim(models.Model):
    id = models.IntegerField(primary_key=True)
    role = models.ForeignKey('AspNetRole', models.DO_NOTHING)
    claim_type = models.CharField(max_length=2000, blank=True, null=True)
    claim_value = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        db_table = 'asp_net_role_claim'


class AspNetRole(models.Model):
    id = models.CharField(primary_key=True, max_length=450)
    name = models.CharField(max_length=256, blank=True, null=True)
    normalized_name = models.CharField(max_length=256, blank=True, null=True)
    concurrency_stamp = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        db_table = 'asp_net_role'


class AspNetUserClaim(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey('AspNetUser', models.DO_NOTHING)
    claim_type = models.CharField(max_length=2000, blank=True, null=True)
    claim_value = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        db_table = 'asp_net_user_claim'


class AspNetUserLogin(models.Model):
    login_provider = models.CharField(primary_key=True, max_length=128)
    provider_key = models.CharField(max_length=128)
    provider_display_name = models.CharField(max_length=2000, blank=True, null=True)
    user = models.ForeignKey('AspNetUser', models.DO_NOTHING)

    class Meta:
        db_table = 'asp_net_user_login'
        unique_together = (('login_provider', 'provider_key'),)


class AspNetUserRole(models.Model):
    user = models.OneToOneField('AspNetUser', models.DO_NOTHING, primary_key=True)
    role = models.ForeignKey(AspNetRole, models.DO_NOTHING)

    class Meta:
        db_table = 'asp_net_user_role'
        unique_together = (('user', 'role'),)


class AspNetUserToken(models.Model):
    user = models.OneToOneField('AspNetUser', models.DO_NOTHING, primary_key=True)
    login_provider = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    value = models.CharField(max_length=2000, blank=True, null=True)

    class Meta:
        db_table = 'asp_net_user_token'
        unique_together = (('user', 'login_provider', 'name'),)


class AspNetUser(models.Model):
    id = models.CharField(primary_key=True, max_length=450)
    user_name = models.CharField(max_length=256, blank=True, null=True)
    normalized_user_name = models.CharField(max_length=256, blank=True, null=True)
    email = models.CharField(max_length=256, blank=True, null=True)
    normalized_email = models.CharField(max_length=256, blank=True, null=True)
    email_confirmed = models.BooleanField()
    password_hash = models.CharField(max_length=2000, blank=True, null=True)
    security_stamp = models.CharField(max_length=2000, blank=True, null=True)
    concurrency_stamp = models.CharField(max_length=2000, blank=True, null=True)
    phone_number = models.CharField(max_length=2000, blank=True, null=True)
    phone_number_confirmed = models.BooleanField()
    two_factor_enabled = models.BooleanField()
    lockout_end = models.DateTimeField(blank=True, null=True)
    lockout_enabled = models.BooleanField()
    access_failed_count = models.IntegerField()

    class Meta:
        db_table = 'asp_net_user'


class Boleta(models.Model):
    id = models.IntegerField(primary_key=True)
    creado_el = models.DateField()
    terminado_el = models.DateField(blank=True, null=True)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)

    class Meta:
        db_table = 'boleta'


class Comuna(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)
    region = models.ForeignKey('Region', models.DO_NOTHING)

    class Meta:
        db_table = 'comuna'


class Contacto(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    ap_paterno = models.CharField(max_length=50, blank=True, null=True)
    ap_materno = models.CharField(max_length=50, blank=True, null=True)
    fono_movil = models.CharField(max_length=8)
    email = models.CharField(max_length=50, blank=True, null=True)
    proveedor = models.ForeignKey('Proveedor', models.DO_NOTHING)

    class Meta:
        db_table = 'contacto'


class Cotizacion(models.Model):
    id = models.IntegerField(primary_key=True)
    creado_el = models.DateField()
    total_producto = models.BigIntegerField(blank=True, null=True)
    total_servicio = models.BigIntegerField()
    es_aceptada = models.CharField(max_length=1)
    boleta = models.ForeignKey(Boleta, models.DO_NOTHING)

    class Meta:
        db_table = 'cotizacion'


class Dia(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=25)

    class Meta:
        db_table = 'dia'


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class Documento(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)

    class Meta:
        db_table = 'documento'


class DocumentoCliente(models.Model):
    ruta = models.FileField(upload_to='documentos', max_length=100)
    creado_el = models.DateTimeField(auto_now_add=True)
    actualizado_el = models.DateTimeField(auto_now=True)
    documento = models.ForeignKey(Documento, models.DO_NOTHING)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)

    class Meta:
        db_table = 'documento_cliente'


class EfMigrationHistory(models.Model):
    id = models.CharField(primary_key=True, max_length=150)
    product_version = models.CharField(max_length=32)

    class Meta:
        db_table = 'ef_migration_history'


class EstadoCivil(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=25)

    class Meta:
        db_table = 'estado_civil'


class EstadoServicio(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)

    class Meta:
        db_table = 'estado_servicio'


class FamiliaProducto(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=50)
    titulo_normalizado = models.CharField(max_length=50)

    class Meta:
        db_table = 'familia_producto'


class Genero(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=25)

    class Meta:
        db_table = 'genero'


class MetodoPago(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)

    class Meta:
        db_table = 'metodo_pago'


class Modulo(models.Model):
    id = models.IntegerField(primary_key=True)
    hora_inicio = models.CharField(max_length=20)
    hora_termino = models.CharField(max_length=20)
    box = models.BigIntegerField()
    disponible = models.CharField(max_length=1)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)
    servicio = models.ForeignKey('Servicio', models.DO_NOTHING)
    dia = models.ForeignKey(Dia, models.DO_NOTHING)

    class Meta:
        db_table = 'modulo'


class Orden(models.Model):
    id = models.IntegerField(primary_key=True)
    solicitado_el = models.DateTimeField()
    actualizado_el = models.DateTimeField()
    fue_recepcionado = models.BooleanField()

    class Meta:
        db_table = 'orden'


class Pago(models.Model):
    id = models.IntegerField(primary_key=True)
    pagado_el = models.DateField()
    metodo_pago = models.ForeignKey(MetodoPago, models.DO_NOTHING)
    cotizacion = models.ForeignKey(Cotizacion, models.DO_NOTHING)

    class Meta:
        db_table = 'pago'


class Producto(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=50)
    titulo_normalizado = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=250)
    stock_critico = models.BigIntegerField()
    es_promocion = models.CharField(max_length=1)
    descuento = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    comentario = models.CharField(max_length=250, blank=True, null=True)
    esta_inactivo = models.BooleanField()
    file_id = models.CharField(max_length=250)
    proveedor = models.ForeignKey('Proveedor', models.DO_NOTHING)
    tipo_producto = models.ForeignKey('TipoProducto', models.DO_NOTHING)

    class Meta:
        db_table = 'producto'


class ProductoOrden(models.Model):
    id = models.IntegerField(primary_key=True)
    cantidad = models.BigIntegerField()
    sub_total = models.BigIntegerField()
    orden = models.ForeignKey(Orden, models.DO_NOTHING)
    producto = models.ForeignKey(Producto, models.DO_NOTHING)

    class Meta:
        db_table = 'producto_orden'


class ProductoServicio(models.Model):
    id = models.IntegerField(primary_key=True)
    producto = models.ForeignKey(Producto, models.DO_NOTHING)
    servicio = models.ForeignKey('Servicio', models.DO_NOTHING)

    class Meta:
        db_table = 'producto_servicio'


class Proveedor(models.Model):
    id = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=50)
    nombre_normalizado = models.CharField(max_length=50)
    fono_fijo = models.CharField(max_length=8)
    fono_movil = models.CharField(max_length=8, blank=True, null=True)
    email = models.CharField(max_length=50)
    url = models.CharField(max_length=50, blank=True, null=True)
    comentario = models.CharField(max_length=250, blank=True, null=True)
    esta_inactivo = models.BooleanField()
    rubro = models.ForeignKey('Rubro', models.DO_NOTHING)

    class Meta:
        db_table = 'proveedor'


class Region(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)

    class Meta:
        db_table = 'region'


class RegistroServicio(models.Model):
    id = models.IntegerField(primary_key=True)
    iniciado_el = models.DateField(blank=True, null=True)
    realizado_el = models.DateField(blank=True, null=True)
    es_principal = models.CharField(max_length=1)
    servicio = models.ForeignKey('Servicio', models.DO_NOTHING)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING, blank=True, null=True)
    estado_servicio = models.ForeignKey(EstadoServicio, models.DO_NOTHING)
    boleta = models.ForeignKey(Boleta, models.DO_NOTHING)

    class Meta:
        db_table = 'registro_servicio'


class RelServicio(models.Model):
    id = models.IntegerField(primary_key=True)
    servicio = models.ForeignKey('Servicio', models.DO_NOTHING)
    servicio_id2 = models.ForeignKey('Servicio', models.DO_NOTHING, db_column='servicio_id2', related_name='relacion_2')

    class Meta:
        db_table = 'rel_servicio'


class Reserva(models.Model):
    id = models.IntegerField(primary_key=True)
    solicitado_el = models.DateTimeField(auto_now_add=True, blank=True, null=True)  # equivalente a creado el
    fue_anulada = models.CharField(max_length=1)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)
    modulo = models.ForeignKey(Modulo, models.DO_NOTHING)
    fecha_reserva = models.DateField()
    fecha_anulacion = models.DateTimeField(blank=True, null=True)
    fecha_modificacion = models.DateTimeField(auto_now=True, blank=True, null=True)
    hora = models.CharField(max_length=20)

    class Meta:
        db_table = 'reserva'


class RolOrden(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=45)

    class Meta:
        db_table = 'rol_orden'


class Rubro(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=100)

    class Meta:
        db_table = 'rubro'


class Servicio(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=50)
    titulo_normalizado = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=2000)
    precio = models.BigIntegerField()
    esta_inactivo = models.CharField(max_length=1)
    es_promocion = models.CharField(max_length=1)
    descuento = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    comentario = models.CharField(max_length=250, blank=True, null=True)
    file_id = models.CharField(max_length=250, blank=True, null=True)

    class Meta:
        db_table = 'servicio'


class TipoProducto(models.Model):
    id = models.IntegerField(primary_key=True)
    titulo = models.CharField(max_length=50)
    titulo_normalizado = models.CharField(max_length=50)
    familia_producto = models.ForeignKey(FamiliaProducto, models.DO_NOTHING)

    class Meta:
        db_table = 'tipo_producto'


class UsoProducto(models.Model):
    id = models.IntegerField(primary_key=True)
    cantidad_prevista = models.BigIntegerField()
    sub_total_previsto = models.BigIntegerField()
    cantidad_real = models.BigIntegerField(blank=True, null=True)
    sub_total_real = models.BigIntegerField(blank=True, null=True)
    producto = models.ForeignKey(Producto, models.DO_NOTHING)
    registro_servicio = models.ForeignKey(RegistroServicio, models.DO_NOTHING)

    class Meta:
        db_table = 'uso_producto'


class Usuario(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    nombre = models.CharField(max_length=50)
    ap_paterno = models.CharField(max_length=50)
    ap_materno = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    fono_fijo = models.CharField(max_length=8, blank=True, null=True)
    fono_movil = models.CharField(max_length=8, blank=True, null=True)
    direccion = models.CharField(max_length=50, blank=True, null=True)
    ruta_foto = models.ImageField(upload_to='foto_perfil', default='foto_perfil/default.png', blank=True)
    creado_el = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    actualizado_el = models.DateTimeField(auto_now=True, blank=True, null=True)
    es_extranjero = models.BooleanField()
    comuna_id = models.BigIntegerField()
    genero_id = models.BigIntegerField()
    estado_civil = models.ForeignKey(EstadoCivil, models.DO_NOTHING, blank=True, null=True)
    asp_net_user = models.ForeignKey(AspNetUser, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        db_table = 'usuario'

    def __str__(self):
        return self.user.username


class UsuarioOrden(models.Model):
    id = models.IntegerField(primary_key=True)
    registrado_el = models.DateField()
    rol_orden = models.ForeignKey(RolOrden, models.DO_NOTHING)
    usuario = models.ForeignKey(Usuario, models.DO_NOTHING)
    orden = models.ForeignKey(Orden, models.DO_NOTHING)

    class Meta:
        db_table = 'usuario_orden'


class Suscribir(models.Model):
    boletin = models.CharField(unique=True, max_length=254, blank=True, null=True)
    nombre = models.CharField(max_length=120, blank=True, null=True)

    class Meta:
        db_table = 'suscribir'
        verbose_name_plural = "Suscribir"


class Contacto_Form(models.Model):
    nombre = models.CharField(max_length=45, blank=True, null=True)
    asunto = models.CharField(max_length=45, blank=True, null=True)
    mensaje = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'contacto_form'
        verbose_name_plural = "Contacto_form"
