from django.db import models

class Producto(models.Model):

    nombre = models.CharField(max_length=100)

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    descripcion = models.TextField()

    categoria = models.CharField(
        max_length=50
    )

    stock = models.IntegerField()

    tallas = models.CharField(
        max_length=100,
        blank=True
    )

    imagen = models.ImageField(
        upload_to='productos/'
    )

    activo = models.BooleanField(
        default=True
    )

    def __str__(self):
        return self.nombre