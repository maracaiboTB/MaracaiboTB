/* ==========================
MODAL EDITAR
========================== */

function mostrarAlerta(titulo, texto, icono="error"){
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#ff8c42"
    });
}

async function confirmarAccion(
    titulo,
    texto,
    textoConfirmar="Sí, continuar"
){
    const resultado = await Swal.fire({
        title: titulo,
        text: texto,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: textoConfirmar,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#e56f1c",
        cancelButtonColor: "#6f5b4f",
        reverseButtons: true,
        focusCancel: true
    });
    return resultado.isConfirmed;
}

function abrirModal(
    id,
    nombre,
    precio,
    descripcion,
    categoria,
    stock,
    imagen,
    enPromocion,
    precioPromocional,
    esCombo,
    opcionesBebida,
    etiquetaDestacado,
    destacadoDesde,
    destacadoHasta
){

    const modal =
    document.getElementById("modalEditar");

    modal.style.display = "flex";

    document.getElementById("editId").value = id;
    document.getElementById("editNombre").value = nombre;
    document.getElementById("editPrecio").value = precio;
    document.getElementById("editDescripcion").value = descripcion;
    document.getElementById("editCategoria").value = categoria;
    document.getElementById("editStock").value = stock;
    document.getElementById("editPrecioPromocional").value =
        precioPromocional;
    document.getElementById("editTipoPublicacion").value =
        esCombo === "true"
            ? "combo"
            : (enPromocion === "true" ? "promocion" : "producto");
    document.getElementById("editOpcionesBebida").value =
        opcionesBebida;
    document.getElementById("editEtiquetaDestacado").value =
        etiquetaDestacado;
    document.getElementById("editDestacadoDesde").value =
        destacadoDesde;
    document.getElementById("editDestacadoHasta").value =
        destacadoHasta;
    document.getElementById("previewImagen").src = imagen;
    cargarOpciones(
        document.querySelector(".edit-combo-field"),
        opcionesBebida
    );
    actualizarConstructor("editar");

}

function cerrarModal(){

    document.getElementById("modalEditar")
    .style.display = "none";

}

function actualizarConstructor(modo){
    const editar = modo === "editar";
    const selector = document.getElementById(
        editar ? "editTipoPublicacion" : "tipoPublicacion"
    );
    if (!selector) return;

    const tipo = selector.value;
    const raiz = editar
        ? document.getElementById("modalEditar")
        : document.getElementById("tab-productos");

    raiz.querySelectorAll(
        editar ? ".edit-promo-field" : ".promo-field"
    ).forEach(campo => {
        campo.style.display = tipo === "promocion" ? "" : "none";
    });
    raiz.querySelectorAll(
        editar ? ".edit-combo-field" : ".combo-field"
    ).forEach(campo => {
        campo.style.display = tipo === "combo" ? "" : "none";
    });
    raiz.querySelectorAll(".destacado-field").forEach(campo => {
        campo.style.display = tipo === "producto" ? "none" : "";
    });
}

function sincronizarOpciones(contenedor){
    const valores = Array.from(
        contenedor.querySelectorAll(".option-chip")
    ).map(chip => chip.dataset.value);
    document.getElementById(
        contenedor.dataset.hiddenInput
    ).value = valores.join(",");
}

function crearChip(contenedor, valor){
    const limpio = valor.trim();
    if (!limpio) return;
    const existentes = Array.from(
        contenedor.querySelectorAll(".option-chip")
    ).map(chip => chip.dataset.value.toLowerCase());
    if (existentes.includes(limpio.toLowerCase())) return;

    const chip = document.createElement("span");
    chip.className = "option-chip";
    chip.dataset.value = limpio;
    chip.append(document.createTextNode(limpio));

    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.setAttribute("aria-label", `Quitar ${limpio}`);
    quitar.textContent = "×";
    quitar.onclick = () => {
        chip.remove();
        sincronizarOpciones(contenedor);
    };
    chip.appendChild(quitar);
    contenedor.querySelector(".option-chips").appendChild(chip);
}

function agregarOpcion(boton){
    const contenedor = boton.closest(".option-builder");
    const entrada = contenedor.querySelector(".option-input");
    crearChip(contenedor, entrada.value);
    entrada.value = "";
    entrada.focus();
    sincronizarOpciones(contenedor);
}

function cargarOpciones(contenedor, valores){
    if (!contenedor) return;
    contenedor.querySelector(".option-chips").innerHTML = "";
    String(valores || "").split(",").forEach(valor => {
        crearChip(contenedor, valor);
    });
    sincronizarOpciones(contenedor);
}

