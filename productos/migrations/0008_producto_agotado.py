from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0007_normalizar_categorias"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="agotado",
            field=models.BooleanField(default=False),
        ),
    ]
