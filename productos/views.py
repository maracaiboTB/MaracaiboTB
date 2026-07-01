from django.shortcuts import render, redirect
from django.shortcuts import get_object_or_404, redirect
from pedidos.models import Pedido
from django.contrib.auth import authenticate, login, logout
from .models import Producto
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse


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

    return render(
        request,
        'admin.html',
        {
            'productos': productos
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