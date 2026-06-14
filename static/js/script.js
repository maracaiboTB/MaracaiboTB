/* SLIDER */

const slides = document.querySelectorAll(".slide");

let current = 0;

function cambiarSlide() {

    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");

}

setInterval(cambiarSlide, 4000);

/* =========================
PRODUCTOS BASE
========================= */

const productosBase = [

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
n:"Prusianos",
d:"Repostería dulce tradicional.",
p:"₡1,200",
i:"prusianos.jpg"
}

];

/* =========================
PRODUCTOS ADMIN
========================= */

const productosAdmin = JSON.parse(
localStorage.getItem("productos")
) || [];

/* =========================
UNIR PRODUCTOS
========================= */

const productos = [
...productosBase,
...productosAdmin
];

const grid = document.getElementById("grid");
const filtros = document.querySelectorAll(".filter");

function pintar(cat = "all") {

    grid.innerHTML = "";

    productos
        .filter(p => cat === "all" || p.c === cat)
        .forEach(p => {

            grid.innerHTML += `

<div class="card" onclick='abrir(${JSON.stringify(p)})'>

<div class="tag">
${p.c.toUpperCase()}
</div>

<img src="static/img/${p.i}" alt="${p.n}">

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

function abrir(p) {

    document.getElementById("mImg").src = "static/img/" + p.i;

    document.getElementById("mNombre").innerText = p.n;

    document.getElementById("mDesc").innerText = p.d;

    document.getElementById("mPrecio").innerText = p.p;

    document.getElementById("modal").style.display = "flex";

}

function cerrar() {

    document.getElementById("modal").style.display = "none";

}

window.onclick = function (e) {

    const modal = document.getElementById("modal");

    if (e.target === modal) {
        cerrar();
    }

}

filtros.forEach(btn => {

    btn.onclick = () => {

        filtros.forEach(x => x.classList.remove("active"));

        btn.classList.add("active");

        pintar(btn.dataset.cat);

    };

});

pintar();

/* =========================
CARRITO
========================= */


let carrito = [];

/* AGREGAR */

/* =========================
AGREGAR AL CARRITO
========================= */

/* =========================
AGREGAR PRODUCTO
========================= */

function agregarCarrito(producto) {

    const existente = carrito.find(
        item => item.n === producto.n
    );

    if (existente) {

        existente.cantidad += 1;

    } else {

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

function actualizarCarrito() {

    const items = document.getElementById("cart-items");

    const total = document.getElementById("cart-total");

    const count = document.getElementById("cart-count");

    items.innerHTML = "";

    let totalPrecio = 0;

    let totalCantidad = 0;

    carrito.forEach((p, index) => {

        const precioNumero = Number(
            p.p.replace("₡", "")
                .replace(",", "")
        );

        const subtotal = precioNumero * p.cantidad;

        totalPrecio += subtotal;

        totalCantidad += p.cantidad;

        items.innerHTML += `

<div class="cart-item">

<img src="static/img/${p.i}">

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

function cambiarCantidad(index, cambio) {

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);

    }

    actualizarCarrito();

}

/* =========================
VACIAR CARRITO
========================= */

function vaciarCarrito() {

    carrito = [];

    actualizarCarrito();

}

/* =========================
ABRIR CARRITO
========================= */

function toggleCart() {

    document
        .getElementById("cartPanel")
        .classList.toggle("active");

}

/* =========================
MOSTRAR FORMULARIO
========================= */

function mostrarFormulario() {

    if (carrito.length === 0) {

        alert("Tu carrito está vacío");

        return;

    }

    document
        .getElementById("pedidoModal")
        .style.display = "flex";

    let resumen = "";

    let total = 0;

    carrito.forEach(item => {

        const precio = Number(
            item.p.replace("₡", "")
                .replace(",", "")
        );

        const subtotal = precio * item.cantidad;

        total += subtotal;

        resumen += `${item.cantidad}x ${item.n} - ₡${subtotal}\n`;

    });

    resumen += `\nTotal: ₡${total}`;

    document
        .getElementById("productosPedido")
        .value = resumen;

}

function cerrarPedido() {

    document
        .getElementById("pedidoModal")
        .style.display = "none";

}

/* =========================
ENVIAR PEDIDO
========================= */

document
.getElementById("pedidoForm")
.addEventListener("submit", function (e) {

e.preventDefault();

const nombre =
document.getElementById("nombre").value;

const telefono =
document.getElementById("telefono").value;

const direccion =
document.getElementById("direccion").value;

const metodoPago =
document.getElementById("metodoPago").value;

const comentarios =
document.getElementById("comentarios").value;

const productos =
document.getElementById("productosPedido").value;

/* =========================
GUARDAR PEDIDO (PRIMERO SIEMPRE)
========================= */

const pedidos =
JSON.parse(localStorage.getItem("pedidos")) || [];

let totalPedido = 0;

carrito.forEach(item => {

const precio = Number(
item.p.replace("₡","").replace(",","")
);

totalPedido += precio * item.cantidad;

});

const nuevoPedido = {

id: Date.now(),
nombre,
telefono,
direccion,
productos,
total: totalPedido,
metodoPago,
comentarios,
fecha: new Date().toLocaleString(),
estado: "Pendiente"

};

pedidos.push(nuevoPedido);

localStorage.setItem(
"pedidos",
JSON.stringify(pedidos)
);

/* =========================
WHATSAPP DESPUÉS
========================= */

const mensaje = `
🥐 Nuevo Pedido

Nombre: ${nombre}
Tel: ${telefono}    
Dirección: ${direccion}
Total: ₡${totalPedido}
`;

const numero = "50686725494";

const url =
`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

/* limpiar carrito antes de salir */
carrito = [];
actualizarCarrito();
cerrarPedido();

/* abrir whatsapp */
window.location.href = url;

this.reset();

});



/* =========================
PREVIEW COMPROBANTE
========================= */
document
.getElementById("comprobante")
.addEventListener("change", function(){

    const file = this.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(e){

        preview.src = e.target.result;

        preview.style.display = "block";

    };

    reader.readAsDataURL(file);

});

const metodoPago =
document.getElementById("metodoPago");
const preview =
document.getElementById("previewComprobante");
const uploadBox =
document.getElementById("uploadBox");

metodoPago.addEventListener("change", function(){

    console.log(this.value);

    if(this.value === "Sinpe"){

        uploadBox.style.display = "block";

    }else{

        uploadBox.style.display = "none";

    }

});

/* CAMBIO SELECT */

metodoPago.addEventListener(
    "change",
    verificarMetodoPago
);

/* EJECUTAR AL CARGAR */

verificarMetodoPago();




/* =========================
TOAST
========================= */


function mostrarToast(texto, tipo="success"){

    const toast = document.createElement("div");

    toast.className = `toast ${tipo}`;

    toast.innerText = texto;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}
function alert(texto, tipo="error"){

    const toast = document.createElement("div");

    toast.className = `toast ${tipo}`;

    toast.innerText = texto;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}

