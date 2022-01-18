create sequence seq_error;

create or replace procedure sp_error(p_msj varchar2, p_desc varchar2, p_codigo number)
is
begin
  insert into registro_error values (seq_error.nextval,p_msj,p_desc,p_codigo,sysdate);
end;

create or replace procedure sp_correo(p_user_id in integer, p_correo in varchar2)
is
  v_msj varchar2(45);
  v_desc varchar2(250);
  v_codigo number;
BEGIN
  update auth_user set email = p_correo 
  where id = p_user_id;
EXCEPTION
        when others THEN
        v_msj:= 'Error tabla auth_user';
        v_desc:= SUBSTR(SQLERRM,0,99);
        v_codigo:= sqlcode;
        sp_error(v_msj,v_desc,v_codigo);        
END;

create or replace procedure sp_documentos (p_rut in varchar2, p_cursor_documento out SYS_REFCURSOR)
is 
begin
  open p_cursor_documento for select
                           dc.ID,
                           dc.ruta,
                           td.titulo,
                           a.username
                           from documento_cliente dc
                           join documento td on dc.documento_id = td.id
                           join usuario u on u.id = dc.usuario_id
                           join auth_user a on a.id = u.user_id
                           where a.username = p_rut
                           order by dc.ID;
end;

create or replace procedure sp_medicos_nuevo(p_servicios out SYS_REFCURSOR)
is
begin
    open p_servicios for select 
                            m.id, m.servicio_id, s.titulo, m.usuario_id,
                            u.nombre ||' '|| u.ap_paterno ||' '|| ap_materno
                            from modulo m
                            join servicio s  on m.servicio_id = s.id
                            join usuario u on m.usuario_id = u.id;


end;

create or replace procedure sp_modulo_id(p_servicio_id in int, p_medico_id in int, p_horario in nvarchar2,
                                     p_dia_id in int, p_id out int)
is
begin
    select id into p_id
    from modulo 
    where servicio_id = p_servicio_id and  usuario_id = p_medico_id and
          hora_inicio = p_horario and dia_id = p_dia_id;
end;

create or replace procedure sp_servicios(p_servicios out SYS_REFCURSOR)
is
begin
    open p_servicios for select distinct 
                                s.id, s.titulo
                                from modulo m
                                join servicio s on m.servicio_id = s.id
                                where s.esta_inactivo = '0';

end;

create or replace procedure sp_usuario (p_rut in VARCHAR2, p_cursor_usuario_id out SYS_REFCURSOR)
is 
begin
  open p_cursor_usuario_id for select
                                u.nombre,
                                u.ap_paterno,
                                u. ap_materno "Segundo Apellido",
                                u.genero_id "Genero",
                                u.fecha_nacimiento "Fecha Nacimiento",
                                u.fono_fijo "N Fijo",
                                u.fono_movil "N Movil",
                                r.id "Region",
                                u.comuna_id "Comuna",
                                u.direccion "Direccion",
                                u.es_extranjero
                               from auth_user a
                               join usuario u on a.id = u.user_id
                               join comuna c on c.id = u.comuna_id
                               join region r on r.id = c.region_id
                               join genero g on g.id = u.genero_id
                               where a.username = p_rut;
end;

create or replace procedure sp_usuario_id(p_id in int, p_id_usuario out int)
is
begin
    select u.id into p_id_usuario
    from usuario u
    where u.user_id = p_id;
end;

create or replace procedure sp_reserva (p_reserva out SYS_REFCURSOR)
is
begin
    open p_reserva for select r.fecha_reserva, r.modulo_id, r.hora, m.hora_inicio,
                              m.servicio_id, m.usuario_id
                       from reserva r
                       join modulo m on r.modulo_id = m.id;
end;


create or replace procedure sp_misreservas(p_user_id in int, p_misreservas out SYS_REFCURSOR)
is
begin
     open p_misreservas for 
select
r.solicitado_el, 
r.fue_anulada, 
r.fecha_reserva, 
r.fecha_anulacion,
r.fecha_modificacion, 
r.hora, 
m.box, 
s.titulo, 
u.nombre||' '||u.ap_paterno||' '||u.ap_materno
from usuario u join modulo m on u.id = m.usuario_id
join  servicio s on m.servicio_id = s.id
join reserva r on m.id = r.modulo_id
where r.usuario_id = p_user_id;
end;