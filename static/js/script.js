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
.addEventListener("submit", async function (e) {

e.preventDefault();

let totalPedido = 0;

carrito.forEach(item => {
    totalPedido += Number(item.p) * item.cantidad;
});

const formData = new FormData();
formData.append("nombre", document.getElementById("nombre").value);
formData.append("telefono", document.getElementById("telefono").value);
formData.append("direccion", document.getElementById("direccion").value);
formData.append("metodo_pago", document.getElementById("metodoPago").value);
formData.append("comentarios", document.getElementById("comentarios").value);
formData.append("productos", JSON.stringify(
    carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad
    }))
));

const comprobante = document.getElementById("comprobante").files[0];
if (comprobante) {
    formData.append("comprobante", comprobante);
}

try {
    const response = await fetch("/crear-pedido/", {
        method: "POST",
        headers: {
            "X-CSRFToken":
                this.querySelector("[name=csrfmiddlewaretoken]").value
        },
        body: formData
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo guardar el pedido");
    }

/* =========================
WHATSAPP DESPUÉS
========================= */

const mensaje = `
🥐 Nuevo Pedido

Pedido: #${data.pedido_id}
Nombre: ${document.getElementById("nombre").value}
Tel: ${document.getElementById("telefono").value}
Dirección: ${document.getElementById("direccion").value}
Total: ₡${totalPedido}
`;

const numero = "50686725494";

const url =
`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

cerrarPedido();
carrito = [];
actualizarCarrito();
this.reset();

setTimeout(() => {
    window.location.href = url;
}, 300);
} catch (error) {
    mostrarToast(error.message, "error");
}

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

function verificarMetodoPago(){
    uploadBox.style.display =
        metodoPago.value === "Sinpe" ? "block" : "none";
}

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

