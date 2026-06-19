from django.urls import path
from . import views

urlpatterns = [

    path(
        '',
        views.index,
        name='index'
    ),

    path(
        'admin-productos/',
        views.admin_productos,
        name='admin_productos'
    ),

]