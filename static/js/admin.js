
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
localStorage.setItem("adminLogin", "true");

document.getElementById("loginScreen").style.display = "none";

const panel = document.getElementById("adminPanel");

if(panel){
panel.classList.add("active");
}

cargarProductos();
cargarPedidos();
mostrarVista("productos");

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

const panel = document.getElementById("adminPanel");

if(panel){
panel.classList.add("active");
}

cargarProductos();

cargarPedidos();

mostrarVista("productos");

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

cargarPedidos();


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

/* CARGAR PRODUCTOS */

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

/* PEDIDOS */

function cargarPedidos(){

const pedidos =
JSON.parse(localStorage.getItem("pedidos")) || [];

const tabla =
document.getElementById("tablaPedidos");

tabla.innerHTML = "";

pedidos.forEach(p => {

tabla.innerHTML += `
<tr>
<td>${p.id}</td>
<td>${p.nombre}</td>
<td>₡${p.total}</td>
<td>${p.estado}</td>
</tr>
`;

});

}

function cambiarEstado(id,nuevoEstado){

const pedidos =
JSON.parse(
localStorage.getItem("pedidos")
) || [];

const pedido =
pedidos.find(p=>p.id==id);

if(pedido){

pedido.estado = nuevoEstado;

localStorage.setItem(
"pedidos",
JSON.stringify(pedidos)
);

}

}

function mostrarVista(vista){

document.getElementById("vistaProductos").style.display = "none";
document.getElementById("vistaPedidos").style.display = "none";
document.getElementById("vistaConfig").style.display = "none";

if(vista === "productos"){
document.getElementById("vistaProductos").style.display = "block";
}

if(vista === "pedidos"){
document.getElementById("vistaPedidos").style.display = "block";
cargarPedidos();
}

if(vista === "config"){
document.getElementById("vistaConfig").style.display = "block";
}

}
function cargarPedidos(){

const pedidos =
JSON.parse(
localStorage.getItem("pedidos")
) || [];

const tabla =
document.getElementById("tablaPedidos");

if(!tabla) return;

tabla.innerHTML = "";

pedidos.forEach(p => {

tabla.innerHTML += `

<tr>

<td>${p.id}</td>

<td>${p.nombre}</td>

<td>₡${p.total}</td>

<td>${p.estado}</td>

</tr>

`;

});

}

function mostrarTab(tab){

document.getElementById("tab-productos").style.display = "none";
document.getElementById("tab-pedidos").style.display = "none";
document.getElementById("tab-config").style.display = "none";

document.getElementById("tab-" + tab).style.display = "block";

if(tab === "pedidos"){
cargarPedidos();
}

}

function verificarMetodoPago(){

const metodo = document.getElementById("metodoPago");

const uploadBox = document.getElementById("uploadBox");

if(!metodo || !uploadBox) return;

if(metodo.value === "Sinpe"){
uploadBox.style.display = "block";
}else{
uploadBox.style.display = "none";
}

}

