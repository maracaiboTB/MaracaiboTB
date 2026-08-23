from django.urls import path
from . import views

urlpatterns = [

    path(
        '',
        views.index,
        name='index'
    ),

    path(
        'crear-pedido/',
        views.crear_pedido,
        name='crear_pedido'
    ),

    path(
        "login/",
        views.login_admin,
        name="login_admin"
    ),
    
    path(
    "logout/",
    views.logout_admin,
    name="logout_admin"
    ),

    path(
    "editar-producto/<int:id>/",
    views.editar_producto,
    name="editar_producto"
    ),

    path(
    "eliminar-producto/<int:id>/",
    views.eliminar_producto,
    name="eliminar_producto"
    ),

    path(
        "producto/<int:id>/agotado/",
        views.cambiar_estado_agotado,
        name="cambiar_estado_agotado"
    ),

    path(
        "pedido/<int:id>/estado/",
        views.actualizar_estado_pedido,
        name="actualizar_estado_pedido"
    ),

    path(
        "pedido/<int:id>/pago/",
        views.actualizar_pago_pedido,
        name="actualizar_pago_pedido"
    ),

    path(
        "pedido/<int:id>/eliminar/",
        views.eliminar_pedido,
        name="eliminar_pedido"
    ),

    path(
        'admin-productos/',
        views.admin_productos,
        name='admin_productos'
    ),

    path(
        'usuarios/crear/',
        views.crear_usuario,
        name='crear_usuario'
    ),

    path(
        'usuarios/<int:id>/editar/',
        views.editar_usuario,
        name='editar_usuario'
    ),

    path(
        'usuarios/<int:id>/eliminar/',
        views.eliminar_usuario,
        name='eliminar_usuario'
    ),

]
