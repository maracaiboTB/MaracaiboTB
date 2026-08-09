from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse


User = get_user_model()


@override_settings(
    STORAGES={
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
        },
        "staticfiles": {
            "BACKEND": (
                "django.contrib.staticfiles.storage.StaticFilesStorage"
            ),
        },
    }
)
class GestionUsuariosTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin",
            password="Admin12345!",
            email="admin@example.com",
        )
        self.empleado = User.objects.create_user(
            username="empleado",
            password="Empleado12345!",
            is_staff=True,
        )

    def test_administrador_ve_pestana_usuarios(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse("admin_productos"))

        self.assertContains(response, "Usuarios")
        self.assertContains(response, "Agregar usuario")

    def test_empleado_no_ve_pestana_usuarios(self):
        self.client.force_login(self.empleado)
        response = self.client.get(reverse("admin_productos"))

        self.assertNotContains(response, "Agregar usuario")
        self.assertNotContains(response, 'data-tab="usuarios"')

    def test_empleado_no_puede_crear_editar_ni_eliminar(self):
        self.client.force_login(self.empleado)
        urls = [
            reverse("crear_usuario"),
            reverse("editar_usuario", args=[self.admin.id]),
            reverse("eliminar_usuario", args=[self.admin.id]),
        ]

        for url in urls:
            with self.subTest(url=url):
                response = self.client.post(url, {})
                self.assertEqual(response.status_code, 403)

    def test_administrador_puede_crear_empleado(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            reverse("crear_usuario"),
            {
                "username": "caja",
                "password": "Caja12345!",
                "first_name": "Persona",
                "rol": "empleado",
            },
        )

        self.assertRedirects(response, "/admin-productos/?tab=usuarios")
        usuario = User.objects.get(username="caja")
        self.assertTrue(usuario.is_staff)
        self.assertFalse(usuario.is_superuser)
        self.assertTrue(usuario.groups.filter(name="Empleado").exists())

    def test_administrador_no_puede_eliminarse(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            reverse("eliminar_usuario", args=[self.admin.id])
        )

        self.assertRedirects(response, "/admin-productos/?tab=usuarios")
        self.assertTrue(User.objects.filter(id=self.admin.id).exists())
