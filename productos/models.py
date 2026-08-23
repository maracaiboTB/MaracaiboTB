from django.db import models

class Producto(models.Model):

    nombre = models.CharField(max_length=100)

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    descripcion = models.TextField()

    categoria = models.CharField(
        max_length=20,
        choices=[
            ("dulce", "Dulces"),
            ("salado", "Salados"),
        ]
    )

    stock = models.IntegerField()

    imagen = models.ImageField(
        upload_to='productos/'
    )

    activo = models.BooleanField(
        default=True
    )

    agotado = models.BooleanField(
        default=False
    )

    en_promocion = models.BooleanField(
        default=False
    )

    precio_promocional = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True
    )

    es_combo = models.BooleanField(
        default=False
    )

    opciones_bebida = models.CharField(
        max_length=250,
        blank=True
    )

    etiqueta_destacado = models.CharField(
        max_length=40,
        blank=True
    )

    destacado_desde = models.DateTimeField(
        blank=True,
        null=True
    )

    destacado_hasta = models.DateTimeField(
        blank=True,
        null=True
    )

    @property
    def lista_bebidas(self):
        return [
            opcion.strip()
            for opcion in self.opciones_bebida.split(",")
            if opcion.strip()
        ]

    @property
    def precio_venta(self):
        if (
            self.en_promocion
            and self.precio_promocional is not None
            and self.precio_promocional < self.precio
        ):
            return self.precio_promocional
        return self.precio

    def __str__(self):
        return self.nombre


class Sugerencia(models.Model):
    nombre = models.CharField(max_length=100, blank=True)
    contacto = models.CharField(max_length=100, blank=True)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha"]

    def __str__(self):
        return self.nombre or f"Sugerencia #{self.pk}"