function filtrarTipoProducto(tipo, boton){
    document.querySelectorAll(".fila-producto-admin").forEach(fila => {
        fila.style.display =
            tipo === "todos" || fila.dataset.tipo === tipo
                ? "table-row"
                : "none";
    });
    document.querySelectorAll(".filtro-tipo").forEach(item => {
        item.classList.remove("active");
    });
    if (boton) {
        boton.classList.add("active");
    } else {
        document.querySelector(
            '.filtro-tipo[onclick*="todos"]'
        )?.classList.add("active");
    }
}

/* ==========================
GUARDAR CAMBIOS
========================== */

const formEditar =
document.getElementById("formEditar");

if(formEditar){

    formEditar.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const id =
            document.getElementById("editId")
            .value;

            const formData =
            new FormData();

            formData.append(
                "nombre",
                document.getElementById("editNombre").value
            );

            formData.append(
                "precio",
                document.getElementById("editPrecio").value
            );

            formData.append(
                "precio_promocional",
                document.getElementById("editPrecioPromocional").value
            );

            formData.append(
                "tipo_publicacion",
                document.getElementById("editTipoPublicacion").value
            );

            formData.append(
                "opciones_bebida",
                document.getElementById("editOpcionesBebida").value
            );

            formData.append(
                "etiqueta_destacado",
                document.getElementById("editEtiquetaDestacado").value
            );

            formData.append(
                "destacado_desde",
                document.getElementById("editDestacadoDesde").value
            );

            formData.append(
                "destacado_hasta",
                document.getElementById("editDestacadoHasta").value
            );

            formData.append(
                "descripcion",
                document.getElementById("editDescripcion").value
            );

            formData.append(
                "categoria",
                document.getElementById("editCategoria").value
            );

            formData.append(
                "stock",
                document.getElementById("editStock").value
            );

            const imagen =
            document.getElementById("editImagen");

            if(
                imagen &&
                imagen.files.length > 0
            ){
                formData.append(
                    "imagen",
                    imagen.files[0]
                );
            }

            fetch(
                `/editar-producto/${id}/`,
                {
                    method:"POST",

                    headers:{
                        "X-CSRFToken":
                        document.querySelector(
                            "[name=csrfmiddlewaretoken]"
                        ).value
                    },

                    body:formData
                }
            )
            .then(response => response.json())
            .then(async data => {

                if(data.success){

                    await mostrarAlerta(
                        "Producto actualizado",
                        "Los cambios se guardaron correctamente.",
                        "success"
                    );

                    cerrarModal();

                    location.reload();

                }else{

                    mostrarAlerta(
                        "No se pudo actualizar",
                        data.error || "Revisá los datos del producto."
                    );

                }

            })
            .catch(error => {

                console.error(error);

                mostrarAlerta(
                    "Error al actualizar",
                    error.message || "Intentá nuevamente."
                );

            });

        }
    );

}


function mostrarTab(tab, boton){

    document.getElementById("tab-productos").style.display = "none";

    const pedidos = document.getElementById("tab-pedidos");
    if(pedidos){
        pedidos.style.display = "none";
    }

    const usuarios = document.getElementById("tab-usuarios");
    if(usuarios){
        usuarios.style.display = "none";
    }

    const panel = document.getElementById("tab-" + tab);
    if (!panel) return;
    panel.style.display = "block";

    document.querySelectorAll(".tab-btn").forEach(item => {
        item.classList.remove("active");
    });
    const tabActivo = boton || document.querySelector(
        `.tab-btn[data-tab="${tab}"]`
    );
    tabActivo?.classList.add("active");

    if (tab === "pedidos"){
        const filtroActivo = document.querySelector(
            ".filtro-pedido.active"
        );
        filtrarPedidos(
            filtroActivo ? filtroActivo.dataset.filtro : "Activos",
            filtroActivo
        );
    }
}

function abrirModalUsuario(
    id,
    username,
    nombre,
    apellido,
    email,
    rol,
    activo
){
    const modal = document.getElementById("modalUsuario");
    const formulario = document.getElementById("formEditarUsuario");
    if (!modal || !formulario) return;

    formulario.action = `/usuarios/${id}/editar/`;
    document.getElementById("usuarioUsername").value = username;
    document.getElementById("usuarioNombre").value = nombre;
    document.getElementById("usuarioApellido").value = apellido;
    document.getElementById("usuarioEmail").value = email;
    document.getElementById("usuarioRol").value = rol;
    document.getElementById("usuarioActivo").checked = activo;
    modal.style.display = "flex";
}

