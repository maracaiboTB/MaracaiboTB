from django.urls import path
from . import views

urlpatterns = [

    path(
        '',
        views.index,
        name='index'
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
        'admin-productos/',
        views.admin_productos,
        name='admin_productos'
    ),

]