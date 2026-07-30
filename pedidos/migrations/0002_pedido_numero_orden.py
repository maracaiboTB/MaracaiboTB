from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("pedidos", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="pedido",
            name="numero_orden",
            field=models.PositiveIntegerField(
                blank=True,
                null=True,
                unique=True
            ),
        ),
    ]
