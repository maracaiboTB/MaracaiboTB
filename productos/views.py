from django.shortcuts import get_object_or_404, redirect, render
from pedidos.models import Pedido, DetallePedido
from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.models import Group
from django.contrib import messages
from .models import Producto, Sugerencia
from django.contrib.auth.decorators import login_required

from django.http import HttpResponseForbidden, JsonResponse
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.urls import reverse
import json
import logging
from decimal import Decimal, InvalidOperation
from functools import wraps


logger = logging.getLogger(__name__)
User = get_user_model()


def solo_superusuario(vista):
    @wraps(vista)
    @login_required
    def protegida(request, *args, **kwargs):
        if not request.user.is_superuser:
            return HttpResponseForbidden(
                "No tenés permiso para administrar usuarios."
            )
        return vista(request, *args, **kwargs)
    return protegida


def asignar_rol(usuario, rol):
    if rol not in {"administrador", "operario"}:
        raise ValueError("El rol seleccionado no es válido")

    usuario.is_staff = True
    usuario.is_superuser = rol == "administrador"
    usuario.save(update_fields=["is_staff", "is_superuser"])
    usuario.groups.clear()

    if rol != "administrador":
        grupo, _ = Group.objects.get_or_create(name="Operario")
        usuario.groups.add(grupo)


def obtener_usuarios_panel():
    usuarios = User.objects.prefetch_related("groups").order_by("username")
    for usuario in usuarios:
        usuario.rol_panel = (
            "Administrador"
            if usuario.is_superuser
            else "Operario"
        )
    return usuarios


def convertir_precio(valor, nombre, obligatorio=True):
    texto = str(valor or "").strip().replace(",", ".")
    if not texto:
        if obligatorio:
            raise ValueError(f"El {nombre} es obligatorio")
        return None
    try:
        precio = Decimal(texto)
    except InvalidOperation as error:
        raise ValueError(
            f"El {nombre} debe ser un número válido"
        ) from error
    if precio < 0:
        raise ValueError(f"El {nombre} no puede ser negativo")
    return precio


def convertir_fecha(valor):
    if not valor:
        return None
    fecha = parse_datetime(valor)
    if fecha and timezone.is_naive(fecha):
        fecha = timezone.make_aware(fecha)
    return fecha


def convertir_categoria(valor):
    categoria = str(valor or "").strip().lower()
    if categoria not in {"dulce", "salado"}:
        raise ValueError("La categoría debe ser Dulces o Salados")
    return categoria


def login_admin(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user:
            login(request, user)
            return redirect("admin_productos")

        return render(
            request,
            "login.html",
            {"error": "Usuario o contraseña incorrectos"}
        )

    return render(request, "login.html")

def logout_admin(request):

    logout(request)

    return redirect("login_admin")


def index(request):

    productos = Producto.objects.filter(
        activo=True
    )
    ahora = timezone.now()
    destacados = productos.filter(
        Q(
            en_promocion=True,
            precio_promocional__isnull=False
        ) | Q(es_combo=True)
    ).filter(
        Q(destacado_desde__isnull=True) | Q(destacado_desde__lte=ahora),
        Q(destacado_hasta__isnull=True) | Q(destacado_hasta__gte=ahora)
    )

    return render(
        request,
        'index.html',
        {
            'productos': productos,
            'destacados': destacados,
            'hay_combos': productos.filter(es_combo=True).exists(),
            'hay_promociones': productos.filter(
                en_promocion=True
            ).exists()
        }
    )

@transaction.atomic
def crear_pedido(request):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    try:
        items = json.loads(request.POST.get("productos", "[]"))
        if not items:
            raise ValueError("El carrito está vacío")

        metodo_pago = request.POST.get("metodo_pago", "").strip()
        comprobante = request.FILES.get("comprobante")
        if metodo_pago == "Sinpe" and not comprobante:
            raise ValueError("Debés adjuntar el comprobante SINPE")
        estado_pago = (
            "Comprobante enviado"
            if metodo_pago == "Sinpe" and comprobante
            else "Pendiente de pago"
        )

        pedido = Pedido.objects.create(
            nombre=request.POST.get("nombre", "").strip(),
            telefono=request.POST.get("telefono", "").strip(),
            direccion=request.POST.get("direccion", "").strip(),
            metodo_pago=metodo_pago,
            estado_pago=estado_pago,
            comentarios=request.POST.get("comentarios", "").strip(),
            comprobante=comprobante
        )
        if not pedido.nombre or not pedido.telefono or not pedido.direccion:
            raise ValueError("Faltan datos obligatorios")

        for item in items:
            producto = get_object_or_404(
                Producto,
                id=item["id"],
                activo=True,
                agotado=False
            )
            cantidad = int(item["cantidad"])
            if cantidad < 1:
                raise ValueError("Cantidad inválida")
            opcion = str(item.get("opcion", "")).strip()
            opciones_validas = producto.lista_bebidas
            if opciones_validas and opcion not in opciones_validas:
                raise ValueError(
                    f"Seleccioná una opción válida para {producto.nombre}"
                )
            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                opcion=opcion,
                precio=producto.precio_venta
            )

        return JsonResponse({
            "success": True,
            "pedido_id": pedido.id,
            "total": str(pedido.total)
        })
    except (ValueError, TypeError, KeyError, json.JSONDecodeError) as error:
        transaction.set_rollback(True)
        return JsonResponse(
            {"success": False, "error": str(error)},
            status=400
        )



