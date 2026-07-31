from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0002_producto_promocion"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="es_combo_dia",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="producto",
            name="opciones_bebida",
            field=models.CharField(blank=True, max_length=250),
        ),
    ]
