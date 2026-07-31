from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0004_rename_es_combo_dia_producto_es_combo"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="etiqueta_destacado",
            field=models.CharField(blank=True, max_length=40),
        ),
        migrations.AddField(
            model_name="producto",
            name="destacado_desde",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="producto",
            name="destacado_hasta",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
