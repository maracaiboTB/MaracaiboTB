from django.shortcuts import render, redirect
from .models import Producto

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