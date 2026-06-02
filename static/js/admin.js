/* LOGIN */

const admins = [

{
user:"Isaac",
pass:"pan123"
},

{
user:"Sebas",
pass:"pan123"
}

];

function login(){

const user =
document.getElementById("user").value;

const pass =
document.getElementById("pass").value;

const valido = admins.find(
a => a.user === user && a.pass === pass
);

if(!valido){

alert("Credenciales incorrectas");

return;

}

localStorage.setItem(
"adminLogin",
"true"
);

document
.getElementById("loginScreen")
.style.display = "none";

document
.getElementById("adminPanel")
.classList.add("active");

cargarProductos();

}

/* SESION */

if(localStorage.getItem("adminLogin")){

document
.getElementById("loginScreen")
.style.display = "none";

document
.getElementById("adminPanel")
.classList.add("active");

cargarProductos();

}

/* LOGOUT */

function logout(){

localStorage.removeItem("adminLogin");

location.reload();

}

/* GUARDAR */

function guardarProducto(){

const nombre =
document.getElementById("nombre").value;

const precio =
document.getElementById("precio").value;

const descripcion =
document.getElementById("descripcion").value;

const categoria =
document.getElementById("categoria").value;

const stock =
document.getElementById("stock").value;

const tallas =
document.getElementById("tallas").value;

const imagen =
document.getElementById("imagen").files[0];

if(!imagen){

alert("Subí una imagen");

return;

}

const reader = new FileReader();

reader.onload = function(e){

const productos =
JSON.parse(
localStorage.getItem("productos")
) || [];

productos.push({

id:Date.now(),

n:nombre,

p:precio,

d:descripcion,

c:categoria,

stock:stock,

tallas:tallas,

i:e.target.result

});

localStorage.setItem(
"productos",
JSON.stringify(productos)
);

alert("Producto agregado");

limpiarFormulario();

cargarProductos();

};

reader.readAsDataURL(imagen);

}

/* CARGAR */

function cargarProductos(){

const contenedor =
document.getElementById("productosAdmin");

const productos =
JSON.parse(
localStorage.getItem("productos")
) || [];

contenedor.innerHTML = "";

productos.forEach(p => {

contenedor.innerHTML += `

<div class="product-admin-card">

<img src="${p.i}">

<div>

<h3>${p.n}</h3>

<p>${p.p}</p>

<p>${p.c}</p>

</div>

<button
class="delete-btn"
onclick="eliminarProducto(${p.id})">

Eliminar

</button>

</div>

`;

});

}

/* ELIMINAR */

function eliminarProducto(id){

let productos =
JSON.parse(
localStorage.getItem("productos")
) || [];

productos = productos.filter(
p => p.id !== id
);

localStorage.setItem(
"productos",
JSON.stringify(productos)
);

cargarProductos();

}

/* LIMPIAR */

function limpiarFormulario(){

document.getElementById("nombre").value = "";

document.getElementById("precio").value = "";

document.getElementById("descripcion").value = "";

document.getElementById("stock").value = "";

document.getElementById("tallas").value = "";

document.getElementById("imagen").value = "";

}