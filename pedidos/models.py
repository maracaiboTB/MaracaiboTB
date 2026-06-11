from django.db import models

from productos.models import Producto


class Pedido(models.Model):

    nombre = models.CharField(max_length=100)

    telefono = models.CharField(max_length=20)

    direccion = models.TextField()

    metodo_pago = models.CharField(max_length=20)

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



    from productos.models import Producto

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

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )