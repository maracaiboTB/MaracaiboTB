/* SLIDER */

const slides = document.querySelectorAll(".slide");

let current = 0;

function cambiarSlide() {

    slides[current].classList.remove("active");

    current = (current + 1) % slides.length;

    slides[current].classList.add("active");

}

setInterval(cambiarSlide, 4000);



let carrito = [];

/* =========================
CARRITO
========================= */

function agregarCarrito(producto){

    const existente = carrito.find(
        item => item.id === producto.id
    );

    if(existente){

        existente.cantidad++;

    }else{

        carrito.push({
            ...producto,
            cantidad:1
        });

    }

    actualizarCarrito();
}

/* AGREGAR */

/* =========================
AGREGAR AL CARRITO
========================= */

/* =========================
AGREGAR PRODUCTO
========================= */



/* ACTUALIZAR */

function actualizarCarrito() {

    const items = document.getElementById("cart-items");
    const total = document.getElementById("cart-total");
    const count = document.getElementById("cart-count");

    items.innerHTML = "";

    let totalPrecio = 0;
    let totalCantidad = 0;

    carrito.forEach((p, index) => {

        const subtotal = p.p * p.cantidad;

        totalPrecio += subtotal;
        totalCantidad += p.cantidad;

        items.innerHTML += `

        <div class="cart-item">

            <img src="${p.i}" alt="${p.n}">

            <div class="cart-info">

                <h4>${p.n}</h4>

                <p>₡${p.p}</p>

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
                    ₡${subtotal.toLocaleString()}
                </div>

            </div>

        </div>

        `;
    });

    total.innerText =
        `Total: ₡${totalPrecio.toLocaleString()}`;

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

        const subtotal =
            item.p * item.cantidad;

        total += subtotal;

        resumen +=
            `${item.cantidad}x ${item.n} - ₡${subtotal}\n`;

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

    totalPedido +=
        item.p * item.cantidad;

});

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

/* cerrar pedido */
cerrarPedido();

/* limpiar carrito */
carrito = [];
actualizarCarrito();

/* limpiar formulario */
this.reset();

/* abrir whatsapp con pequeño delay */
setTimeout(() => {

window.location.href = url;

}, 300);





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

