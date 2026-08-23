from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0008_producto_agotado"),
    ]

    operations = [
        migrations.CreateModel(
            name="Sugerencia",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("nombre", models.CharField(blank=True, max_length=100)),
                ("contacto", models.CharField(blank=True, max_length=100)),
                ("mensaje", models.TextField()),
                ("fecha", models.DateTimeField(auto_now_add=True)),
            ],
            options={"ordering": ["-fecha"]},
        ),
    ]
