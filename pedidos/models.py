from django.db import models

from productos.models import Producto


class Pedido(models.Model):

    nombre = models.CharField(max_length=100)

    telefono = models.CharField(max_length=20)

    direccion = models.TextField()

    metodo_pago = models.CharField(max_length=20)

    estado_pago = models.CharField(
        max_length=30,
        default="Pendiente de pago"
    )

    comentarios = models.TextField(
        blank=True
    )

    comprobante = models.ImageField(
        upload_to='comprobantes/',
        blank=True,
        null=True
    )

    fecha = models.DateTimeField(
        auto_now_add=True
    )

    estado = models.CharField(
        max_length=20,
        default='Pendiente'
    )

    numero_orden = models.PositiveIntegerField(
        unique=True,
        blank=True,
        null=True
    )



    @property
    def total(self):
        return sum(
            detalle.precio * detalle.cantidad
            for detalle in self.detallepedido_set.all()
        )

    def __str__(self):
        return f"Pedido #{self.pk} - {self.nombre}"

class DetallePedido(models.Model):

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE
    )

    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE
    )

    cantidad = models.IntegerField()

    opcion = models.CharField(
        max_length=100,
        blank=True
    )

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
