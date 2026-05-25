/* SLIDER */

const slides=document.querySelectorAll(".slide");

let current=0;

function cambiarSlide(){

slides[current].classList.remove("active");

current=(current+1)%slides.length;

slides[current].classList.add("active");

}

setInterval(cambiarSlide,4000);

/* PRODUCTOS */

const productos=[

{
c:"combos",
n:"Repostería + Coca Cola 355ml",
d:"Pastel de pollo, palmito o enchilada acompañado de Coca Cola 355ml.",
p:"₡3,200",
i:"combo-coca-cola.jpg"
},

{
c:"combos",
n:"Baguette + Patté",
d:"Baguette con o sin queso acompañado de patté.",
p:"₡2,400",
i:"baguette-patte.jpg"
},

{
c:"combos",
n:"Baguette + Natilla",
d:"Baguette con natilla pequeña incluida.",
p:"₡2,400",
i:"baguette-natilla.jpg"
},

{
c:"salada",
n:"Pastel de Pollo",
d:"Pastel relleno de pollo recién horneado.",
p:"₡980",
i:"pastel-pollo.jpg"
},

{
c:"salada",
n:"Pastel de Carne",
d:"Pastel relleno de carne de res.",
p:"₡980",
i:"pastel-carne-res.jpg"
},

{
c:"panes",
n:"Baguette Simple",
d:"Pan baguette artesanal.",
p:"₡630",
i:"baguette-simple.jpg"
},

{
c:"panes",
n:"Baguette con Queso",
d:"Baguette recién horneada con queso.",
p:"₡690",
i:"baguette-queso.jpg"
},

{
c:"dulce",
n:"Queque Seco",
d:"Especial de mantequilla.",
p:"₡3,850",
i:"queque-seco.jpg"
},

{
c:"dulce",
n:"Moro",
d:"Repostería dulce tradicional.",
p:"₡1,150",
i:"moro.jpg"
}

];

const grid=document.getElementById("grid");
const filtros=document.querySelectorAll(".filter");

function pintar(cat="all"){

grid.innerHTML="";

productos
.filter(p=>cat==="all"||p.c===cat)
.forEach(p=>{

grid.innerHTML+=`

<div class="card" onclick='abrir(${JSON.stringify(p)})'>

<div class="tag">
${p.c.toUpperCase()}
</div>

<img src="./img/${p.i}" alt="${p.n}">

<div class="card-body">

<h3>${p.n}</h3>

<p>${p.d}</p>

<div class="price">${p.p}</div>

<button class="buy-btn"
onclick='event.stopPropagation(); agregarCarrito(${JSON.stringify(p)})'>

Agregar al carrito

</button>

</div>

</div>

`;

});

}

function abrir(p){

document.getElementById("mImg").src="./img/"+p.i;

document.getElementById("mNombre").innerText=p.n;

document.getElementById("mDesc").innerText=p.d;

document.getElementById("mPrecio").innerText=p.p;

document.getElementById("modal").style.display="flex";

}

function cerrar(){

document.getElementById("modal").style.display="none";

}

window.onclick=function(e){

const modal=document.getElementById("modal");

if(e.target===modal){
cerrar();
}

}

filtros.forEach(btn=>{

btn.onclick=()=>{

filtros.forEach(x=>x.classList.remove("active"));

btn.classList.add("active");

pintar(btn.dataset.cat);

};

});

pintar();

/* =========================
CARRITO
========================= */


let carrito=[];

/* AGREGAR */

/* =========================
AGREGAR AL CARRITO
========================= */

/* =========================
AGREGAR PRODUCTO
========================= */

function agregarCarrito(producto){

const existente = carrito.find(
item => item.n === producto.n
);

if(existente){

existente.cantidad += 1;

}else{

producto.cantidad = 1;

carrito.push(producto);

}

/* ABRIR CARRITO AUTOMÁTICO */

document
.getElementById("cartPanel")
.classList.add("active");

actualizarCarrito();

}

/* ACTUALIZAR */

function actualizarCarrito(){

const items = document.getElementById("cart-items");

const total = document.getElementById("cart-total");

const count = document.getElementById("cart-count");

items.innerHTML="";

let totalPrecio = 0;

let totalCantidad = 0;

carrito.forEach((p,index)=>{

const precioNumero = Number(
p.p.replace("₡","")
.replace(",","")
);

const subtotal = precioNumero * p.cantidad;

totalPrecio += subtotal;

totalCantidad += p.cantidad;

items.innerHTML += `

<div class="cart-item">

<img src="./img/${p.i}">

<div class="cart-info">

<h4>${p.n}</h4>

<p>${p.p}</p>

<div class="cart-controls">

<button onclick="cambiarCantidad(${index},-1)">
−
</button>

<span>
${p.cantidad}
</span>

<button onclick="cambiarCantidad(${index},1)">
+
</button>

</div>

<div class="cart-price">

₡${subtotal}

</div>

</div>

</div>

`;

});

total.innerText = `Total: ₡${totalPrecio}`;

count.innerText = totalCantidad;

}

function cambiarCantidad(index,cambio){

carrito[index].cantidad += cambio;

if(carrito[index].cantidad <= 0){

carrito.splice(index,1);

}

actualizarCarrito();

}

/* =========================
VACIAR CARRITO
========================= */

function vaciarCarrito(){

carrito = [];

actualizarCarrito();

}

/* =========================
ABRIR CARRITO
========================= */

function toggleCart(){

document
.getElementById("cartPanel")
.classList.toggle("active");

}