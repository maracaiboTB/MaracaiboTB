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
        "pedido/<int:id>/estado/",
        views.actualizar_estado_pedido,
        name="actualizar_estado_pedido"
    ),

    path(
        'admin-productos/',
        views.admin_productos,
        name='admin_productos'
    ),

]
