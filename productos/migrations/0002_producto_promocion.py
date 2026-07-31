from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("productos", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="producto",
            name="en_promocion",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="producto",
            name="precio_promocional",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                max_digits=10,
                null=True,
            ),
        ),
    ]
