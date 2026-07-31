from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pedidos", "0002_pedido_numero_orden"),
    ]

    operations = [
        migrations.AddField(
            model_name="detallepedido",
            name="opcion",
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
