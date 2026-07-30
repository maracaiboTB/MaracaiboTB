/* ==========================
MODAL EDITAR
========================== */

function abrirModal(
    id,
    nombre,
    precio,
    descripcion,
    categoria,
    stock,
    imagen,
    tallas
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
    document.getElementById("editTallas").value = tallas;
    document.getElementById("previewImagen").src = imagen;

}

function cerrarModal(){

    document.getElementById("modalEditar")
    .style.display = "none";

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

            formData.append(
                "tallas",
                document.getElementById("editTallas").value
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
            .then(data => {

                if(data.success){

                    alert(
                        "Producto actualizado correctamente"
                    );

                    cerrarModal();

                    location.reload();

                }else{

                    alert(
                        data.error || "No se pudo actualizar"
                    );

                }

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Error al actualizar"
                );

            });

        }
    );

}


function mostrarTab(tab){

    document.getElementById("tab-productos").style.display = "none";

    const pedidos = document.getElementById("tab-pedidos");
    if(pedidos){
        pedidos.style.display = "none";
    }

    const config = document.getElementById("tab-config");
    if(config){
        config.style.display = "none";
    }

    document.getElementById(
        "tab-" + tab
    ).style.display = "block";

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
    if (
        estado === "Cancelado" &&
        !confirm("¿Seguro que deseas cancelar este pedido?")
    ){
        return;
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
        alert(error.message);
    }
}