@login_required
def admin_productos(request):

    if request.method == "POST":

        try:
            tipo_publicacion = request.POST.get(
                "tipo_publicacion", "producto"
            )
            Producto.objects.create(
                nombre=request.POST['nombre'],
                precio=request.POST['precio'],
                en_promocion=tipo_publicacion == "promocion",
                es_combo=tipo_publicacion == "combo",
                opciones_bebida=request.POST.get(
                    "opciones_bebida", ""
                ).strip(),
                etiqueta_destacado=request.POST.get(
                    "etiqueta_destacado", ""
                ).strip(),
                destacado_desde=convertir_fecha(
                    request.POST.get("destacado_desde")
                ),
                destacado_hasta=convertir_fecha(
                    request.POST.get("destacado_hasta")
                ),
                precio_promocional=(
                    request.POST.get("precio_promocional") or None
                ),
                descripcion=request.POST['descripcion'],
                categoria=convertir_categoria(
                    request.POST.get("categoria")
                ),
                stock=request.POST['stock'],
                imagen=request.FILES['imagen']
            )
        except Exception as error:
            logger.exception("No se pudo crear el producto")
            productos = Producto.objects.all()
            pedidos = Pedido.objects.prefetch_related(
                "detallepedido_set"
            ).order_by("-fecha")
            sugerencias = Sugerencia.objects.all()
            return render(
                request,
                'admin.html',
                {
                    'productos': productos,
                    'pedidos': pedidos,
                    'sugerencias': sugerencias,
                    'usuarios': (
                        obtener_usuarios_panel()
                        if request.user.is_superuser else []
                    ),
                    'error_producto': (
                        f"No se pudo guardar la imagen: {error}"
                    )
                },
                status=400
            )

        return redirect('admin_productos')

    productos = Producto.objects.all()
    pedidos = Pedido.objects.prefetch_related(
        "detallepedido_set"
    ).order_by("-fecha")
    sugerencias = Sugerencia.objects.all()

    return render(
        request,
        'admin.html',
        {
            'productos': productos,
            'pedidos': pedidos,
            'sugerencias': sugerencias,
            'usuarios': (
                obtener_usuarios_panel()
                if request.user.is_superuser else []
            )
        }
    )


@solo_superusuario
def crear_usuario(request):
    if request.method != "POST":
        return redirect("admin_productos")

    username = request.POST.get("username", "").strip()
    email = request.POST.get("email", "").strip()
    nombre = request.POST.get("first_name", "").strip()
    apellido = request.POST.get("last_name", "").strip()
    password = request.POST.get("password", "")
    rol = request.POST.get("rol", "operario")

    if rol not in {"administrador", "operario"}:
        messages.error(request, "El rol seleccionado no es válido.")
    elif not username or not password:
        messages.error(request, "El usuario y la contraseña son obligatorios.")
    elif User.objects.filter(username__iexact=username).exists():
        messages.error(request, "Ya existe un usuario con ese nombre.")
    else:
        try:
            usuario = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=nombre,
                last_name=apellido,
                is_active=True,
            )
            asignar_rol(usuario, rol)
            messages.success(request, "Usuario creado correctamente.")
        except ValueError as error:
            messages.error(request, str(error))

    return redirect(f"{reverse('admin_productos')}?tab=usuarios")


@solo_superusuario
def editar_usuario(request, id):
    if request.method != "POST":
        return redirect("admin_productos")

    usuario = get_object_or_404(User, id=id)
    username = request.POST.get("username", "").strip()
    rol = request.POST.get("rol", "operario")

    if rol not in {"administrador", "operario"}:
        messages.error(request, "El rol seleccionado no es válido.")
    elif not username:
        messages.error(request, "El nombre de usuario es obligatorio.")
    elif User.objects.filter(username__iexact=username).exclude(id=id).exists():
        messages.error(request, "Ya existe otro usuario con ese nombre.")
    elif usuario == request.user and rol != "administrador":
        messages.error(request, "No podés quitarte tu propio rol de administrador.")
    else:
        try:
            usuario.username = username
            usuario.email = request.POST.get("email", "").strip()
            usuario.first_name = request.POST.get("first_name", "").strip()
            usuario.last_name = request.POST.get("last_name", "").strip()
            usuario.is_active = request.POST.get("is_active") == "on"
            usuario.save()

            password = request.POST.get("password", "")
            if password:
                usuario.set_password(password)
                usuario.save(update_fields=["password"])

            asignar_rol(usuario, rol)
            messages.success(request, "Usuario actualizado correctamente.")
        except ValueError as error:
            messages.error(request, str(error))

    return redirect(f"{reverse('admin_productos')}?tab=usuarios")


