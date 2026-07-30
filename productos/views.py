from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404, redirect
from pedidos.models import Pedido, DetallePedido
from django.contrib.auth import authenticate, login, logout
from .models import Producto
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from django.db import transaction
import json


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


@login_required
def admin_panel(request):

    productos = Producto.objects.all()
    pedidos = Pedido.objects.all()

    return render(
        request,
        "admin.html",
        {
            "productos": productos,
            "pedidos": pedidos
        }
    )

def index(request):

    productos = Producto.objects.filter(
        activo=True
    )

    return render(
        request,
        'index.html',
        {
            'productos': productos
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

        pedido = Pedido.objects.create(
            nombre=request.POST.get("nombre", "").strip(),
            telefono=request.POST.get("telefono", "").strip(),
            direccion=request.POST.get("direccion", "").strip(),
            metodo_pago=request.POST.get("metodo_pago", "").strip(),
            comentarios=request.POST.get("comentarios", "").strip(),
            comprobante=request.FILES.get("comprobante")
        )
        if not pedido.nombre or not pedido.telefono or not pedido.direccion:
            raise ValueError("Faltan datos obligatorios")

        for item in items:
            producto = get_object_or_404(Producto, id=item["id"], activo=True)
            cantidad = int(item["cantidad"])
            if cantidad < 1:
                raise ValueError("Cantidad inválida")
            DetallePedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio
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

        Producto.objects.create(

            nombre=request.POST['nombre'],

            precio=request.POST['precio'],

            descripcion=request.POST['descripcion'],

            categoria=request.POST['categoria'],

            stock=request.POST['stock'],

            tallas=request.POST['tallas'],

            imagen=request.FILES['imagen']

        )

        return redirect('admin_productos')

    productos = Producto.objects.all()
    pedidos = Pedido.objects.prefetch_related(
        "detallepedido_set"
    ).order_by("-fecha")

    return render(
        request,
        'admin.html',
        {
            'productos': productos,
            'pedidos': pedidos
        }
    )




from django.http import JsonResponse

@login_required
def editar_producto(request, id):

    producto = get_object_or_404(
        Producto,
        id=id
    )

    if request.method == "POST":

        producto.nombre = request.POST.get("nombre")
        producto.precio = request.POST.get("precio")
        producto.descripcion = request.POST.get("descripcion")
        producto.categoria = request.POST.get("categoria")
        producto.stock = request.POST.get("stock")
        producto.tallas = request.POST.get("tallas")
       
        
        
        
        if request.FILES.get("imagen"):
            producto.imagen = request.FILES["imagen"]


        producto.save()

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
