from django.db import migrations, models


def normalizar_categorias(apps, schema_editor):
    Producto = apps.get_model("productos", "Producto")
    Producto.objects.filter(categoria__iexact="dulce").update(
        categoria="dulce"
    )
    Producto.objects.exclude(categoria="dulce").update(
        categoria="salado"
    )


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0006_remove_producto_tallas"),
    ]

    operations = [
        migrations.RunPython(
            normalizar_categorias,
            migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name="producto",
            name="categoria",
            field=models.CharField(
                choices=[
                    ("dulce", "Dulces"),
                    ("salado", "Salados"),
                ],
                max_length=20,
            ),
        ),
    ]