@solo_superusuario
def eliminar_usuario(request, id):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    usuario = get_object_or_404(User, id=id)
    if usuario == request.user:
        messages.error(request, "No podés eliminar tu propia cuenta.")
    else:
        usuario.delete()
        messages.success(request, "Usuario eliminado correctamente.")

    return redirect(f"{reverse('admin_productos')}?tab=usuarios")




@login_required
def editar_producto(request, id):

    producto = get_object_or_404(
        Producto,
        id=id
    )

    if request.method == "POST":

        tipo_publicacion = request.POST.get(
            "tipo_publicacion", "producto"
        )
        en_promocion = tipo_publicacion == "promocion"

        producto.nombre = request.POST.get("nombre")
        try:
            producto.precio = convertir_precio(
                request.POST.get("precio"),
                "precio normal"
            )
            producto.precio_promocional = convertir_precio(
                request.POST.get("precio_promocional"),
                "precio promocional",
                obligatorio=en_promocion
            )
        except ValueError as error:
            return JsonResponse(
                {"success": False, "error": str(error)},
                status=400
            )
        producto.en_promocion = en_promocion
        producto.es_combo = tipo_publicacion == "combo"
        producto.opciones_bebida = request.POST.get(
            "opciones_bebida", ""
        ).strip()
        producto.etiqueta_destacado = request.POST.get(
            "etiqueta_destacado", ""
        ).strip()
        producto.destacado_desde = convertir_fecha(
            request.POST.get("destacado_desde")
        )
        producto.destacado_hasta = convertir_fecha(
            request.POST.get("destacado_hasta")
        )
        producto.descripcion = request.POST.get("descripcion")
        try:
            producto.categoria = convertir_categoria(
                request.POST.get("categoria")
            )
        except ValueError as error:
            return JsonResponse(
                {"success": False, "error": str(error)},
                status=400
            )
        producto.stock = request.POST.get("stock")
       
        
        
        
        if request.FILES.get("imagen"):
            producto.imagen = request.FILES["imagen"]


        try:
            producto.save()
        except Exception as error:
            logger.exception("No se pudo editar el producto")
            return JsonResponse({
                "success": False,
                "error": f"No se pudo actualizar el producto: {error}"
            }, status=400)

        return JsonResponse({
            "success": True
        })

    return JsonResponse({
        "success": False
    })


@login_required
def eliminar_producto(request, id):

    producto = get_object_or_404(
        Producto,
        id=id
    )

    producto.delete()

    return redirect(
        "admin_productos"
    )


@login_required
def cambiar_estado_agotado(request, id):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    producto = get_object_or_404(Producto, id=id)
    producto.agotado = not producto.agotado
    producto.save(update_fields=["agotado"])

    return JsonResponse({
        "success": True,
        "agotado": producto.agotado,
    })


@login_required
def actualizar_estado_pedido(request, id):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    estados = {
        "Pendiente",
        "Preparando",
        "Listo",
        "Entregado",
        "Cancelado"
    }
    estado = request.POST.get("estado")
    if estado not in estados:
        return JsonResponse(
            {"success": False, "error": "Estado inválido"},
            status=400
        )

    pedido = get_object_or_404(Pedido, id=id)
    pedido.estado = estado
    campos_actualizados = ["estado"]

    if estado == "Preparando" and pedido.numero_orden is None:
        pedido.numero_orden = pedido.id
        campos_actualizados.append("numero_orden")

    pedido.save(update_fields=campos_actualizados)

    return JsonResponse({
        "success": True,
        "estado": pedido.estado,
        "numero_orden": pedido.numero_orden,
        "nombre": pedido.nombre,
        "telefono": pedido.telefono
    })


@login_required
def actualizar_pago_pedido(request, id):
    if request.method != "POST":
        return redirect("admin_productos")

    pedido = get_object_or_404(Pedido, id=id)
    pedido.estado_pago = "Pagado"
    pedido.save(update_fields=["estado_pago"])

    return redirect(f"{reverse('admin_productos')}?tab=pedidos")


@login_required
def eliminar_pedido(request, id):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    pedido = get_object_or_404(Pedido, id=id)
    pedido.delete()

    return JsonResponse({"success": True})


def crear_sugerencia(request):
    if request.method != "POST":
        return JsonResponse({"success": False}, status=405)

    mensaje = request.POST.get("mensaje", "").strip()
    if not mensaje:
        return JsonResponse(
            {"success": False, "error": "Escribí tu comentario o sugerencia."},
            status=400
        )

    Sugerencia.objects.create(
        nombre=request.POST.get("nombre", "").strip(),
        contacto=request.POST.get("contacto", "").strip(),
        mensaje=mensaje,
    )
    return JsonResponse({"success": True})
