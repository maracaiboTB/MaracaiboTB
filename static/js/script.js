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

const sugerenciasModal = document.getElementById("sugerenciasModal");
const sugerenciasForm = document.getElementById("sugerenciasForm");

function abrirSugerencias(){
    sugerenciasModal.style.display = "flex";
    sugerenciasModal.setAttribute("aria-hidden", "false");
    sugerenciasForm.querySelector("textarea").focus();
}

function cerrarSugerencias(){
    sugerenciasModal.style.display = "none";
    sugerenciasModal.setAttribute("aria-hidden", "true");
}

sugerenciasForm.addEventListener("submit", async function(event){
    event.preventDefault();

    try {
        const response = await fetch("/sugerencias/", {
            method: "POST",
            headers: {
                "X-CSRFToken": this.querySelector(
                    "[name=csrfmiddlewaretoken]"
                ).value
            },
            body: new FormData(this)
        });
        const data = await response.json();

        if (!response.ok || !data.success){
            throw new Error(data.error || "No se pudo enviar la sugerencia.");
        }

        this.reset();
        cerrarSugerencias();
        mostrarToast("¡Gracias por tu sugerencia!");
    } catch (error) {
        mostrarToast(error.message, "error");
    }
});

const formatoColones = new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
});

function normalizarPrecio(valor) {
    if (typeof valor === "number") {
        return Number.isFinite(valor) ? valor : 0;
    }

    let texto = String(valor ?? "").trim().replace(/[₡\s]/g, "");
    if (texto.includes(",") && texto.includes(".")) {
        texto = texto.lastIndexOf(",") > texto.lastIndexOf(".")
            ? texto.replace(/\./g, "").replace(",", ".")
            : texto.replace(/,/g, "");
    } else if (texto.includes(",")) {
        texto = texto.replace(",", ".");
    }

    const precio = Number(texto);
    return Number.isFinite(precio) ? precio : 0;
}

function mostrarPrecio(valor) {
    return formatoColones.format(normalizarPrecio(valor));
}

/* =========================
CARRITO
========================= */

function agregarCarrito(producto){
    producto.p = normalizarPrecio(producto.p);
    producto.opcion = producto.opcion || "";

    const existente = carrito.find(
        item => (
            item.id === producto.id
            && item.opcion === producto.opcion
        )
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

function agregarDestacado(producto, selectId) {
    const selector = document.getElementById(selectId);
    producto.opcion = selector ? selector.value : "";
    agregarCarrito(producto);
    mostrarToast("Producto agregado al carrito");
}

function filtrarMenu(filtro, boton) {
    let visibles = 0;

    document.querySelectorAll(".menu-card").forEach(card => {
        let mostrar = filtro === "todos";

        if (filtro === "combo") {
            mostrar = card.dataset.combo === "true";
        } else if (filtro === "promocion") {
            mostrar = card.dataset.promocion === "true";
        } else if (filtro.startsWith("categoria:")) {
            const categoria = filtro.slice("categoria:".length)
                .trim()
                .toLocaleLowerCase("es");
            mostrar = card.dataset.categoria === categoria;
        }

        card.style.display = mostrar ? "" : "none";
        if (mostrar) visibles++;
    });

    document.querySelectorAll(".filter").forEach(item => {
        item.classList.remove("active");
    });
    boton.classList.add("active");

    const vacio = document.getElementById("emptyFilter");
    if (vacio) {
        vacio.style.display = visibles === 0 ? "block" : "none";
    }
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

        const subtotal = normalizarPrecio(p.p) * p.cantidad;

        totalPrecio += subtotal;
        totalCantidad += p.cantidad;

        items.innerHTML += `

        <div class="cart-item">

            <img src="${p.i}" alt="${p.n}">

            <div class="cart-info">

                <h4>${p.n}</h4>

                ${p.opcion ? `<small>${p.opcion}</small>` : ""}

                <p>₡${mostrarPrecio(p.p)}</p>

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
                    ₡${mostrarPrecio(subtotal)}
                </div>

            </div>

        </div>

        `;
    });

    total.innerText =
        `Total: ₡${mostrarPrecio(totalPrecio)}`;

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

        mostrarToast("Tu carrito está vacío", "error");
        return;
    }

    document
        .getElementById("pedidoModal")
        .style.display = "flex";

    let resumen = "";
    let total = 0;

    carrito.forEach(item => {

        const subtotal =
            normalizarPrecio(item.p) * item.cantidad;

        total += subtotal;

        resumen +=
            `${item.cantidad}x ${item.n}${item.opcion
                ? ` (${item.opcion})`
                : ""} - ₡${mostrarPrecio(subtotal)}\n`;

    });

    resumen += `\nTotal: ₡${mostrarPrecio(total)}`;

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

const formData = new FormData();
formData.append("nombre", document.getElementById("nombre").value);
formData.append("telefono", document.getElementById("telefono").value);
formData.append("direccion", document.getElementById("direccion").value);
formData.append("metodo_pago", document.getElementById("metodoPago").value);
formData.append("comentarios", document.getElementById("comentarios").value);
formData.append("productos", JSON.stringify(
    carrito.map(item => ({
        id: item.id,
        cantidad: item.cantidad,
        opcion: item.opcion || ""
    }))
));

const comprobante = document.getElementById("comprobante").files[0];
if (document.getElementById("metodoPago").value === "Sinpe" && !comprobante) {
    Swal.fire({
        icon: "warning",
        title: "Comprobante requerido",
        text: "Debes enviar el comprobante de pago SINPE para continuar.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#e56f1c"
    });
    return;
}

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
Total: ₡${mostrarPrecio(data.total)}
`;

const numero = "50670143326";

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
const sinpePaymentInfo =
document.getElementById("sinpePaymentInfo");
const copySinpeButton =
document.getElementById("copySinpeButton");
const sinpeNumber =
document.getElementById("sinpeNumber");

async function copiarNumeroSinpe(event) {
    event.preventDefault();
    event.stopPropagation();

    const numero = sinpeNumber.dataset.copyNumber || sinpeNumber.textContent.trim();

    try {
        await navigator.clipboard.writeText(numero);
    } catch (error) {
        const areaTemporal = document.createElement("textarea");
        areaTemporal.value = numero;
        areaTemporal.setAttribute("readonly", "");
        areaTemporal.style.position = "fixed";
        areaTemporal.style.opacity = "0";
        document.body.appendChild(areaTemporal);
        areaTemporal.select();
        document.execCommand("copy");
        areaTemporal.remove();
    }

    copySinpeButton.textContent = "¡Copiado!";
    mostrarToast("Número SINPE copiado");

    setTimeout(() => {
        copySinpeButton.textContent = "Copiar";
    }, 2000);
}

copySinpeButton.addEventListener("click", copiarNumeroSinpe);

function verificarMetodoPago(){
    const esSinpe = metodoPago.value === "Sinpe";
    uploadBox.style.display = esSinpe ? "block" : "none";
    sinpePaymentInfo.style.display = esSinpe ? "block" : "none";
}

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

