from django.db import migrations, models


def asignar_estado_pago(apps, schema_editor):
    Pedido = apps.get_model("pedidos", "Pedido")
    Pedido.objects.filter(
        metodo_pago__iexact="Sinpe",
        comprobante__isnull=False,
    ).exclude(comprobante="").update(
        estado_pago="Comprobante enviado"
    )


class Migration(migrations.Migration):

    dependencies = [
        ("pedidos", "0003_detallepedido_opcion"),
    ]

    operations = [
        migrations.AddField(
            model_name="pedido",
            name="estado_pago",
            field=models.CharField(
                default="Pendiente de pago",
                max_length=30,
            ),
        ),
        migrations.RunPython(
            asignar_estado_pago,
            migrations.RunPython.noop,
        ),
    ]
