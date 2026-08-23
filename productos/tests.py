from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.urls import reverse
from .models import Producto
from pedidos.models import DetallePedido, Pedido


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
        self.operario = User.objects.create_user(
            username="operario",
            password="Operario12345!",
            is_staff=True,
        )

    def test_administrador_ve_pestana_usuarios(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse("admin_productos"))

        self.assertContains(response, "Usuarios")
        self.assertContains(response, "Agregar usuario")

    def test_operario_no_ve_pestana_usuarios(self):
        self.client.force_login(self.operario)
        response = self.client.get(reverse("admin_productos"))

        self.assertNotContains(response, "Agregar usuario")
        self.assertNotContains(response, 'data-tab="usuarios"')

    def test_operario_no_puede_crear_editar_ni_eliminar(self):
        self.client.force_login(self.operario)
        urls = [
            reverse("crear_usuario"),
            reverse("editar_usuario", args=[self.admin.id]),
            reverse("eliminar_usuario", args=[self.admin.id]),
        ]

        for url in urls:
            with self.subTest(url=url):
                response = self.client.post(url, {})
                self.assertEqual(response.status_code, 403)

    def test_administrador_puede_crear_operario(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            reverse("crear_usuario"),
            {
                "username": "caja",
                "password": "Caja12345!",
                "first_name": "Persona",
                "rol": "operario",
            },
        )

        self.assertRedirects(response, "/admin-productos/?tab=usuarios")
        usuario = User.objects.get(username="caja")
        self.assertTrue(usuario.is_staff)
        self.assertFalse(usuario.is_superuser)
        self.assertTrue(usuario.groups.filter(name="Operario").exists())

    def test_administrador_no_puede_eliminarse(self):
        self.client.force_login(self.admin)
        response = self.client.post(
            reverse("eliminar_usuario", args=[self.admin.id])
        )

        self.assertRedirects(response, "/admin-productos/?tab=usuarios")
        self.assertTrue(User.objects.filter(id=self.admin.id).exists())


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
class ProductosAgotadosTests(TestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(
            username="operario",
            password="Operario12345!",
            is_staff=True,
        )
        self.producto = Producto.objects.create(
            nombre="Pan de prueba",
            precio="1000.00",
            descripcion="Producto para comprobar disponibilidad.",
            categoria="dulce",
            stock=1,
            imagen="productos/prueba.jpg",
        )

    def test_marcar_agotado_se_refleja_en_el_menu(self):
        self.client.force_login(self.usuario)
        response = self.client.post(
            reverse("cambiar_estado_agotado", args=[self.producto.id])
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["agotado"])
        self.producto.refresh_from_db()
        self.assertTrue(self.producto.agotado)

        respuesta_menu = self.client.get(reverse("index"))
        self.assertContains(respuesta_menu, "Pan de prueba")
        self.assertContains(respuesta_menu, "Producto agotado")

    def test_eliminar_pedido_borra_sus_detalles(self):
        pedido = Pedido.objects.create(
            nombre="Cliente de prueba",
            telefono="88888888",
            direccion="Dirección de prueba",
            metodo_pago="Efectivo",
        )
        detalle = DetallePedido.objects.create(
            pedido=pedido,
            producto=self.producto,
            cantidad=1,
            precio="1000.00",
        )
        self.client.force_login(self.usuario)

        response = self.client.post(
            reverse("eliminar_pedido", args=[pedido.id])
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["success"])
        self.assertFalse(Pedido.objects.filter(id=pedido.id).exists())
        self.assertFalse(DetallePedido.objects.filter(id=detalle.id).exists())
