from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0005_producto_detacado_configuracion"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="producto",
            name="tallas",
        ),
    ]