function cerrarModalUsuario(){
    const modal = document.getElementById("modalUsuario");
    if (modal) modal.style.display = "none";
}

function verPedido(id){
    const detalle = document.getElementById(`detalle-pedido-${id}`);
    detalle.style.display =
        detalle.style.display === "none" ? "table-row" : "none";
}

function filtrarPedidos(filtro, boton){
    document.querySelectorAll(".filtro-pedido").forEach(item => {
        item.classList.remove("active");
    });
    if (boton){
        boton.classList.add("active");
        boton.dataset.filtro = filtro;
    }

    document.querySelectorAll(".fila-pedido").forEach(fila => {
        const estado = fila.dataset.estado;
        const esActivo = !["Entregado", "Cancelado"].includes(estado);
        const mostrar =
            filtro === "Todos" ||
            (filtro === "Activos" && esActivo) ||
            estado === filtro;

        fila.style.display = mostrar ? "table-row" : "none";

        if (!mostrar){
            const detalle = document.getElementById(
                `detalle-pedido-${fila.id.replace("pedido-", "")}`
            );
            if (detalle){
                detalle.style.display = "none";
            }
        }
    });
}

async function actualizarEstadoPedido(id, estado, enviarWhatsapp){
    if (estado === "Cancelado"){
        const confirmado = await confirmarAccion(
            "¿Cancelar este pedido?",
            "El pedido quedará registrado como cancelado.",
            "Sí, cancelar pedido"
        );
        if (!confirmado) return;
    }

    const ventanaWhatsapp = enviarWhatsapp
        ? window.open("", "_blank")
        : null;
    const formData = new FormData();
    formData.append("estado", estado);

    try {
        const response = await fetch(`/pedido/${id}/estado/`, {
            method: "POST",
            headers: {
                "X-CSRFToken":
                    document.querySelector(
                        "[name=csrfmiddlewaretoken]"
                    ).value
            },
            body: formData
        });
        const data = await response.json();

        if (!response.ok || !data.success){
            throw new Error(data.error || "No se pudo actualizar el pedido");
        }

        if (ventanaWhatsapp){
            const numeroOrden = data.numero_orden
                ? `#${data.numero_orden}`
                : `pedido #${id}`;
            const mensajes = {
                Preparando:
                    `Hola ${data.nombre} 👋 Ya estamos preparando tu pedido. Tu número de orden es ${numeroOrden}. Te avisaremos cuando esté listo.`,
                Listo:
                    `Hola ${data.nombre} 👋 Tu orden ${numeroOrden} ya está lista. ¡Te esperamos!`,
                Cancelado:
                    `Hola ${data.nombre}. Te informamos que tu ${numeroOrden} fue cancelada. Si necesitas ayuda, escríbenos.`
            };
            let telefono = data.telefono.replace(/\D/g, "");
            if (telefono.length === 8){
                telefono = `506${telefono}`;
            }
            ventanaWhatsapp.location.href =
                `https://wa.me/${telefono}?text=${encodeURIComponent(
                    mensajes[estado]
                )}`;
        }

        window.setTimeout(() => window.location.reload(), 500);
    } catch (error) {
        if (ventanaWhatsapp){
            ventanaWhatsapp.close();
        }
        mostrarAlerta(
            "No se pudo actualizar el pedido",
            error.message
        );
    }
}

document.querySelectorAll("[data-swal-confirm]").forEach(elemento => {
    const evento = elemento.tagName === "FORM" ? "submit" : "click";
    elemento.addEventListener(evento, async event => {
        event.preventDefault();
        const confirmado = await confirmarAccion(
            elemento.dataset.swalTitle,
            elemento.dataset.swalText,
            elemento.dataset.swalButton
        );
        if (!confirmado) return;

        if (elemento.tagName === "FORM"){
            elemento.submit();
        } else {
            window.location.href = elemento.href;
        }
    });
});

document.querySelectorAll(".option-input").forEach(entrada => {
    entrada.addEventListener("keydown", event => {
        if (event.key === "Enter"){
            event.preventDefault();
            agregarOpcion(
                entrada.closest(".option-entry").querySelector("button")
            );
        }
    });
});

actualizarConstructor("crear");

const tabSolicitado = new URLSearchParams(window.location.search).get("tab");
if (["pedidos", "usuarios"].includes(tabSolicitado)){
    mostrarTab(tabSolicitado);
}
