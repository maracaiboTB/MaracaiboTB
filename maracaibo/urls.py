from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.views.static import serve

urlpatterns = [

    path('admin/', admin.site.urls),

    path(
        '',
        include('productos.urls')
    ),

]

# MEDIA FILES
# En desarrollo se usa FileSystemStorage; servir estos archivos también cuando
# DEBUG esté desactivado evita que las imágenes locales queden en 404.
if (
    settings.DEBUG
    or settings.MEDIA_STORAGE_BACKEND
    == 'django.core.files.storage.FileSystemStorage'
):
    urlpatterns += [
        path(
            'media/<path:path>',
            serve,
            {'document_root': settings.MEDIA_ROOT},
        ),
    ]
