from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0003_producto_combo_bebidas"),
    ]

    operations = [
        migrations.RenameField(
            model_name="producto",
            old_name="es_combo_dia",
            new_name="es_combo",
        ),
    ]
